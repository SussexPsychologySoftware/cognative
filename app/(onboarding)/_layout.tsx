import React from 'react';
import { Stack } from 'expo-router';

// This is the layout for the onboarding-only screens
export default function OnboardingLayout() {
    return (
        <Stack>
            <Stack.Screen name="welcome" options={{ title: 'Welcome' }} />
            {/* Add other screens like 'instructions' here */}
        </Stack>
    );
}