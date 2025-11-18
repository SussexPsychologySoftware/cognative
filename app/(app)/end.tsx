import {Text, View, StyleSheet} from 'react-native';
import ResetButtons from "@/components/debug/ResetButtons";
import PageList from "@/components/debug/PageList";
import {useExperiment} from "@/context/ExperimentContext";
import {globalStyles} from "@/styles/appStyles";
import {StandardView} from "@/components/layout/StandardView";

export default function EndScreen() {
    const { definition, displayState, state } = useExperiment();

    // TODO: add experimenter contact to config?
    return (
        <StandardView
            contentContainerStyle={{
                marginVertical: 40,
                gap: 30
            }}
            headerShown={false}
            statusBarStyle={'light'}
        >
            <Text style={globalStyles.standardText}>The experiment is now over, please contact the experimenter.</Text>
            <Text style={globalStyles.standardText}>Your Participant ID is: {state?.participantId}</Text>
            <ResetButtons/>
            <PageList/>
        </StandardView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
});
