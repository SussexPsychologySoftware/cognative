import {View, StyleSheet, Text, Task} from "react-native";
import React, {useCallback, useEffect, useState} from "react";
import SubmitButton from "@/components/basic/SubmitButton";
import {StandardView} from "@/components/layout/StandardView";
import {StatusBar} from "expo-status-bar";
import {globalStyles} from "@/styles/appStyles";
import {useSurvey} from "@/hooks/useSurvey";
import {SurveyQuestion} from '@/types/surveyQuestions'
import Survey from "@/components/survey/Survey";
import Picture from "@/components/media/Picture";
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
    }, [loading]);

    useEffect(() => {
        void loadExperimentStatus();
    }, [loadExperimentStatus]);

    return (
        <StandardView
            scrollable={true}
            safeAreaStyle={{padding: 30}}
        >
            <Text>TODO list:</Text>
            {
                displayState && <ToDoList taskStates={displayState.tasks}/>
            }
        </StandardView>
    );
}

const styles = StyleSheet.create({
    inputsContainer: {
        gap: 10
    },
});
