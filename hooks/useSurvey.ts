import {useCallback, useMemo, useState} from "react";
import {Alert} from "react-native";
import {SurveyQuestion} from '@/types/surveyQuestions'

// Initialize responses from survey definition
function initializeResponses(questions: SurveyQuestion[]): Record<string, any> {
    const responses: Record<string, any> = {};

    for (const question of questions) {
        const key = question.key || question.question; // fallback to question text if no key

        if (question.type === 'likertGrid') {
            // Initialize nested object for likert grids
            responses[key] = {};
            question.statements?.forEach((statement, index) => {
                responses[key][statement] = '';
            });
        } else {
            // Initialize simple value for single-input questions
            responses[key] = '';
        }
    }

    return responses;
}

export function useSurvey(questions: SurveyQuestion[], onSubmit?: (data: object) => void) {
    const [responses, setResponses] = useState(() => initializeResponses(questions));
    const [warning, setWarning] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEmpty = (value: any) => {
        return value === null || value === undefined || value === '' ||
            (typeof value === 'string' && value.trim() === '');
    };

    const updateResponses = useCallback((key: string, answer: any, nestedKey?: string) => {
        setResponses(prev => {
            if (nestedKey) {
                // For likert grids: update nested object
                return {
                    ...prev,
                    [key]: {
                        ...prev[key],
                        [nestedKey]: answer
                    }
                };
            }

            // For simple questions
            return {
                ...prev,
                [key]: answer
            };
        });
    }, []);

    const validateResponses = useCallback(() => {
        for (const question of questions) {
            const key = question.key || question.question;
            const response = responses[key];

            if (question.required) {
                if (question.type === 'likertGrid') {
                    const gridResponse = response as Record<string, any>;
                    const expectedCount = question.statements?.length || 0;

                    if (!gridResponse || Object.keys(gridResponse).length !== expectedCount) {
                        return question.name || question.question;
                    }

                    // Check all nested responses are filled
                    for (const value of Object.values(gridResponse)) {
                        if (isEmpty(value)) {
                            return question.name || question.question;
                        }
                    }
                } else if (isEmpty(response)) {
                    return question.question;
                }
            }
        }
        return '';
    }, [questions, responses]);

    const resetSurvey = useCallback(() => {
        setResponses(initializeResponses(questions));
        setWarning('');
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
    };
}
