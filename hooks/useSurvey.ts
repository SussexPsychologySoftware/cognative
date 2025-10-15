import {useCallback, useMemo, useState} from "react";
import {Alert} from "react-native";

interface questions {
    question: string,
    required?: boolean,
    default?: any,
}

// type ResponseValue = string | number | Date | null; //TODO

export function useSurvey(questions: questions[], onSubmit?: (data: object) => void) {
    const [responses, setResponses] = useState(
        Object.fromEntries(questions.map(q => [q.question, q.default? q.default : '']))
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
            if(q.required && isEmpty(responses[q.question])) {
                return q.question
            }
        }
        return ''
    }, [questions, responses])

    const resetSurvey = useCallback(() => {
        setResponses(Object.fromEntries(
            questions.map(q => [q.question, q.default ?? ''])
        ));
        setWarning('');
    }, [questions]);

    const progress = useMemo(() => {
        const answered = Object.values(responses).filter(r => !isEmpty(r)).length;
        return (answered / questions.length) * 100;
    }, [responses, questions.length]);

    const handleSurveySubmit = useCallback(async () => {
        if (isSubmitting) return;
        try {
            setIsSubmitting(true);
            const firstInvalidResponse = validateResponses()
            if(firstInvalidResponse!=='') {
                setWarning(`Please answer question: ${firstInvalidResponse}`);
                Alert.alert('Submission Failed',`Please answer question titled: ${firstInvalidResponse}`)
                return false;
            }
            setWarning('');
            if(onSubmit) await onSubmit(responses)
            Alert.alert('Submitted',JSON.stringify(responses))
            return true
        } catch (error) {
            console.error('Error submitting survey:', error);
            setWarning(`Failed to submit. Please try again. ${error}`);
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
        progress
    };
}
