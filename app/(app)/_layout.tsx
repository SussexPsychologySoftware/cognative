import React from 'react';
import { Stack } from 'expo-router';

// This is the layout for the main app screens
// export const unstable_settings = {
//     initialRouteName: '/', // Ensure any route can link back to `/`
// };

export default function AppLayout() {

    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Home' }} />
            <Stack.Screen name="survey" options={{ title: 'Survey' }} />
            <Stack.Screen name="settings" options={{ title: 'Settings' }} />
            <Stack.Screen name="end" />
        </Stack>
    );
}
