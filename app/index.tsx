import {View, StyleSheet,Text} from "react-native";
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
    const questions  = [
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
    ]

    // PLACEHOLDER: need to integrate nested objects into useSurvey
    const likertQuestions = {
            name: 'PHQ-8',
            prompt: 'How often have you been bothered by the following over the past 2 weeks?',
            options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
            questions: ['Little interest or pleasure in doing things?', 'Feeling down, depressed, or hopeless?',
                'Trouble falling or staying asleep, or sleeping too much?', 'Feeling tired or having little energy?',
                'Poor appetite or overeating?',
                'Feeling bad about yourself — or that you are a failure or have let yourself or your family down?',
                'Trouble concentrating on things, such as reading the newspaper or watching television?',
                'Moving or speaking so slowly that other people could have noticed? Or so fidgety or restless that you have been moving a lot more than usual?'
            ],
            type: 'likert'
        }

    const [likertResponses, setLikertResponses] = useState(
        Object.fromEntries(likertQuestions.questions.map(q => [q, '']))
    );
    console.log({likertResponses});

    const [playingAudio, setPlayingAudio] = useState(false);

    const { responses, updateResponses, handleSurveySubmit, warning, isSubmitting, progress, resetSurvey } = useSurvey(questions);

    return (
        <ScreenWrapper
            scrollable={true}
            safeAreaStyle={{padding: 30}}
        >
            <Text style={[globalStyles.pageTitle,{marginVertical: 30}]}>Survey Example</Text>
            <StatusBar style={'dark'}/>
            <View style={styles.inputsContainer}>
                <Text style={globalStyles.whiteText}>Progress: {progress}%</Text>
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
                <AudioPlayer   audioSource={require('../assets/sounds/binaural.mp3')}
                               isPlaying={playingAudio}
                               onPress={()=>{setPlayingAudio(!playingAudio)}}
                               volume={1}
                />
                <LikertRadioGrid
                    responses={likertResponses}
                    options={likertQuestions.options}
                    questions={likertQuestions.questions}
                    oneWordPerLine={true}
                    onChange={(question: string, answer: string) => {setLikertResponses({...likertResponses, [question]: answer})}}
                />

                <Text style={globalStyles.warning}>{warning}</Text>
                <SubmitButton
                    onPress={async()=>{await handleSurveySubmit()}}
                    text={"Submit"}
                    disabledText={"Submitting..."}
                    disabled={isSubmitting}
                />
                <SubmitButton
                    onPress={()=>{resetSurvey()}}
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

