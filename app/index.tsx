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

export default function Index() {
    // Define Likert questions
    const phq8Questions = [
        'Little interest or pleasure in doing things?',
        'Feeling down, depressed, or hopeless?',
        'Trouble falling or staying asleep, or sleeping too much?',
        'Feeling tired or having little energy?',
        'Poor appetite or overeating?',
        'Feeling bad about yourself — or that you are a failure or have let yourself or your family down?',
        'Trouble concentrating on things, such as reading the newspaper or watching television?',
        'Moving or speaking so slowly that other people could have noticed? Or so fidgety or restless that you have been moving a lot more than usual?'
    ];

    const phq8Options = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];

    const questions = [
        {
            question: 'numericInput',
            required: true,
            default: '',
        },
        {
            question: 'multilineTextInput',
        },
        {
            question: 'radioList',
        },
        {
            question: 'timePicker',
            default: new Date(),
        },
        // Add PHQ-8 questions with dot notation
        ...phq8Questions.map(q => ({
            question: `PHQ-8.${q}`,
            required: true
        }))
    ];

    const [playingAudio, setPlayingAudio] = useState(false);

    const { responses, updateResponses, handleSurveySubmit, warning, isSubmitting, progress, resetSurvey } = useSurvey(questions);

    // Extract PHQ-8 responses for the Likert grid
    const phq8Responses = Object.fromEntries(
        Object.entries(responses)
            .filter(([key]) => key.startsWith('PHQ-8.'))
            .map(([key, value]) => [key.replace('PHQ-8.', ''), value])
    );

    return (
        <ScreenWrapper
            scrollable={true}
            safeAreaStyle={{padding: 30}}
        >
            <Text style={[globalStyles.pageTitle, {marginVertical: 30}]}>Survey Example</Text>
            <StatusBar style={'dark'}/>
            <View style={styles.inputsContainer}>
                <Text style={globalStyles.whiteText}>Progress: {progress.toFixed(0)}%</Text>

                <NumericInput
                    value={responses.numericInput}
                    placeholder={"Enter number"}
                    onChange={(newValue: string) => {updateResponses('numericInput', newValue)}}
                />

                <MultilineTextInput
                    value={responses.multilineTextInput}
                    placeholder={"Multiline text input"}
                    onChange={(newValue: string) => {updateResponses('multilineTextInput', newValue)}}
                />

                <TimePicker
                    value={responses.timePicker}
                    onChange={(newValue: Date|null) => {updateResponses('timePicker', newValue)}}
                />

                <RadioList
                    options={['Yes', 'No']}
                    value={responses.radioList}
                    onSelect={(response: string) => {updateResponses('radioList', response)}}
                    containerStyle={{'width': '60%'}}
                />

                <AudioPlayer
                    audioSource={require('../assets/sounds/binaural.mp3')}
                    isPlaying={playingAudio}
                    onPress={() => {setPlayingAudio(!playingAudio)}}
                    volume={1}
                />

                <LikertRadioGrid
                    responses={phq8Responses}
                    options={phq8Options}
                    questions={phq8Questions}
                    oneWordPerLine={false}
                    onChange={(question: string, answer: string) => {
                        updateResponses(`PHQ-8.${question}`, answer);
                    }}
                />

                <Text style={globalStyles.warning}>{warning}</Text>

                <SubmitButton
                    onPress={async() => {await handleSurveySubmit()}}
                    text={"Submit"}
                    disabledText={"Submitting..."}
                    disabled={isSubmitting}
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
