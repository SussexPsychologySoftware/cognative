import {Text, View} from "react-native";
import React from "react";
import {StandardView} from "@/components/layout/StandardView";
import ToDoList from "@/components/longitudinal/ToDoList";
import { useExperiment } from "@/context/ExperimentContext";
import SubmitButton from "@/components/inputs/SubmitButton";
import PageList from "@/components/debug/PageList";
import {globalStyles} from "@/styles/appStyles";
import {ExperimentTracker} from "@/services/longitudinal/ExperimentTracker";
import ResetButtons from "@/components/debug/ResetButtons";
import ExperimentInfo from "@/components/debug/ExperimentInfo";

export default function Index() {
    const { displayState, isLoading, definition } = useExperiment();

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
            <Text style={[globalStyles.standardText, {alignSelf: 'center'}]}>{
                displayState.experimentDay+1 === definition.total_days+1 ?
                    'Last experiment day' :
                    `Day ${displayState.experimentDay+1} / ${definition.total_days+1}`
            }</Text>
            <ToDoList
                taskStates={displayState.tasks} // Or pass in entire display state?
                // data={{}} // Could pass experiment info through this?
            />
            <ResetButtons/>
            <PageList/>
            <ExperimentInfo/>
        </StandardView>
    );
}

// const styles = StyleSheet.create({});
