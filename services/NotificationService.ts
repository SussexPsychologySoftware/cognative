import * as Notifications from 'expo-notifications';
import {NotificationPermissionsStatus} from 'expo-notifications';
import {Linking, Alert, Platform} from 'react-native';
import { ExperimentTracker } from '@/services/longitudinal/ExperimentTracker';
import {experimentDefinition} from "@/config/experimentDefinition";
import {ExperimentState} from "@/types/trackExperimentState";

export class NotificationService {
    // TODO: consider push notification service
    static async initialize() {
        // Decide what happens if notification received whilst app is running
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                // priority: AndroidNotificationPriority.MAX,
                shouldPlaySound: true,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });
    }

    static async requestPermissions(): Promise<boolean> {
        const notificationPermissions = await Notifications.getPermissionsAsync();
        // console.log('permissions', notificationPermissions);
        if (this.checkPermissionsGranted(notificationPermissions)) {
            await this.initialize();
            return true;
        } else if(!notificationPermissions.canAskAgain) {
            Alert.alert(
                'Notification permissions denied',
                "Please turn on notifications for this app in your phone's settings",
                [
                    {
                        text: 'Go to settings',
                        onPress: async () => {await Linking.openSettings();},
                        style: "default"
                    },
                    {
                        text: 'Cancel',
                        onPress: () => Alert.alert('Notifications not set'),
                        style: 'cancel',
                    },
                ],
                {
                    cancelable: true,
                    onDismiss: () => Alert.alert('Notifications not set')
                },
            );
        }

        const { granted } = await Notifications.requestPermissionsAsync();
        if (granted) await this.initialize();
        return granted;
    }

    private static checkPermissionsGranted(permissions: NotificationPermissionsStatus): boolean {
        return permissions.granted || permissions.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED;
    }

    // -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

    static async scheduleAllNotifications(state: ExperimentState): Promise<void> {
        // Could take in state here from Experiment Tracker, or the times array
        // TODO: consider Headless Background Notifications so registerTaskAsync() can be run when app is terminated.

        // Cancel all existing notifications
        await Notifications.cancelAllScheduledNotificationsAsync();
        const currentDay = ExperimentTracker.calculateDaysPassed(state.startDate);

        // const daysRemainingInExperiment = experimentDefinition.total_days-currentDay
        // TODO: concerned this might break if anything is improved in the conditions list?
        let numberOfScheduledNotifications = 0;
        let maxNotifications = Platform.OS === 'ios' ? 64 : 50; // Note some Android APIs allow manufacturers to lower notification limit

        for (const task of experimentDefinition.tasks) {
            if(numberOfScheduledNotifications > maxNotifications) return

            // Check if this task has a notification and a user-set time
            if (!task.notification) continue;
            const notificationTime = state.notificationTimes[task.id];
            if (!notificationTime) continue; // No time set, skip

            // Get task definition
            const taskCompletionDate = state.tasksLastCompletionDate[task.id];
            const completedToday = taskCompletionDate ? ExperimentTracker.happenedToday(taskCompletionDate) : false;

            // Get days task will run on
            const remainingTaskDays = task.show_on_days.filter(day => completedToday ? day > currentDay : day >= currentDay)
            // Get days where condition lines up
            const daysToSchedule = remainingTaskDays.filter(day => {
                // note updateCondition handles independent measures by not doing anything
                const conditionOnDay = ExperimentTracker.updateCondition(state,day).currentCondition
                // If show_for_conditions is empty then show on all conditions
                return task.show_for_conditions.length === 0 || task.show_for_conditions.includes(conditionOnDay);
            })
            if(daysToSchedule.length === 0) return; //No days left to schedule

            // Prep notification settings
            const [hours, minutes] = notificationTime.split(':').map(Number);
            const title = `${task.name} Reminder`
            const body = `Click here to complete today's ${task.name}`

            // Loop through days and schedule notifications
            // TODO: deal with when too many - run scheduler every day?
            for (const day of daysToSchedule) {
                if (numberOfScheduledNotifications > maxNotifications) break;
                // Construct date of notification
                const notificationDate = new Date();
                notificationDate.setHours(hours)
                notificationDate.setMinutes(minutes)
                notificationDate.setSeconds(0);
                const daysInAdvance = day - currentDay;
                notificationDate.setDate(notificationDate.getDate() + daysInAdvance);
                // Make sure it's in the future
                // https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app#overview
                numberOfScheduledNotifications += 1
                let pathname;
                switch (task.type) {
                    case "screen":
                        pathname = task.path_to_screen
                        break;
                    default:
                        pathname = '/' + task.type // TODO: add getPathname helper somewhere..
                }

                // Make sure it's in the future (it should be)
                if (notificationDate > new Date()) {
                    numberOfScheduledNotifications += 1;
                    await this.scheduleNotification(title, body, notificationDate, task.id, pathname);
                }
                // return {taskId: task.id, taskName: task.name, notificationDate} // List of notifications
            }
        }
    }

    private static async scheduleNotification(
        title: string,
        body: string,
        date: Date,
        taskId: string,
        path_to_screen?: string,
    ): Promise<string> {
        return await Notifications.scheduleNotificationAsync({
            content: { title, body, sound: 'default',
                data: { taskId, date, path_to_screen }
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date,
            },
        });
    }

    // Cancel a scheduled notification (on task completion) *********
    static isSameDay(date1: Date, date2: Date) {
        date1.setHours(0, 0, 0, 0);
        date2.setHours(0, 0, 0, 0);
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    static async cancelNotificationForToday(taskId: string): Promise<void> {
        const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync()
        for (const notification of scheduledNotifications) {
            const triggerData = notification.content.data
            if(triggerData.taskId !== taskId) continue;

            const currentDate = new Date()
            // TODO: implement trigger data type to avoid type coercion here? consider using notification.trigger?.date
            const triggerDate = new Date(triggerData.date as string)
            if(this.isSameDay(triggerDate, currentDate)){
                const notificationIdentifier = notification.identifier
                await Notifications.cancelScheduledNotificationAsync(notificationIdentifier)
                break
            }
        }
    }
}
