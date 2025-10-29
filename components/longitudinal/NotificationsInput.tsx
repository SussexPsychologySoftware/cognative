import {StyleSheet, View, Text} from "react-native";
import TimePicker from "@/components/inputs/TimePicker";
import {NotificationDefinition} from "@/types/experimentConfig";
// Removed useState, it's not needed here
import {globalStyles} from "@/styles/appStyles";
import {NullableStringRecord} from "@/types/trackExperimentState";

/**
 * Creates a Date object for today with a specific time.
 * @param timeString - A string in "HH:MM" format (e.g., "09:30")
 */
function createDateFromTime(timeString: string): Date {
    // 1. Handle invalid or empty strings
    if (!timeString || !timeString.includes(':')) {
        console.warn(`Invalid time string received: ${timeString}`);
        return new Date(); // Fallback to now
    }

    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0); // Set time, reset seconds/ms
    return date;
}

/**
 * Converts a Date object to a "HH:MM" string.
 * @param date - A Date object
 */
function createTimeFromDate(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}


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
