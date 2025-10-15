import {View, StyleSheet,Text, Alert} from "react-native";
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
                <Text style={globalStyles.whiteText}>% Progress: {progress}</Text>
                <NumericInput
                    value={responses.numericInput}
                    placeholder={"Enter numeric number"}
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
                    onSelect={(response: string) => {updateResponses('radioList', response)}}
                    containerStyle={{'width': '60%'}}
                />
                <AudioPlayer   audioSource={require('../assets/sounds/binaural.mp3')}
                               isPlaying={playingAudio}
                               onPress={()=>{setPlayingAudio(!playingAudio)}}
                               volume={1}
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

