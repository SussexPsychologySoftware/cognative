import {View, StyleSheet, Text} from "react-native";
import React, {useState} from "react";
import SubmitButton from "@/components/basic/SubmitButton";
import {ScreenWrapper} from "@/components/layout/ScreenWrapper";
import {StatusBar} from "expo-status-bar";
import {globalStyles} from "@/styles/appStyles";
import {useSurvey} from "@/hooks/useSurvey";
import {SurveyQuestion} from '@/types/surveyQuestions'
import Survey from "@/components/survey/Survey";
import Picture from "@/components/media/Picture";

export default function Index() {
    // Define survey questions with keys
    const questions: SurveyQuestion[] = [
        {
            key: 'age',
            question: 'What is your age?',
            required: true,
            type: "number",
        },
        {
            key: 'gender',
            question: 'What is your gender?',
            type: 'radio',
            options: ['Male', 'Female', 'Other', 'Prefer not to say'],
        },
        {
            key: 'localTime',
            question: 'What is the time where you are now?',
            type: "time",
        },
        {
            key: 'multilineTextInput',
            question: "Tell us about yourself",
            type: 'multiline',
            placeholder: "Say as much as you like...",
        },
        {
            key: 'consent',
            question: '',
            label: 'Do you consent to take part in this experiment?',
            type: 'checkbox',
            required: true,
        },
        {
            key: 'content',
            question: 'On a scale of 0-1, how content are you?',
            type: 'slider',
            default: 0.5
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
                'Feeling bad about yourself, or that you are a failure or have let yourself or your family down?',
                'Trouble concentrating on things, such as reading the newspaper or watching television?',
                'Moving or speaking so slowly that other people could have noticed? Or so fidgety or restless that you have been moving a lot more than usual?'
            ],
            options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        }
    ];

    const {
        responses,
        updateResponses,
        handleSurveySubmit,
        warning,
        isSubmitting,
        progress,
        resetSurvey,
        invalidQuestions
    } = useSurvey(questions);

    return (
        <ScreenWrapper
            scrollable={true}
            safeAreaStyle={{padding: 30}}
        >
            <Text style={[globalStyles.pageTitle, {marginVertical: 30}]}>Survey Example</Text>
            <StatusBar style={'dark'}/>
            <View style={styles.inputsContainer}>
                <Text style={globalStyles.sectionTitle}>Demographics</Text>
                <Picture
                    asset={require('@/assets/images/icon.png')}
                    caption='Images are displayed like this'
                />
                <Survey
                    questions={questions.slice(0,6)}
                    responses={responses}
                    updateResponses={updateResponses}
                    invalidQuestions={invalidQuestions}
                />

                <Text style={globalStyles.sectionTitle}>Please fill out the following survey</Text>
                <Survey
                    questions={questions.slice(6)}
                    responses={responses}
                    updateResponses={updateResponses}
                    handleSurveySubmit={handleSurveySubmit}
                    warning={warning}
                    isSubmitting={isSubmitting}
                    progress={progress}
                    invalidQuestions={invalidQuestions}
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
