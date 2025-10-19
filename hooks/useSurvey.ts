import {useCallback, useMemo, useState} from "react";
import {Alert} from "react-native";
import {SurveyQuestion} from '@/types/surveyQuestions'

// Initialize responses from survey definition
function initializeResponses(questions: SurveyQuestion[]): Record<string, any> {
    const responses: Record<string, any> = {};

    for (const question of questions) {
        const key = question.key || question.question;

        if (question.type === 'likertGrid') {
            responses[key] = {};
            question.statements?.forEach((statement, index) => {
                responses[key][statement] = '';
            });
        } else {
            responses[key] = '';
        }
    }

    return responses;
}

export function useSurvey(questions: SurveyQuestion[], onSubmit?: (data: object) => void) {
    const [responses, setResponses] = useState(() => initializeResponses(questions));
    const [warning, setWarning] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [invalidQuestions, setInvalidQuestions] = useState<Set<string>>(new Set());

    const isEmpty = (value: any) => {
        return value === null || value === undefined || value === '' ||
            (typeof value === 'string' && value.trim() === '');
    };

    const updateResponses = useCallback((key: string, answer: any, nestedKey?: string) => {
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

    const validateResponses = useCallback(() => {
        const invalid = new Set<string>();
        let firstInvalidQuestion = '';

        for (const question of questions) {
            const key = question.key || question.question;
            const response = responses[key];

            if (question.required) {
                let isInvalid = false;

                if (question.type === 'likertGrid') {
                    const gridResponse = response as Record<string, any>;
                    const expectedCount = question.statements?.length || 0;

                    if (!gridResponse || Object.keys(gridResponse).length !== expectedCount) {
                        isInvalid = true;
                    } else {
                        for (const value of Object.values(gridResponse)) {
                            if (isEmpty(value)) {
                                isInvalid = true;
                                break;
                            }
                        }
                    }
                } else if (isEmpty(response)) {
                    isInvalid = true;
                }

                if (isInvalid) {
                    invalid.add(key);
                    if (!firstInvalidQuestion) {
                        firstInvalidQuestion = question.name || question.question;
                    }
                }
            }
        }

        setInvalidQuestions(invalid);
        return firstInvalidQuestion;
    }, [questions, responses]);

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

            if (onSubmit) await onSubmit(responses);
            Alert.alert('Submitted', JSON.stringify(responses, null, 2));
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
    };
}
