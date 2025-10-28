import React from 'react';
import { Stack } from 'expo-router';

// This is the layout for the main app screens
export default function AppLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Home' }} />
            <Stack.Screen name="survey" options={{ title: 'Survey' }} />
            <Stack.Screen name="surveyExample" options={{ title: 'Survey' }} />
            <Stack.Screen name="end" options={{ title: 'Finished' }} />
        </Stack>
    );
}
