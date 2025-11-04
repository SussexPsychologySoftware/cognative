import {View, Text, TouchableOpacity} from "react-native";
import {globalStyles} from "@/styles/appStyles";
import {useExperiment} from "@/context/ExperimentContext";
import {useState} from "react";

function InfoList({object, title}:{object: any, title: string}) {
    const [showState, setShowState] = useState(false);

    return (
        <>
            <TouchableOpacity onPress={()=>setShowState(!showState)}>
                <Text style={globalStyles.debugText}>{title} {showState ? '▼' : '▶'}
                </Text>
            </TouchableOpacity>
            { showState &&
                <Text style={[globalStyles.debugText, {color: 'white'}]}>{JSON.stringify(object,null, "\t")}</Text>
            }
        </>
    )
}

export default function ExperimentInfo({ object, showExperimentState=true, showDisplayState=true, showExperimentDefinition=true}: { object?: object, showExperimentState?: boolean, showDisplayState?: boolean, showExperimentDefinition?: boolean }) {
    const { state, displayState, definition } = useExperiment();

    return (
        <View style={globalStyles.debugContainer}>
            <Text style={[globalStyles.debugText, globalStyles.debugTitle]}>Experiment Info: </Text>
            { object && <InfoList object={object} title='Custom Object'/> }
            { showExperimentState && <InfoList object={state} title='Experiment State'/> }
            { showDisplayState && <InfoList object={displayState} title='Display State'/> }
            { showExperimentDefinition && <InfoList object={definition} title='Experiment Definition'/> }
        </View>
    )
}
