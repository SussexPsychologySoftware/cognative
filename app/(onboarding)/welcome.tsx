// app/(onboarding)/welcome.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { StandardView } from '@/components/layout/StandardView';
import { useExperiment } from '@/context/ExperimentContext';
import { router } from 'expo-router';
import SubmitButton from "@/components/inputs/SubmitButton";

export default function WelcomeScreen() {
    const { startExperiment, isActionLoading, actionError } = useExperiment();

    const handleStart = async () => {
        try {
            await startExperiment(); // Optionally pass in participant id and condition here if you want to set them yourself.
            // Navigate to the main app home screen
            router.replace('/');
        } catch (error) {
            // Note: error is now handled and set in the context
            console.error("Failed to start experiment:", error);
        }
    };

    return (
        <StandardView>
            <View style={{ flex: 1, justifyContent: 'center', gap: 20 }}>
                {/* Add your welcome text, instructions, etc. here */}
                <SubmitButton
                    text={isActionLoading ? "Starting..." : "Start Experiment"}
                    onPress={handleStart}
                    disabled={isActionLoading}
                />
                {actionError && (
                    <Text style={{ color: 'red', textAlign: 'center' }}>
                        {actionError}
                    </Text>
                )}
            </View>
        </StandardView>
    );
}
