import {Text, StyleSheet} from "react-native";
import {StandardView} from "@/components/layout/StandardView";
import ToDoList from "@/components/longitudinal/ToDoList";
import { useExperiment } from "@/context/ExperimentContext";
import SubmitButton from "@/components/inputs/SubmitButton";
import {globalStyles} from "@/styles/appStyles";
import {router} from "expo-router";

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
            <Text style={[globalStyles.standardText, {alignSelf: 'center'}]}>
                {
                    displayState.experimentDay+1 === definition.total_days+1 ?
                        'Last experiment day' :
                        `Day ${displayState.experimentDay+1} / ${definition.total_days+1}`
                }
            </Text>
            {
                displayState.allTasksCompleteToday &&
                <Text style={[globalStyles.standardText, styles.allTasksCompleteToday]}>
                    ✓ All activities completed for today
                </Text>
            }

            <ToDoList
                taskStates={displayState.tasks} // Or pass in entire display state?
                // data={{}} // Could pass experiment info through this?
            />
            <Text
                style={[globalStyles.sectionTitle, {alignSelf: 'center'}]}
            >
                Settings
            </Text>
            <SubmitButton
                icon='gear'
                text='Change notification times'
                onPress={()=>{router.push('/settings')}}
                cooldown={500}
                style={{
                    backgroundColor: 'transparent',
                    borderColor: 'white',
                    borderWidth: 1,
                    marginVertical: 15,
                }}
                textStyle={{
                    color: 'white',
                }}
                iconColor={'white'}
            />
        </StandardView>
    );
}

const styles = StyleSheet.create({
    allTasksCompleteToday: {
        alignSelf: 'center',
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 5,
        padding: 10,
        color: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.05)',
    }
});
