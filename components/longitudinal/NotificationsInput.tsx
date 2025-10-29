import {StyleSheet, View, Text} from "react-native";
import TimePicker from "@/components/inputs/TimePicker";
import {NotificationDefinition} from "@/types/experimentConfig";
// Removed useState, it's not needed here
import {globalStyles} from "@/styles/appStyles";
import {NullableStringRecord} from "@/types/trackExperimentState";

export default function NotificationsInput({ notifications, times, onChange }: {
    notifications: NotificationDefinition[],
    times: NullableStringRecord,
    onChange: (taskId: string, newTime: string|null) => void
}) {

    return (
        <View style={styles.container}>
            {
                notifications.map((notification) => {
                    const timeString = times[notification.for_task_id] || notification.default_time;
                    return (
                        <View
                            key={notification.for_task_id}
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
                                    onChange(notification.for_task_id, newTimeString);
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
