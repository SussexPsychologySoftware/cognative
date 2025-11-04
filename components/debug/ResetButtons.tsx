import {StyleSheet, View, Text, Alert} from "react-native";
import SubmitButton from "@/components/inputs/SubmitButton";
import {useExperiment} from "@/context/ExperimentContext";
import {dataQueue} from "@/services/data/dataQueue";
import {globalStyles} from "@/styles/appStyles";
import {useState} from "react";

export default function ResetButtons(){
    const {  isActionLoading, confirmAndStopExperiment, resetTaskCompletion } = useExperiment();

    const [queueProcessing, setQueueProcessing] = useState<boolean>(false);
    // NOTE:
    return (
        <View style={globalStyles.debugContainer}>
            <Text style={[globalStyles.debugText, globalStyles.debugTitle]}>Debug Buttons:</Text>
            <View style={styles.buttonRow}>
                <Text style={globalStyles.debugText}>Queue:</Text>
                <SubmitButton
                    text={queueProcessing ? "Syncing..." : "Sync"}
                    onPress={async()=>{
                        setQueueProcessing(true);
                        const successMessage = await dataQueue.processQueue()
                        Alert.alert(successMessage)
                        setQueueProcessing(false);
                    }}
                    style={styles.debugButton}
                    textStyle={styles.debugButtonText}
                />
                <SubmitButton
                    text={isActionLoading ? "Clearing..." : "Clear"}
                    onPress={async()=>{
                        setQueueProcessing(true);
                        await dataQueue.clearQueue()
                        setQueueProcessing(false);
                    }}
                    style={styles.debugButton}
                    textStyle={styles.debugButtonText}
                />
            </View>
            <View style={styles.buttonRow}>
                <Text style={globalStyles.debugText}>Reset:</Text>
                <SubmitButton
                    text={isActionLoading ? "Resetting..." : "Task completion"}
                    onPress={resetTaskCompletion}
                    style={styles.debugButton}
                    textStyle={styles.debugButtonText}
                />
                <SubmitButton
                    text={isActionLoading ? "Resetting..." : "Participant"}
                    onPress={confirmAndStopExperiment}
                    style={[styles.debugButton, {backgroundColor: 'rgba(255,0,0,.5)'}]}
                    textStyle={styles.debugButtonText}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    debugButton: {
        backgroundColor: 'grey',
    },
    debugButtonText: {
        color: 'lightgrey'
    }
});
