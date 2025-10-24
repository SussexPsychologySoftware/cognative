import {StyleSheet, Text} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import {StandardView} from "@/components/layout/StandardView";
import ToDoList from "@/components/longitudinal/ToDoList";
import {ExperimentTracker} from "@/services/longitudinal/ExperimentTracker";
import {router} from "expo-router";
import {ExperimentDisplayState, TaskDisplayStatus} from "@/types/trackExperimentState";

export default function Index() {
    const [loading, setLoading] = useState(false);
    const [displayState, setDisplayState] = useState<ExperimentDisplayState>();

    const loadExperimentStatus = useCallback(async () => {
        if(loading) return
        setLoading(true);
        try {
            let experimentState = await ExperimentTracker.getState()
            if (!experimentState) {
                experimentState = await ExperimentTracker.startExperiment('control','abc'); // or redirect appropriately
            }
            console.log(experimentState);
            const newDisplayState = ExperimentTracker.calculateDisplayState(experimentState);
            // Check if experiment has ended
            if (newDisplayState.isExperimentComplete) {
                router.replace('/end');
                return;
            }

            setDisplayState(newDisplayState);
        } catch (error) {
            console.error("Error loading experiment status:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadExperimentStatus();
    }, [loadExperimentStatus]);

    if(loading) return null;
    return (
        <StandardView safeAreaStyle={{padding: 30}}>
            <Text>TO DO list:</Text>
            {
                displayState &&
                <ToDoList
                    taskStates={displayState.tasks}
                    data={{
                        day: displayState.experimentDay,
                        condition: displayState.currentCondition,
                    }}
                />
            }
        </StandardView>
    );
}

const styles = StyleSheet.create({
    inputsContainer: {
        gap: 10
    },
});
