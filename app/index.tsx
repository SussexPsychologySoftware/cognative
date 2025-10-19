import {View, StyleSheet, Text} from "react-native";
import NumericInput from "@/components/basic/NumericInput";
import React, {useState} from "react";
import MultilineTextInput from "@/components/basic/MultilineTextInput";
import TimePicker from "@/components/basic/TimePicker";
import SubmitButton from "@/components/basic/SubmitButton";
import RadioList from "@/components/survey/RadioList";
import AudioPlayer from "@/components/media/AudioPlayer";
import {ScreenWrapper} from "@/components/layout/ScreenWrapper";
import {StatusBar} from "expo-status-bar";
import {globalStyles} from "@/styles/appStyles";
import {useSurvey} from "@/hooks/useSurvey";
import LikertRadioGrid from "@/components/survey/LikertRadioGrid";
import {SingleInputQuestion, SurveyQuestion, LikertGridQuestion} from '@/types/surveyQuestions'
import Survey from "@/components/survey/Survey";
import {updateExpression} from "@babel/types";

export default function Index() {
    const [playingAudio, setPlayingAudio] = useState(false);

    // TODO: need to simplify how all this works - UI too complicated

    // Define Likert questions=
    const questions: SurveyQuestion[] = [
        {
            question: 'numericInput',
            required: true,
            type: "number",
            response: ''
        },
        {
            question: 'multilineTextInput',
            type: 'multiline',
            response: ''
        },
        {
            question: 'radioList',
            type: 'radio',
            options: ['Yes', 'No'],
            response: ''
        },
        {
            question: 'timePicker',
            type: "time",
            response: new Date(),
        },
        {
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
            response: {}
        }
    ];

    const { responses, updateResponses, extractNestedResponses, handleSurveySubmit, warning, isSubmitting, progress, resetSurvey } = useSurvey(questions);

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
                    // surveyState
                    questions={responses}
                    responses={responses}
                    updateResponses={updateResponses}
                    handleSurveySubmit={async()=>{return await handleSurveySubmit()}}
                    warning={warning}
                    isSubmitting={false}
                    progress={0}
                    extractNestedResponses={extractNestedResponses}
                />

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
