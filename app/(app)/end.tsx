import {Text} from 'react-native';
import DebugButtons from "@/components/debug/DebugButtons";
import PageList from "@/components/debug/PageList";
import {useExperiment} from "@/context/ExperimentContext";
import {globalStyles} from "@/styles/appStyles";
import {StandardView} from "@/components/layout/StandardView";
import Debug from "@/components/debug/Debug";

export default function EndScreen() {
    const { state } = useExperiment();

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
            <Debug/>
        </StandardView>
    );
}
