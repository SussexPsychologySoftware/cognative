import {Text, View, StyleSheet, Alert} from "react-native";
import React, { useState, useEffect } from "react";
import {StandardView} from "@/components/layout/StandardView";
import { useExperiment } from "@/context/ExperimentContext";
import SubmitButton from "@/components/inputs/SubmitButton";
import {globalStyles} from "@/styles/appStyles";
import NotificationsInput from "@/components/longitudinal/NotificationsInput";
import {NotificationDefinition, TaskNotification} from "@/types/experimentConfig";
import {NotificationService} from "@/services/NotificationService";
import {router, useLocalSearchParams} from "expo-router";

export default function SettingsScreen() {
    const { taskId } = useLocalSearchParams<{ taskId: string }>();
    const { state, isLoading, definition, updateNotificationTimes, isActionLoading, completeTask } = useExperiment();
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
            await NotificationService.requestPermissions();
            await updateNotificationTimes(localTimes);
            // If is task, mark as completed - allows forcing user to click 'save' on notifications
            if(taskId) {
                await completeTask(taskId)
                router.replace("/")
            }
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
                        <Text style={globalStyles.standardText}>
                            Enter times you would like to receive reminders below - these can be changed at any time during the study.
                            Reminders are optional.
                        </Text>

                        <NotificationsInput
                            notifications={notifications}
                            times={localTimes} // local state
                            onChange={handleTimeChange} // local updater
                        />
                        { taskId &&
                            <Text style={[globalStyles.standardText, {fontStyle: 'italic'}]}>
                                Leave times blank or click the red X to opt-out of any reminders. You must click save to continue with the experiment.
                            </Text>
                        }
                        <SubmitButton
                            text={"Save"}
                            onPress={handleSave} // submit
                            disabled={isActionLoading} // Disable when saving
                            disabledText={"Saving..."}
                        />
                    </>
                }

                <Text style={[globalStyles.pageTitle, globalStyles.sectionTitle]}>More info</Text>
                <Text style={globalStyles.standardText}>Participant ID: {state.participantId}</Text>
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
