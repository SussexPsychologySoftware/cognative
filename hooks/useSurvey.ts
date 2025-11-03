import {useCallback, useEffect, useMemo, useState} from "react";
import {Alert} from "react-native";
import {SurveyDataType, SurveyComponent, SurveyQuestion, displayOnlyTypes} from '@/types/surveyQuestions'
import {DataService} from "@/services/data/DataService";

// useSurvey is a form manager which turns questions into responses, checks them, and triggers a save

// Initialize responses from survey definition
// Type Predicate (guard) for survey inputs
function isSurveyInput(question: SurveyComponent): question is SurveyQuestion {
    return !displayOnlyTypes.includes(question.type);
}

// TODO: figure out how to make responses take in ResponseType = Record<string, SurveyDataType>
function initializeResponses(questions: SurveyComponent[]): Record<string, any> {
    const responses: Record<string, any> = {};

    for (const question of questions) {
        if (!isSurveyInput(question)) continue;
        const key = question.key || question.question;

        // Initialise the special nested likertGrid response type
        if (question.type === 'likertGrid') {
            responses[key] = {};
            question.statements?.forEach((statement, index) => {
                responses[key][statement] = question.default ?? null;
            });
        } else {
            responses[key] = question.default ?? null;
        }

        // Separately add volume
        if (question.type === 'audio' && question.volumeControls) {
            // TODO: this is a little messy...maybe use a standard return of:
            //  {runtime: '00.00.00', currentlyPlaying: true, finished: false, volume: 0.5}
            responses[key + '.volume'] = question.volume ?? .5; // Default to provided volume or half way
        }
    }

    return responses;
}

async function restoreResponses(restoreKey: string){
    const data = await DataService.getData(restoreKey)
    if(!data) return null
    return data
}

export function useSurvey(questions: SurveyComponent[] | undefined, onSubmit?: (data: object) => void, filename?: string) {
    const [responses, setResponses] = useState(initializeResponses(questions || []));
    const [isLoading, setIsLoading] = useState(!!filename);
    const [warning, setWarning] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [invalidQuestions, setInvalidQuestions] = useState<Set<string>>(new Set());

    // Restore responses on mount if filename is provided
    useEffect(() => {
        if (filename) {
            restoreResponses(filename).then(data => {
                if (data && questions) {
                    // Create a mutable copy of the restored data
                    const processedData = { ...data };

                    // Stop autoplay for audio - don't restore if 'currently playing'/ true
                    for (const question of questions) {
                        if (question.type === 'audio') {
                            const key = question.key || question.question;
                            // Reset to default if restored state is 'true' (playing),
                            if (processedData[key] === true) {
                                processedData[key] = question.default ?? false;
                            }
                        }
                    }

                    // Set the fully processed data as the response state
                    setResponses(processedData);
                }
                setIsLoading(false);
            }).catch(error => {
                console.error('Error restoring responses:', error);
                setIsLoading(false);
            });
        } else {
            setIsLoading(false); // Not loading if filename doesn't exist
        }
    }, [filename, questions]);

    const updateResponses = useCallback((key: string, answer: SurveyDataType, nestedKey?: string) => {
        setResponses(prev => {
            if (nestedKey) {
                return {
                    ...prev,
                    [key]: {
                        ...prev[key],
                        [nestedKey]: answer
                    }
                };
            }

            return {
                ...prev,
                [key]: answer
            };
        });

        // Clear invalid status when user updates
        setInvalidQuestions(prev => {
            const next = new Set(prev);
            next.delete(key);
            return next;
        });
    }, []);

    const isEmpty = (value: any) => {
        return value === null || value === undefined || value === '' ||
            (typeof value === 'string' && value.trim() === '');
    };

    const checkDisplayConditions = useCallback((question: SurveyComponent) => {
        if(question.conditions && question.conditions.length > 0) {
            let conditionMatched = false
            for(let i=0; i<question.conditions.length; i++) {
                const condition = question.conditions[i]
                if(responses[condition.key] !== undefined && responses[condition.key] === condition.value){
                    conditionMatched = true
                }
            }
            if(!conditionMatched) return false;
        }
        return true
    },[responses])

    const validateResponses = useCallback(() => {

        if (!questions) return ''; // Return if no questions
        const invalid = new Set<string>();
        let firstInvalidQuestion = '';

        for (const question of questions) {
            if (!isSurveyInput(question)) continue;
            if (!question.required) continue;

            const key = question.key || question.question;
            const response = responses[key];

            if(question.required) {
                // Handle conditional question
                const isDisplayed = checkDisplayConditions(question)
                if(!isDisplayed) continue

                let isInvalid = false;
                if (question.type === 'likertGrid') {
                    // Find the first empty statement
                    for (let i = 0; i < question.statements.length; i++) {
                        if (isEmpty(response[question.statements[i]])) {
                            isInvalid = true;
                            if (!firstInvalidQuestion) {
                                firstInvalidQuestion = question.statements[i];
                            }
                            break;
                        }
                    }
                } else if(question.type === 'checkbox' && (isEmpty(response) || response===false)) {
                    isInvalid = true;
                    if (!firstInvalidQuestion) {
                        firstInvalidQuestion = question.label;
                    }
                } else if (question.type === 'audio' && response !== 'finished') {
                    isInvalid = true;
                    if (!firstInvalidQuestion) {
                        firstInvalidQuestion = 'Please listen to the audio file above in full';
                    }
                } else if (isEmpty(response)) {
                    isInvalid = true;
                }

                if (isInvalid) {
                    invalid.add(key);
                    if (!firstInvalidQuestion) {
                        firstInvalidQuestion = question.question;
                    }
                }
            }
        }

        setInvalidQuestions(invalid);
        return firstInvalidQuestion;
    }, [checkDisplayConditions, questions, responses]);

    const resetSurvey = useCallback(() => {
        setResponses(initializeResponses(questions||[]));
        setWarning('');
        setInvalidQuestions(new Set());
    }, [questions]);

    const progress = useMemo(() => {
        if (!questions) return 0; // Return 0 if no questions
        let totalQuestions = 0;
        let answeredQuestions = 0;

        for (const question of questions) {
            if (!isSurveyInput(question)) continue;
            const key = question.key || question.question;
            const response = responses[key];
            const isDisplayed = checkDisplayConditions(question)
            if(!isDisplayed) continue
            if (question.type === 'likertGrid') {
                const expectedCount = question.statements?.length || 0;
                totalQuestions += expectedCount;

                if (response && typeof response === 'object') {
                    answeredQuestions += Object.values(response).filter(v => !isEmpty(v)).length;
                }
            } else {
                totalQuestions += 1;
                if(question.type === 'audio'){
                    if(response === 'finished') answeredQuestions += 1;
                } else if (!isEmpty(response)) {
                    answeredQuestions += 1;
                }
            }
        }

        return totalQuestions > 0 ? Math.ceil((answeredQuestions / totalQuestions) * 100) : 0;
    }, [questions, responses, checkDisplayConditions]);

    const handleSurveySubmit = useCallback(async () => {
        if (isSubmitting) return false;

        try {
            setIsSubmitting(true);
            const firstInvalidResponse = validateResponses();

            if (firstInvalidResponse !== '') {
                setWarning(`Please answer question: ${firstInvalidResponse}`);
                Alert.alert('Submission Failed', `Please answer question: ${firstInvalidResponse}`);
                return false;
            }

            setWarning('');

            if (onSubmit) {
                //Inversion of Control principal - useSurvey is generic question-response manager without useExperiment
                    // The caller with onSubmit tells it what to do with saving responses.
                await onSubmit(responses); // Await does nothing but optional async
            }

            // Alert.alert('Submitted', JSON.stringify(responses, null, 2));
            return true;
        } catch (error) {
            console.error('Error submitting survey:', error);
            setWarning(`Failed to submit. Please try again. ${error}`);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, onSubmit, responses, validateResponses]);

    return {
        responses,
        updateResponses,
        handleSurveySubmit,
        warning,
        isSubmitting,
        resetSurvey,
        progress,
        invalidQuestions,
        isLoading
    };
}
