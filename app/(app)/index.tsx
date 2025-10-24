import {Text} from "react-native";
import React from "react";
import {StandardView} from "@/components/layout/StandardView";
import ToDoList from "@/components/longitudinal/ToDoList";
import { useExperiment } from "@/context/ExperimentContext";
import SubmitButton from "@/components/inputs/SubmitButton";
import PageList from "@/components/debug/PageList";

export default function Index() {
    const { displayState, isLoading, definition, confirmAndStopExperiment, isActionLoading } = useExperiment();

    if(isLoading || !displayState) {
        // TODO: put loading spinner
        return (
            <StandardView>
                <Text>Loading experiment...</Text>
            </StandardView>
        );
    }

    return (
        <StandardView safeAreaStyle={{padding: 30}}>
            <Text>TO DO list: Day {displayState.experimentDay} / {definition.total_days}</Text>

            <ToDoList
                taskStates={displayState.tasks}
                data={{
                    day: displayState.experimentDay,
                    condition: displayState.currentCondition,
                }}
            />
            <SubmitButton
                text={isActionLoading ? "Resetting..." : "Reset Experiment (Debug)"}
                onPress={confirmAndStopExperiment}
                style={{margin: 10, backgroundColor: "red"}}
            />
            <PageList/>
        </StandardView>
    );
}

// const styles = StyleSheet.create({});
