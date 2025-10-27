import {Text} from "react-native";
import React from "react";
import {StandardView} from "@/components/layout/StandardView";
import ToDoList from "@/components/longitudinal/ToDoList";
import { useExperiment } from "@/context/ExperimentContext";
import SubmitButton from "@/components/inputs/SubmitButton";
import PageList from "@/components/debug/PageList";
import {globalStyles} from "@/styles/appStyles";
import {ExperimentTracker} from "@/services/longitudinal/ExperimentTracker";

export default function Index() {
    const { displayState, isLoading, definition, confirmAndStopExperiment, isActionLoading, resetTaskCompletion } = useExperiment();

    if(isLoading || !displayState) {
        // TODO: put loading spinner
        return (
            <StandardView>
                <Text>Loading experiment...</Text>
            </StandardView>
        );
    }

    return (
        <StandardView
            contentContainerStyle={{margin: 10, paddingTop: 30}}
            headerShown={false}
            statusBarStyle={'light'}
        >
            <Text style={globalStyles.pageTitle}>Today&#39;s activities:</Text>
            <Text style={[globalStyles.standardText, {alignSelf: 'center'}]}>Day {displayState.experimentDay+1} / {definition.total_days}</Text>
            <ToDoList
                taskStates={displayState.tasks}
                // TODO: just pass entire display state in here?
                // data={{}}
            />
            <SubmitButton
                text='Reset Tasks'
                onPress={resetTaskCompletion}
            />
            <SubmitButton
                text={isActionLoading ? "Resetting..." : "Reset Experiment"}
                onPress={confirmAndStopExperiment}
                style={{margin: 10, backgroundColor: "red"}}
            />
            <PageList/>
        </StandardView>
    );
}

// const styles = StyleSheet.create({});
