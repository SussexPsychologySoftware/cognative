import ResetButtons from "@/components/debug/ResetButtons";
import PageList from "@/components/debug/PageList";
import ExperimentInfo from "@/components/debug/ExperimentInfo";
import {View} from "react-native";

export default function Debug({object}:{object?: object}) {
    return (
        <View>
            <ResetButtons/>
            <PageList/>
            <ExperimentInfo
                object={object}
            />
        </View>
    )
}
