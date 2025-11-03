import ResetButtons from "@/components/debug/ResetButtons";
import PageList from "@/components/debug/PageList";
import ExperimentInfo from "@/components/debug/ExperimentInfo";

export default function Debug({object}:{object?: object}) {
    return (
        <>
            <ResetButtons/>
            <PageList/>
            <ExperimentInfo
                object={object}
            />
        </>
    )
}
