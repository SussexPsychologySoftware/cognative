import {useCallback, useMemo, useState} from "react";
import {Alert} from "react-native";
import {SingleInputQuestion, SurveyQuestion, LikertGridQuestion} from '@/types/surveyQuestions'

// Helper to group flat dot-notation responses into nested structure
export function groupResponses(responses: Record<string, any>): Record<string, any> {
    const grouped: Record<string, any> = {};

    for (const [key, value] of Object.entries(responses)) {
        if (key.includes('.')) {
            const [parent, ...rest] = key.split('.');
            if (!grouped[parent]) grouped[parent] = {};
            grouped[parent][rest.join('.')] = value;
        } else {
            grouped[key] = value;
        }
    }

    return grouped;
}

export function useSurvey(questions: SurveyQuestion[], onSubmit?: (data: object) => void) {
    const [responses, setResponses] = useState(questions);
    const [warning, setWarning] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEmpty = (value: any) => {
        return value === null || value === undefined || value === '' ||
            (typeof value === 'string' && value.trim() === '');
    };

    const updateResponses = (index: number, answer: any, question?: string) => {
        setResponses(prev => prev.map((item, i) => {
            if (i !== index) return item;

            if (item.type === 'likertGrid' && question) {
                return {
                    ...item,
                    response: {
                        ...(item.response as Record<string, any>),
                        [question]: answer
                    }
                };
            }

            return { ...item, response: answer };
        }));
        console.log(responses)
    };

    const validateResponses = useCallback(() => {
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const response = responses[i]?.response;

            if (q.required) {
                if (q.type === 'likertGrid') {
                    const gridResponse = response as Record<string, any>;
                    if (!gridResponse || Object.keys(gridResponse).length !== q.statements.length) {
                        return q.name;
                    }
                } else if (isEmpty(response)) {
                    return q.question;
                }
            }
        }
        return '';
    }, [questions, responses]);

    const resetSurvey = useCallback(() => {
        setResponses(questions);
        setWarning('');
    }, [questions]);

    const extractNestedResponses = (parentKey: string) => {
        return Object.fromEntries(
            Object.entries(responses)
                .filter(([key]) => key.startsWith(parentKey))
                .map(([key, value]) => [key.replace(parentKey, ''), value])
        );
    }

    const progress = useMemo(() => {
        const answered = Object.values(responses).filter(r => !isEmpty(r)).length;
        return (answered / questions.length) * 100;
    }, [responses, questions.length]);

    // TODO: maybe doesn't belong here?
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

            // Group responses before submitting
            const groupedResponses = groupResponses(responses);

            if (onSubmit) await onSubmit(groupedResponses);
            Alert.alert('Submitted', JSON.stringify(groupedResponses, null, 2));
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
        extractNestedResponses
    };
}
