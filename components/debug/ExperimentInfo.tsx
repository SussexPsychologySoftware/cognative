import {View, Text, TouchableOpacity} from "react-native";
import {globalStyles} from "@/styles/appStyles";
import {useExperiment} from "@/context/ExperimentContext";
import {useCallback, useEffect, useState} from "react";
import {dataQueue} from "@/services/data/dataQueue";

function InfoList({object, title, onPress}: {object: any, title: string, onPress?: () => void}) {
    const [showState, setShowState] = useState(false);

    return (
        <>
            <TouchableOpacity onPress={()=>{
                setShowState(!showState)
                if (onPress) {
                    onPress();
                }
            }}>
                <Text style={globalStyles.debugText}>{title} {showState ? '▼' : '▶'}
                </Text>
            </TouchableOpacity>
            { showState &&
                <Text style={[globalStyles.debugText, {color: 'white'}]}>{JSON.stringify(object,null, "\t")}</Text>
            }
        </>
    )
}

export default function ExperimentInfo({
                                           object,
                                           objectTitle,
                                           showExperimentState=true,
                                           showDisplayState=true,
                                           showExperimentDefinition=true,
                                           showQueue=true}:
                                       {
                                           object?: object,
                                           objectTitle?: string,
                                           showExperimentState?: boolean,
                                           showDisplayState?: boolean,
                                           showExperimentDefinition?: boolean,
                                           showQueue?: boolean,
                                       }) {
    const { state, displayState, definition } = useExperiment();

    // TODO: maybe unnecessary...
    const [queue, setQueue] = useState<object[]|null>(null);
    const [queueRefreshKey, setQueueRefreshKey] = useState(0);
    const refreshQueue = useCallback(() => {
        setQueueRefreshKey(prev => prev + 1);
    }, []);
    useEffect(() => {
        const retrieveQueue = async()=>{
            const currentQueue = await dataQueue.getQueue()
            setQueue(currentQueue);
        }
        void retrieveQueue()
    }, [queueRefreshKey])

    return (
        <View style={globalStyles.debugContainer}>
            <Text style={[globalStyles.debugText, globalStyles.debugTitle]}>Experiment Info: </Text>
            { object && <InfoList object={object} title={objectTitle??'Custom Object'}/> }
            { showExperimentState && <InfoList object={state} title='Experiment State'/> }
            { showDisplayState && <InfoList object={displayState} title='Display State'/> }
            { showExperimentDefinition && <InfoList object={definition} title='Experiment Definition'/> }
            { showQueue && <InfoList object={queue} title='Queue' onPress={refreshQueue}/> }
        </View>
    )
}
