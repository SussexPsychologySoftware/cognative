import {useCallback, useEffect, useMemo, useState} from "react";
import {Alert} from "react-native";
import {SurveyQuestion} from '@/types/surveyQuestions'
import {DataService} from "@/services/data/DataService";
import { useExperiment } from "@/context/ExperimentContext";

// Initialize responses from survey definition
function initializeResponses(questions: SurveyQuestion[]): Record<string, any> {
    const responses: Record<string, any> = {};

    for (const question of questions) {
        const key = question.key || question.question;

        if (question.type === 'likertGrid') {
            responses[key] = {};
            question.statements?.forEach((statement, index) => {
                responses[key][statement] = question.default??'';
            });
        } else {
            responses[key] = question.default??'';
        }
    }

    return responses;
}

async function restoreResponses(restoreKey: string){
    const data = await DataService.getData(restoreKey)
    if(!data) return null
    return data
}

export function useSurvey(questions: SurveyQuestion[], onSubmit?: (data: object, filename?:string) => void, filename?: string) {
    const [responses, setResponses] = useState(initializeResponses(questions));
    const [isLoading, setIsLoading] = useState(!!filename);
    const [warning, setWarning] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [invalidQuestions, setInvalidQuestions] = useState<Set<string>>(new Set());

    const { state } = useExperiment();

// Restore responses on mount if filename is provided
    useEffect(() => {
        if (filename) {
            restoreResponses(filename).then(data => {
                if (data) {
                    // Create a mutable copy of the restored data
                    const processedData = { ...data };

                    // Loop through questions to find and process 'time' types
                    for (const question of questions) {
                        const key = question.key || question.question;

                        // Check if this question is a time picker
                        if (question.type === 'time') {
                            const storedValue = processedData[key];

                            // Re-hydrate the ISO string back into a Date object
                            // Also handles empty strings or null, which TimePicker accepts as null
                            if (storedValue && typeof storedValue === 'string') {
                                processedData[key] = new Date(storedValue);
                            } else {
                                // Ensure null/undefined/'' becomes null, which TimePicker handles
                                processedData[key] = null;
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
        }
    }, [filename, questions]);

    const updateResponses = useCallback((key: string, answer: any, nestedKey?: string) => {
        // console.log({ key, answer, nestedKey });

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

    const checkDisplayConditions = useCallback((question: SurveyQuestion) => {
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
        const invalid = new Set<string>();
        let firstInvalidQuestion = '';

        for (const question of questions) {
            const key = question.key || question.question;
            const response = responses[key];

            if (question.required) {
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
        setResponses(initializeResponses(questions));
        setWarning('');
        setInvalidQuestions(new Set());
    }, [questions]);

    const progress = useMemo(() => {
        let totalQuestions = 0;
        let answeredQuestions = 0;

        for (const question of questions) {
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
                if (!isEmpty(response)) {
                    answeredQuestions += 1;
                }
            }
        }

        return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
    }, [responses, questions]);
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
                await onSubmit(responses, filename);
            } else if (filename && state?.participantId) {
                // TODO: add save by default
                console.log('Participant ID is:', state?.participantId);
            }

            Alert.alert('Submitted', JSON.stringify(responses, null, 2));
            return true;
        } catch (error) {
            console.error('Error submitting survey:', error);
            setWarning(`Failed to submit. Please try again. ${error}`);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, onSubmit, responses, filename, state?.participantId, validateResponses]);

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
