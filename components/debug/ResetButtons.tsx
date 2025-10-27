import {StyleSheet, View} from "react-native";
import SubmitButton from "@/components/inputs/SubmitButton";
import {useExperiment} from "@/context/ExperimentContext";

export default function ResetButtons(){
    const { confirmAndStopExperiment, isActionLoading, resetTaskCompletion } = useExperiment();

    return (
        <View style={styles.container}>
            <SubmitButton
                text={isActionLoading ? "Resetting..." : "Reset task completion"}
                onPress={resetTaskCompletion}
                style={{
                    alignSelf: "flex-start",
                }}
            />
            <SubmitButton
                text={isActionLoading ? "Resetting..." : "Clear participant data"}
                onPress={confirmAndStopExperiment}
                style={{
                    backgroundColor: "red",
                    alignSelf: "flex-start",
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginVertical: 10,
        alignSelf: 'flex-start',
        alignItems: 'flex-start',
    },
});
