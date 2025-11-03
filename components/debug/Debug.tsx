import DebugButtons from "@/components/debug/DebugButtons";
import PageList from "@/components/debug/PageList";
import ExperimentInfo from "@/components/debug/ExperimentInfo";
import {View} from "react-native";

export default function Debug({object}:{object?: object}) {
    return (
        <View style={{marginTop: 50}}>
            <DebugButtons/>
            <PageList/>
            <ExperimentInfo
                object={object}
            />
        </View>
    )
}
