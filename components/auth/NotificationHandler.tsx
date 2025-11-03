import { useEffect } from 'react';
import { useLastNotificationResponse, clearLastNotificationResponse } from 'expo-notifications';
import { router, RelativePathString } from 'expo-router';
import { useExperiment } from '@/context/ExperimentContext';

/**
 Handles app opening from user clicking a notification - run inside AppGate and ExperimentContext Provider to avoid clashes
 */
export function NotificationHandler() {
    const lastNotificationResponse = useLastNotificationResponse();
    const { displayState } = useExperiment(); // Get the loaded state

    useEffect(() => {
        // Wait until both the notification and the displayState are ready
        // TODO: note have had it where not allowed, clicked, finished another, and was auto routed there from stack
        if (!lastNotificationResponse || !displayState) {
            return;
        }

        const data = lastNotificationResponse.notification.request.content.data;
        const pathname = data.path_to_screen as RelativePathString;
        const taskId = data.taskId as string;

        if (pathname && taskId) {
            const taskStatus = displayState.tasks.find(t => t.definition.id === taskId);

            if (taskStatus && taskStatus.isAllowed) {
                router.push({
                    pathname: pathname,
                    params: {taskId}
                })
                clearLastNotificationResponse()
            } else {
                console.warn(`NotificationHandler: Task ${taskId} not allowed.`);
                router.replace('/');
            }
        }
    }, [lastNotificationResponse, displayState]); // Run when either of these change

    return null; // This component renders nothing
}
