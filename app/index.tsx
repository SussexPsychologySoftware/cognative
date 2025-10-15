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

export default function Index() {
    const [responses, setResponses] = useState({
        numericInput: '',
        multilineTextInput: '',
        radioOn: false,
        radioList: '',
        timePicker: new Date()
    });
    const [submitting, setSubmitting] = useState(false);
    const [playingAudio, setPlayingAudio] = useState(false);


    function updateResponses(newValue: any, responseField: string) {
        setResponses({...responses, [responseField]: newValue})
    }

    function handleSubmit(){
        if(submitting) return;
        try {
            setSubmitting(true);
            Alert.alert('submitted',JSON.stringify(responses))
        } catch (e) {
            console.error(e)
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <ScreenWrapper
            scrollable={true}
            safeAreaStyle={{padding: 30}}
        >
            <Text>Edit app/index.tsx to edit this screen.</Text>
            <StatusBar style={'dark'}/>
            <View style={styles.inputsContainer}>
                <NumericInput
                    value={responses.numericInput}
                    placeholder={"Enter numeric number"}
                    onChange={(newValue: string) => {updateResponses(newValue,'numericInput')}}
                />
                <MultilineTextInput
                    value={responses.multilineTextInput}
                    placeholder={"Multiline text input"}
                    onChange={(newValue: string) => {updateResponses(newValue,'multilineTextInput')}}
                />
                <TimePicker
                    value={responses.timePicker}
                    onChange={(newValue: Date|null) => {updateResponses(newValue,'timePicker')}}
                />
                <RadioList
                    options={['Yes', 'No']}
                    onSelect={(response: string) => {updateResponses(response, 'radioList')}}
                    containerStyle={{'width': '60%'}}
                />
                <AudioPlayer   audioSource={require('../assets/sounds/binaural.mp3')}
                               isPlaying={playingAudio}
                               onPress={()=>{setPlayingAudio(!playingAudio)}}
                               volume={1}
                />
                <SubmitButton
                    onPress={handleSubmit}
                    text={"Submit"}
                    disabledText={"Submitting..."}
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

