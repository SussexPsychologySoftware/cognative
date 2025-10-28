import {RefObject, useEffect} from 'react';
import { router } from 'expo-router';
import { ExperimentTracker } from '@/services/longitudinal/ExperimentTracker';

export const useRestore = (isNotificationHandled?: RefObject<boolean>) => {
    // Simple restore function if not using app gate, run in _layout app root.
    // is Notification handled can catch if a notification handler is also present, optionally
    useEffect(() => {
        const restoreAppState = async () => {
            if (isNotificationHandled?.current) return; // Skip if notification was handled

            try {
                const experimentState = await ExperimentTracker.getState();
                if (!experimentState) {
                    router.replace('/');
                    return;
                }

                const experimentHasEnded = ExperimentTracker.hasExperimentEnded(experimentState);
                if (experimentHasEnded) {
                    await ExperimentTracker.stopExperiment();
                } else {
                    router.replace('/');
                }
            } catch (error) {
                console.error('Error restoring app: ', error);
            }
        };

        void restoreAppState();
    }, []);
};
