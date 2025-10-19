import {StyleSheet, View, Text} from 'react-native';
import {globalStyles} from "@/styles/appStyles";
import NumericInput from "@/components/basic/NumericInput";
import React from "react";
// Assuming SurveyQuestion can represent both single and Likert grid questions
import {SurveyQuestion} from '@/types/surveyQuestions';
import MultilineTextInput from "@/components/basic/MultilineTextInput";
import RadioList from "@/components/survey/RadioList";
import TimePicker from "@/components/basic/TimePicker";
import LikertRadioGrid from "@/components/survey/LikertRadioGrid";
import SubmitButton from "@/components/basic/SubmitButton";

// Props now include everything needed from the useSurvey hook
interface SurveyProps {
    questions: SurveyQuestion[];
    responses: Record<string, any>;
    updateResponses: (index: number, answer: any, question?: string) => void;
    handleSurveySubmit: () => Promise<boolean>;
    warning: string;
    isSubmitting: boolean;
    progress: number;
    extractNestedResponses: (parentKey: string) => Record<string, any>;
}

export default function Survey({
                                   questions,
                                   responses,
                                   updateResponses,
                                   handleSurveySubmit,
                                   warning,
                                   isSubmitting,
                                   progress,
                                   extractNestedResponses
                               }: SurveyProps) {
    // TODO pass custom props in?

    return (
        <View style={styles.container}>
            {
                questions.map((question, index) => {
                    let input;
                    let title = question.question;

                    switch (question.type) {
                        case 'number':
                            input = <NumericInput
                                value={responses[index].response}
                                placeholder={question.placeholder}
                                onChange={(newValue: string) => updateResponses(index, newValue)}
                            />;
                            break;
                        case 'multiline':
                            input = <MultilineTextInput
                                value={responses[index].response}
                                placeholder={question.placeholder}
                                onChange={(newValue: string) => updateResponses(index, newValue)}
                            />;
                            break;
                        case 'radio':
                            input = <RadioList
                                options={question.options || []}
                                value={responses[index].response}
                                onSelect={(newValue: string) => updateResponses(index, newValue)}
                            />;
                            break;
                        case 'time':
                            input = <TimePicker
                                value={responses[index].response}
                                onChange={(newValue: Date | null) => updateResponses(index, newValue)}
                            />;
                            break;
                        case 'likertGrid':
                            input = <LikertRadioGrid
                                questions={question.statements}
                                options={question.options}
                                // THIS IS AN ISSUE - how are the responses going to work?
                                responses={responses[index].response}
                                onChange={(q: string, a: string) => {
                                    updateResponses(index, a, q);
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
                })
            }

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
