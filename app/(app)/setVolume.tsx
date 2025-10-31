import {Text, StyleSheet, Alert} from 'react-native';
import AudioPlayer from "@/components/media/AudioPlayer";
import { useEffect, useState } from "react";
import { ExperimentTracker } from '@/services/longitudinal/ExperimentTracker';
import { globalStyles } from "@/styles/appStyles";
import {StatusBar} from "expo-status-bar";
import {router, useLocalSearchParams} from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";
import { DataService } from '@/services/data/DataService';
import {useExperiment} from "@/context/ExperimentContext";
import SubmitButton from "@/components/inputs/SubmitButton";

export default function AudioScreen() {
    // TODO: implement a 'retrieve data' function for in experiment config.
    const { taskId } = useLocalSearchParams<{ taskId: string }>();
    const [play, setPlay] = useState(false);
    const [volume, setVolume] = useState(0.5); // Add state for volume
    const { completeTask } = useExperiment();
    // const taskDefinition = definition.tasks.find(t => t.id === taskId);

    const handleAudioToggle = () => {
        setPlay(!play)
    };

    // Get task display state dynamically
    const handleSubmit = async () => {
        try {
            await DataService.setData('volume', volume);
            await completeTask(taskId)
            console.log('Audio completion recorded successfully');
        } catch (error) {
            console.error('Failed to record volume:', error);
            Alert.alert('Error', 'Failed to save volume. Please try again.');
        } finally {
            router.replace('/');
        }
    }

    return (
        <SafeAreaView style={[globalStyles.scrollViewContainer, globalStyles.center, styles.container]}>
            <StatusBar style="dark" />
            <Text style={globalStyles.standardText}>Connect your headphones and press Play &#9654; when you are ready to begin playing your nightly sleep audio.</Text>
            <AudioPlayer
                audioSource={require('@/assets/sounds/binaural.mp3')}
                isPlaying={play}
                onPress={()=>handleAudioToggle()}
                volume={volume}
                onVolumeChange={setVolume}
            />
            <SubmitButton
                text='Save'
                onPress={handleSubmit}
            />
            <Text style={globalStyles.standardText}>Please do not exceed 50% volume on your device. Please make sure your phone is plugged in or has enough battery to last the night.</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 30
    },
});
