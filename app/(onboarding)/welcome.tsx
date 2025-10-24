// app/(onboarding)/welcome.tsx
import React from 'react';
import { View, Button } from 'react-native';
import { StandardView } from '@/components/layout/StandardView';
import { useExperiment } from '@/context/ExperimentContext';
import { router } from 'expo-router';

export default function WelcomeScreen() {
    const { startExperiment } = useExperiment();

    const handleStart = async () => {
        try {
            // TODO: Add condition selection logic
            await startExperiment('control');
            // Navigate to the main app home screen
            router.replace('/');
        } catch (error) {
            console.error("Failed to start experiment:", error);
            // TODO: Show an error to the user
        }
    };

    return (
        <StandardView>
            <View style={{ flex: 1, justifyContent: 'center', gap: 20 }}>
                {/* Add your welcome text, instructions, etc. here */}
                <Button
                    title="Start Experiment"
                    onPress={handleStart}
                />
            </View>
        </StandardView>
    );
}