import {StyleSheet, View, Text, Alert} from "react-native";
import SubmitButton from "@/components/inputs/SubmitButton";
import {useExperiment} from "@/context/ExperimentContext";
import {dataQueue} from "@/services/data/dataQueue";
import {globalStyles} from "@/styles/appStyles";
import {useState, ReactNode} from "react";

// --- New Sub-Components ---

// 1. Reusable Submit Button for Debugging
interface DebugSubmitButtonProps {
    text: string;
    loadingText: string;
    onPress: () => void | Promise<void>;
    disabled: boolean;
    style?: any;
    textStyle?: any;
}

function DebugSubmitButton({ text, loadingText, onPress, disabled, style, textStyle }: DebugSubmitButtonProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handlePress = async () => {
        if (disabled || isLoading) return;

        setIsLoading(true);
        try {
            await onPress();
        } catch (error) {
            console.error("Debug button action failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SubmitButton
            text={isLoading ? loadingText : text}
            onPress={handlePress}
            disabled={disabled || isLoading}
            style={[styles.debugButton, style]}
            textStyle={textStyle}
        />
    );
}

function DebugButtonRow({ title, children }: { title: string; children: ReactNode }) {
    return (
        <View style={styles.buttonRow}>
            <Text style={globalStyles.debugText}>{title}:</Text>
            {children}
        </View>
    );
}

// --- Main Component ---

export default function DebugButtons(){
    const { isActionLoading, confirmAndStopExperiment, resetTaskCompletion } = useExperiment();

    return (
        <View style={globalStyles.debugContainer}>
            <Text style={[globalStyles.debugText, globalStyles.debugTitle]}>Debug Buttons:</Text>
            <DebugButtonRow title="Queue">
                <DebugSubmitButton
                    text="Sync"
                    loadingText="Syncing..."
                    onPress={async()=>{
                        const successMessage = await dataQueue.processQueue()
                        Alert.alert(successMessage)
                    }}
                    disabled={isActionLoading} // Disabled if a global action is pending
                    textStyle={styles.debugButtonText}
                />
                <DebugSubmitButton
                    text="Clear"
                    loadingText="Clearing..."
                    onPress={async()=>{
                        await dataQueue.clearQueue()
                    }}
                    disabled={isActionLoading}
                    textStyle={styles.debugButtonText}
                />
                <DebugSubmitButton
                    text="Show"
                    loadingText="Getting..."
                    onPress={async()=>{
                        const queue = await dataQueue.getQueue()
                        const parsedQueue = queue.map(q => ({...q, data: JSON.parse(q.data)}));
                        Alert.alert("Queue", JSON.stringify(parsedQueue, null, 2))
                    }}
                    disabled={isActionLoading}
                    textStyle={styles.debugButtonText}
                />
            </DebugButtonRow>

            {/* Reset Actions Row */}
            <DebugButtonRow title="Reset">
                <DebugSubmitButton
                    text="Task completion"
                    loadingText="Resetting..."
                    onPress={resetTaskCompletion}
                    disabled={isActionLoading}
                    textStyle={styles.debugButtonText}
                />
                <DebugSubmitButton
                    text="Participant"
                    loadingText="Resetting..."
                    onPress={confirmAndStopExperiment}
                    disabled={isActionLoading}
                    style={{backgroundColor: 'rgba(255,0,0,.5)'}} // Specific style override
                    textStyle={styles.debugButtonText}
                />
            </DebugButtonRow>
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
