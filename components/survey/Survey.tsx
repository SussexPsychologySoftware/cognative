import {StyleSheet, View, Text, TextInput} from 'react-native';
import {globalStyles} from "@/styles/appStyles";
import NumericInput from "@/components/inputs/NumericInput";
import React from "react";
import {SurveyQuestion} from '@/types/surveyQuestions';
import MultilineTextInput from "@/components/inputs/MultilineTextInput";
import RadioList from "@/components/inputs/RadioList";
import TimePicker from "@/components/inputs/TimePicker";
import LikertGrid from "@/components/survey/LikertGrid";
import SubmitButton from "@/components/inputs/SubmitButton";
import Tickbox from "@/components/inputs/Tickbox";
import Range from "@/components/inputs/Range";
import Select from "@/components/inputs/Select";
import LikertSingle from "@/components/inputs/LikertSingle";

interface SurveyProps {
    questions: SurveyQuestion[];
    responses: Record<string, any>;
    updateResponses: (key: string, answer: any, nestedKey?: string) => void;
    handleSurveySubmit?: () => Promise<boolean>;
    warning?: string;
    isSubmitting?: boolean;
    progress?: number;
    invalidQuestions?: Set<string>;
}

export default function Survey({
                                   questions,
                                   responses,
                                   updateResponses,
                                   handleSurveySubmit,
                                   warning,
                                   isSubmitting,
                                   progress,
                                   invalidQuestions,
                               }: SurveyProps) {
    return (
        <View style={styles.container}>
            {questions.map((question, index) => {
                const key = question.key || question.question;
                const isInvalid = invalidQuestions?.has(key) ?? false;
                let input;
                let title = question.question;

                // Check for conditional question
                if(question.conditions && question.conditions.length > 0) {
                    let conditionMatched = false
                    for(let i=0; i<question.conditions.length; i++) {
                        const condition = question.conditions[i]
                        if(responses[condition.key] !== undefined && responses[condition.key] === condition.value){
                            conditionMatched = true
                        }
                    }
                    if(!conditionMatched) return null
                }

                // Get input type
                switch (question.type) {
                    case "text":
                        input = <TextInput
                            value={responses[key]}
                            placeholder={question.placeholder}
                            placeholderTextColor={'grey'}
                            style={globalStyles.input}
                            onChangeText={newValue => updateResponses(key, newValue)}
                        />
                        break;
                    case 'number':
                        input = <NumericInput
                            value={responses[key]}
                            placeholder={question.placeholder}
                            onChange={newValue => updateResponses(key, newValue)}
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
                    case 'checkbox':
                        // TODO: question should maybe be in the text section?
                        input = <Tickbox
                            checked={responses[key]}
                            text={question.label}
                            onChange={(newValue: boolean) => updateResponses(key, newValue)}
                        />;
                        break;
                    case 'slider':
                        input = <Range
                            value={responses[key]}
                            min={question.min}
                            max={question.max}
                            onChange={(newValue: number) => updateResponses(key, newValue)}
                            step={question.step}
                            showValue={true}
                            labels={question.labels}
                        />;
                        break;
                    case 'likertSingle':
                        input = <LikertSingle
                            value={responses[key]}
                            options={question.options}
                            labels={question.labels}
                            oneWordPerLine={true}
                            onChange={answer => updateResponses(key, answer)}
                        />
                        break;
                    case 'likertGrid':
                        // Get invalid statements for this grid
                        const invalidStatements = new Set<string>();
                        if (isInvalid && question.statements) {
                            question.statements.forEach((statement, i) => {
                                if (!responses[key]?.[statement]) {
                                    invalidStatements.add(statement);
                                }
                            });
                        }

                        input = <LikertGrid
                            questions={question.statements}
                            options={question.options}
                            responses={responses[key]}
                            headerRepeatInterval={5}
                            onChange={(statementKey: string, answer: string) => {
                                updateResponses(key, answer, statementKey);
                            }}
                            invalidStatements={invalidStatements}
                        />;
                        break;
                    case 'select':
                        input = <Select
                            value={responses[key]}
                            options={question.options}
                            onSelect={newValue => updateResponses(key, newValue)}
                            multiple={question.multiple}
                        />
                        break;
                    default:
                        input = <Text>Unsupported question type: {(question as any).type}</Text>;
                }

                // Wrap input in container
                return (
                    <View key={`question-${index}`} style={[
                        styles.questionContainer,
                        isInvalid && globalStyles.invalidInput,
                        question.conditions && styles.conditionalQuestion
                    ]}>
                        {title && (
                            <Text style={globalStyles.question}>
                                {title}
                            </Text>
                        )}
                        {input}
                    </View>
                );
            })}

            <View style={styles.footerContainer}>
                { progress !== undefined &&
                    <Text style={globalStyles.whiteText}>Progress: {progress.toFixed(0)}%</Text>
                }

                {
                    warning &&
                    <Text style={globalStyles.warning}>{warning}</Text>
                }

                { handleSurveySubmit &&
                    <SubmitButton
                        onPress={async() => {await handleSurveySubmit()}}
                        text={"Submit"}
                        disabledText={"Submitting..."}
                        disabled={isSubmitting ?? false}
                    />
                }
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
    invalidContainer: {
        borderWidth: 2,
        borderColor: '#ff0000',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#ffeeee',
    },
    invalidLabel: {
        color: '#cc0000',
        fontWeight: 'bold',
    },
    footerContainer: {
        gap: 15,
        marginTop: 20,
    },
    conditionalQuestion: {
        marginTop: -5,
        paddingLeft: 10,
        marginLeft: 10,
        borderLeftWidth: 2,
        borderStyle: 'solid',
        borderLeftColor: 'grey',
    }
});
