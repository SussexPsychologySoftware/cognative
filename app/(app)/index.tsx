import {Text} from "react-native";
import React, {useState} from "react";
import {StandardView} from "@/components/layout/StandardView";
import ToDoList from "@/components/longitudinal/ToDoList";
import { useExperiment } from "@/context/ExperimentContext";
import SubmitButton from "@/components/inputs/SubmitButton";
import {globalStyles} from "@/styles/appStyles";
import {router} from "expo-router";
import Debug from "@/components/debug/Debug";

export default function Index() {
    const { displayState, isLoading, definition } = useExperiment();
    const [routing, setRouting] = useState<boolean>(false);

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
            <SubmitButton
                text='Notification times'
                onPress={()=>{router.push('/settings')}}
                cooldown={500}
            />
            <Debug/>
        </StandardView>
    );
}

// const styles = StyleSheet.create({});
