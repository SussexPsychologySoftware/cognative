import {StyleSheet, View, Text, TouchableOpacity} from "react-native";
import {globalStyles} from "@/styles/appStyles";
import {useExperiment} from "@/context/ExperimentContext";
import {useState} from "react";

function InfoList({object, title}:{object: any, title: string}) {
    const [showState, setShowState] = useState(false);

    return (
        <>
            <TouchableOpacity onPress={()=>setShowState(!showState)}>
                <Text style={styles.objectTitle}>{title} {showState ? '▼' : '▶'}
                </Text>
            </TouchableOpacity>
            { showState &&
                <Text style={styles.debugText}>{JSON.stringify(object,null, "\t")}</Text>
            }
        </>
    )
}

export default function ExperimentInfo({ object, showExperimentState=true, showDisplayState=true, showExperimentDefinition=true}: { object?: object, showExperimentState?: boolean, showDisplayState?: boolean, showExperimentDefinition?: boolean }) {
    const { state, displayState, definition } = useExperiment();

    return (
        <View style={styles.container}>
            <Text style={styles.componentTitle}>Experiment Info: </Text>
            { object && <InfoList object={object} title='Custom Object'/> }
            { showExperimentState && <InfoList object={state} title='Experiment State'/> }
            { showDisplayState && <InfoList object={displayState} title='Display State'/> }
            { showExperimentDefinition && <InfoList object={definition} title='Experiment Definition'/> }
        </View>
    )
}

const styles = StyleSheet.create({
    // Page list for debugging
    container: {
        gap: 5,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: 'grey',
    },
    componentTitle: {
        color: 'grey',
        fontSize: 14,
        marginBottom: 8,
    },
    objectTitle: {
        color: 'grey',
        fontSize: 14,
    },
    debugText: {
        color: 'white',
        fontSize: 14,
    },
});
