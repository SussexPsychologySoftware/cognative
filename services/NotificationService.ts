import * as Notifications from 'expo-notifications';
import {NotificationPermissionsStatus} from 'expo-notifications';
import { Linking, Alert } from 'react-native';
import { ExperimentTracker } from '@/services/longitudinal/ExperimentTracker';

type timeOfDay = 'morning' | 'evening'

type NotificationTimes = { // Better formatted object for returning time of notifications
    [time in timeOfDay]: {
        id: string; // Notification ID
        hour: number; // Hour of the notification
        minute: number; // Minute of the notification
        date: Date
    };
};

export class NotificationService {
    private static readonly EXPERIMENT_ID = "4xr2ewHBUVld";

    static async initialize() {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        });
    }

    static async requestPermissions(): Promise<boolean> {
        const notificationPermissions = await Notifications.getPermissionsAsync();
        console.log('permissions', notificationPermissions);
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
        return permissions.granted ||
            permissions.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED;
    }

    // -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

    static async scheduleNotifications(
        morningTime: { hour: number; minute: number } | null,
        eveningTime: { hour: number; minute: number } | null
    ): Promise<void> {
        // Cancel all existing notifications
        await Notifications.cancelAllScheduledNotificationsAsync();
        const EXPERIMENT_LENGTH = 14;
        const daysPassed = await ExperimentTracker.getDaysSinceStart();
        const daysLeft = EXPERIMENT_LENGTH-daysPassed
        await ExperimentTracker.getDaysSinceStart();
        const experimentState = await ExperimentTracker.getState()
        let completedMorningDiaryToday = false
        let completedEveningDiaryToday = false

        if(experimentState) {
            completedMorningDiaryToday = ExperimentTracker.hasCompletedMorningDiary(experimentState)
            completedEveningDiaryToday = ExperimentTracker.hasCompletedEveningDiary(experimentState)
        }

        if (morningTime) {
            await this.scheduleNotificationsForTimeOfDay(morningTime, daysLeft, 'morning', completedMorningDiaryToday);
        }

        if (eveningTime) {
            await this.scheduleNotificationsForTimeOfDay(eveningTime, daysLeft, 'evening', completedEveningDiaryToday);
        }
    }

    private static async scheduleNotificationsForTimeOfDay(
        time: { hour: number; minute: number },
        daysLeft: number,
        timeOfDay: timeOfDay,
        completedToday: boolean
    ){
        if(timeOfDay==='evening') {
            daysLeft = daysLeft-1  // No evening diary on last day
        }
        const reminderTile = `${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Sleep Diary Reminder`
        const reminderBody = `Click here to complete this ${timeOfDay}'s sleep diary`

        const now = new Date();
        for(let i= completedToday ? 1 : 0; i<daysLeft; i++){
            const notificationDate = new Date();
            notificationDate.setHours(time.hour)
            notificationDate.setMinutes(time.minute)
            notificationDate.setSeconds(0)
            notificationDate.setDate(notificationDate.getDate() + i);
            if (notificationDate > now) {
                await this.scheduleNotification(reminderTile, reminderBody, notificationDate, timeOfDay, false);
            }
        }
    }

    static date2Day(date: Date) {
        return date.toISOString().split('T')[0]
    }

    private static async scheduleNotification(
        title: string,
        body: string,
        date: Date,
        timeOfDay: string,
        reminder: boolean
    ): Promise<string> {
        // console.log('SCHEDULING NOTIFICATION', {title, body, date, timeOfDay})
        return await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: 'default',
                data: {
                    timeOfDay,
                    reminder,
                    date: this.date2Day(date)
                },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date,
            },
        });
    }

    static async cancelNotificationForSurveyToday(timeOfDay: timeOfDay): Promise<void> {
        const notifications = await Notifications.getAllScheduledNotificationsAsync()
        // console.log({notifications})
        const currentDate = this.date2Day(new Date())
        for (const n of notifications) {
            const triggerData = n.content.data
            if(triggerData.timeOfDay === timeOfDay && triggerData.date === currentDate) {
                await Notifications.cancelScheduledNotificationAsync(n.identifier)
                break
            }
        }
    }
}
