import {StyleSheet, View, Text} from 'react-native';
import {globalStyles} from "@/styles/appStyles";
import NumericInput from "@/components/basic/NumericInput";
import React from "react";
import {SurveyQuestion} from '@/types/surveyQuestions';
import MultilineTextInput from "@/components/basic/MultilineTextInput";
import RadioList from "@/components/survey/RadioList";
import TimePicker from "@/components/basic/TimePicker";
import LikertRadioGrid from "@/components/survey/LikertRadioGrid";
import SubmitButton from "@/components/basic/SubmitButton";

interface SurveyProps {
    questions: SurveyQuestion[];
    responses: Record<string, any>;
    updateResponses: (key: string, answer: any, nestedKey?: string) => void;
    handleSurveySubmit: () => Promise<boolean>;
    warning: string;
    isSubmitting: boolean;
    progress: number;
}

export default function Survey({
                                   questions,
                                   responses,
                                   updateResponses,
                                   handleSurveySubmit,
                                   warning,
                                   isSubmitting,
                                   progress,
                               }: SurveyProps) {
    return (
        <View style={styles.container}>
            {questions.map((question, index) => {
                const key = question.key || question.question;
                let input;
                let title = question.question;

                switch (question.type) {
                    case 'number':
                        input = <NumericInput
                            value={responses[key]}
                            placeholder={question.placeholder}
                            onChange={(newValue: string) => updateResponses(key, newValue)}
                        />;
                        break;
                    case 'multiline':
                        input = <MultilineTextInput
                            value={responses[key]}
                            placeholder={question.placeholder}
                            onChange={(newValue: string) => updateResponses(key, newValue)}
                        />;
                        break;
                    case 'radio':
                        input = <RadioList
                            options={question.options || []}
                            value={responses[key]}
                            onSelect={(newValue: string) => updateResponses(key, newValue)}
                        />;
                        break;
                    case 'time':
                        input = <TimePicker
                            value={responses[key]}
                            onChange={(newValue: Date | null) => updateResponses(key, newValue)}
                        />;
                        break;
                    case 'likertGrid':
                        input = <LikertRadioGrid
                            questions={question.statements}
                            options={question.options}
                            responses={responses[key]}
                            onChange={(statementKey: string, answer: string) => {
                                updateResponses(key, answer, statementKey);
                            }}
                        />;
                        break;
                    default:
                        input = <Text>Unsupported question type: {(question as any).type}</Text>;
                }

                return (
                    <View key={`question-${index}`} style={styles.questionContainer}>
                        {title && <Text style={globalStyles.question}>{title}:</Text>}
                        {input}
                    </View>
                );
            })}

            <View style={styles.footerContainer}>
                <Text style={globalStyles.whiteText}>Progress: {progress.toFixed(0)}%</Text>

                {warning ? <Text style={globalStyles.warning}>{warning}</Text> : null}

                <SubmitButton
                    onPress={async() => {await handleSurveySubmit()}}
                    text={"Submit"}
                    disabledText={"Submitting..."}
                    disabled={isSubmitting}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 25,
    },
    questionContainer: {
        gap: 10,
    },
    footerContainer: {
        gap: 15,
        marginTop: 20,
    }
});
