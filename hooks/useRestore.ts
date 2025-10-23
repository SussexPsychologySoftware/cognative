import {RefObject, useEffect} from 'react';
import { router } from 'expo-router';
import { ExperimentTracker } from '@/services/longitudinal/ExperimentTracker';

export const useRestore = (isNotificationHandled?: RefObject<boolean>) => {
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
                // } else if (!experimentState.setVolume) {
                    // router.replace('/');
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
