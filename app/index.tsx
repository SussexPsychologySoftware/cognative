import {View, StyleSheet, Text} from "react-native";
import React, {useState} from "react";
import SubmitButton from "@/components/basic/SubmitButton";
import {ScreenWrapper} from "@/components/layout/ScreenWrapper";
import {StatusBar} from "expo-status-bar";
import {globalStyles} from "@/styles/appStyles";
import {useSurvey} from "@/hooks/useSurvey";
import {SurveyQuestion} from '@/types/surveyQuestions'
import Survey from "@/components/survey/Survey";

export default function Index() {
    const [playingAudio, setPlayingAudio] = useState(false);

    // Define survey questions with keys
    const questions: SurveyQuestion[] = [
        {
            key: 'numericInput',
            question: 'numericInput',
            required: true,
            type: "number",
        },
        {
            key: 'multilineTextInput',
            question: 'multilineTextInput',
            type: 'multiline',
        },
        {
            key: 'radioList',
            question: 'radioList',
            type: 'radio',
            options: ['Yes', 'No'],
        },
        {
            key: 'timePicker',
            question: 'timePicker',
            type: "time",
        },
        {
            key: 'phq8',
            type: 'likertGrid',
            name: 'PHQ-8',
            required: true,
            question: 'Over the last 4 days have you felt...',
            statements: [
                'Little interest or pleasure in doing things?',
                'Feeling down, depressed, or hopeless?',
                'Trouble falling or staying asleep, or sleeping too much?',
                'Feeling tired or having little energy?',
                'Poor appetite or overeating?',
                'Feeling bad about yourself — or that you are a failure or have let yourself or your family down?',
                'Trouble concentrating on things, such as reading the newspaper or watching television?',
                'Moving or speaking so slowly that other people could have noticed? Or so fidgety or restless that you have been moving a lot more than usual?'
            ],
            options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        }
    ];

    const { responses, updateResponses, handleSurveySubmit, warning, isSubmitting, progress, resetSurvey } = useSurvey(questions);

    return (
        <ScreenWrapper
            scrollable={true}
            safeAreaStyle={{padding: 30}}
        >
            <Text style={[globalStyles.pageTitle, {marginVertical: 30}]}>Survey Example</Text>
            <StatusBar style={'dark'}/>
            <View style={styles.inputsContainer}>
                <Text style={globalStyles.whiteText}>Progress: {progress.toFixed(0)}%</Text>

                <Survey
                    questions={questions}
                    responses={responses}
                    updateResponses={updateResponses}
                    handleSurveySubmit={handleSurveySubmit}
                    warning={warning}
                    isSubmitting={isSubmitting}
                    progress={progress}
                />

                {/* Debug: Show current responses */}
                <Text style={globalStyles.whiteText}>
                    {JSON.stringify(responses, null, 2)}
                </Text>

                <SubmitButton
                    onPress={() => {resetSurvey()}}
                    text={"Reset Survey"}
                    disabledText={"Resetting..."}
                    disabled={false}
                />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    inputsContainer: {
        gap: 10
    },
});
