// components/auth/AppGate.tsx
import React, { useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import { useExperiment } from '@/context/ExperimentContext';
import { View, Text } from 'react-native'; // For a loading spinner

// This component will wrap our app and handle all auth/onboarding redirects
export function AppGate({ children }: { children: React.ReactNode }) {
    const { state, isLoading } = useExperiment();
    const segments = useSegments(); // Gets the current route path

    useEffect(() => {
        // Wait until loading is finished
        if (isLoading) {
            return;
        }

        const inExperiment = state !== null;
        const inOnboardingGroup = segments[0] === '(onboarding)';

        if (!inExperiment && !inOnboardingGroup) {
            // User is not signed in and not in the onboarding flow.
            // Redirect them to the onboarding start page.
            router.replace('/(onboarding)/welcome');
        } else if (inExperiment && inOnboardingGroup) {
            // User is signed in but somehow landed in the onboarding flow.
            // Redirect them to the app's home page.
            router.replace('/');
        }
    }, [isLoading, state, segments]);

    // If loading, show a blank view or a global spinner
    if (isLoading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;
    }

    // If we are not loading and navigation is settled, show the children
    return <>{children}</>;
}