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
            // Not setup but in onboarding flow - redirect to onboarding start page.
            router.replace('/(onboarding)/welcome');
        } else if (inExperiment && inOnboardingGroup) {
            // User is setup but landed in onboarding flow, redirect to homepage.
            router.replace('/');
        }
    }, [isLoading, state, segments]);

    // If loading, show a blank view or a global spinner
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        )
    }

    // If not loading and navigation finished, show children
    return (
        <>
            {children}
        </>
    )
}