import {StyleSheet, View, Text} from "react-native";
import TimePicker from "@/components/inputs/TimePicker";
// Removed useState, it's not needed here
import {globalStyles} from "@/styles/appStyles";
import {NullableStringRecord} from "@/types/trackExperimentState";
import {TaskNotification} from "@/types/experimentConfig";

export default function NotificationsInput({ notifications, times, onChange }: {
    notifications: TaskNotification[],
    times: NullableStringRecord,
    onChange: (taskId: string, newTime: string|null) => void
}) {

    return (
        <View style={styles.container}>
            {
                notifications.map((notification) => {
                    const stateValue = times[notification.taskId];
                    const timeString = stateValue === undefined && notification.default_time !== undefined ? notification.default_time : stateValue;
                    return (
                        <View
                            key={notification.taskId}
                            style={styles.notificationContainer}
                        >
                            <Text
                                style={globalStyles.standardText}
                            >
                                {notification.prompt}
                            </Text>
                            <TimePicker
                                value={timeString}
                                onChange={(newTimeString) => {
                                    onChange(notification.taskId, newTimeString);
                                }}
                            />
                        </View>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10
    },
    notificationContainer: {
        // flexDirection: "row",
        gap: 5
    }
});
