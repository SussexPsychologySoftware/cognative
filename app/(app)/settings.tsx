import {Text, View, StyleSheet, Alert} from "react-native"; // 👈 Import Alert
import React, { useState, useEffect } from "react"; // 👈 Import hooks
import {StandardView} from "@/components/layout/StandardView";
import { useExperiment } from "@/context/ExperimentContext";
import SubmitButton from "@/components/inputs/SubmitButton";
import {globalStyles} from "@/styles/appStyles";
import NotificationsInput from "@/components/longitudinal/NotificationsInput";
import ResetButtons from "@/components/debug/ResetButtons";
import {NotificationDefinition, TaskNotification} from "@/types/experimentConfig";

export default function SettingsScreen() {
    const { state, isLoading, definition, updateNotificationTimes, isActionLoading } = useExperiment();

    // Init local state to hold responses before save with times from main state
    const [localTimes, setLocalTimes] = useState(state?.notificationTimes || {});

    // Keep local state in sync if main state changes (optional)
    useEffect(() => {
        if (state?.notificationTimes) {
            setLocalTimes(state.notificationTimes);
        }
    }, [state?.notificationTimes]);


    // updates local state
    const handleTimeChange = (taskId: string, newTime: string|null) => {
        setLocalTimes(prev => ({
            ...prev,
            [taskId]: newTime,
        }));
    };

    // save local state to persistent state
    const handleSave = async () => {
        try {
            await updateNotificationTimes(localTimes);
            Alert.alert("Success", "Notification times saved.");
        } catch (error: any) {
            Alert.alert("Error", `Failed to save: ${error.message}`);
        }
    };

    if (isLoading || !state) {
        // ... loading spinner
        return (
            <StandardView>
                <Text>Loading experiment...</Text>
            </StandardView>
        );
    }

    const notifications: TaskNotification[] = definition.tasks
        .filter(task => !!task.notification) // Keep only tasks with a notification
        .map(task => ({
            ...(task.notification as NotificationDefinition), // Spread the notification details
            taskId: task.id // Add the task ID
        }));

    return (
        <StandardView>
            <View style={styles.notificationSettings}>
                { notifications &&
                    <>
                        <Text style={globalStyles.pageTitle}>Notification times</Text>
                        <Text style={globalStyles.completeSurveyPrompt}>
                            Enter times you would like to receive reminders below - these can be changed at any time during the study.
                            Reminders are optional.
                        </Text>

                        <NotificationsInput
                            notifications={notifications}
                            times={localTimes} // local state
                            onChange={handleTimeChange} // local updater
                        />
                        <SubmitButton
                            text={"Save"}
                            onPress={handleSave} // submit
                            disabled={isActionLoading} // Disable when saving
                            disabledText={"Saving..."}
                        />
                    </>
                }

                <Text style={[globalStyles.pageTitle, globalStyles.sectionTitle]}>Other Settings</Text>
                <Text style={globalStyles.standardText}>Participant ID: {state.participantId}</Text>
                <ResetButtons/>
            </View>
        </StandardView>
    );
}

const styles = StyleSheet.create({
    notificationSettings: {
        marginTop: 20,
        rowGap: 20,
    },
    resetButtons: {
        gap: 10
    },
    notificationInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10
    },
});
