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

export function useSurvey(questions: SingleInputQuestion[], onSubmit?: (data: object) => void) {
    const [responses, setResponses] = useState(
        Object.fromEntries(
            questions.map(
                q => [q.question, q.default ?? '']
            )
        )
    );

    const [warning, setWarning] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEmpty = (value: any) => {
        return value === null || value === undefined || value === '' ||
            (typeof value === 'string' && value.trim() === '');
    };

    const updateResponses = (question: string, answer: any) => {
        setResponses({ ...responses, [question]: answer });
    };

    const validateResponses = useCallback(() => {
        for (const q of questions) {
            if (q.required && isEmpty(responses[q.question])) {
                return q.question;
            }
        }
        return '';
    }, [questions, responses]);

    const resetSurvey = useCallback(() => {
        setResponses(Object.fromEntries(
            questions.map(q => [q.question, q.default ?? ''])
        ));
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

    const handleSurveySubmit = useCallback(async () => {
        if (isSubmitting) return;

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
