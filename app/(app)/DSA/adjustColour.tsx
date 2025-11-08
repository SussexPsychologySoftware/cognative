import {useEffect, useState} from "react";
import { RGB, LCH, LAB } from "@/types/colours";
import {Text} from "react-native";
import FullscreenView from "@/components/layout/FullscreenView";
import {useLockOrientation} from "@/hooks/useLockOrientation";
import {useTrials} from "@/hooks/useTrials";
import SubmitButton from "@/components/inputs/SubmitButton";
import {globalStyles} from "@/styles/appStyles";

export default function AdjustColourScreen() {
    useLockOrientation()

    // CREATE THE TRIALS
    const [trials, setTrials] = useState<LCH[]>([]);

    useEffect(() => {
        const N_TRIALS = 3

        const getRandomStartingColour = ():LCH => {
            return {
                l: 85,
                c: 20*Math.random(),
                h: Math.floor(Math.random() * 360)
            }
        }

        const createTrialsArray= () => {
            const trials = [];
            for(let h=0; h<N_TRIALS; h++){
                const startingColour = getRandomStartingColour();
                trials.push(startingColour)
            }
            return trials
        }

        setTrials(createTrialsArray())
    }, []);

    const onSubmit = () => {
        //saveData
    }
    const {
        handleEndTrial,
        currentTrial,
        isTaskFinished
    } = useTrials(trials, onSubmit);

    if (isTaskFinished) {
        return (
            <FullscreenView>
                <Text style={globalStyles.standardText}>
                    Task Complete! Thank you.
                </Text>
            </FullscreenView>
        );
    }

    if (!currentTrial) {
        return (
            <FullscreenView>
                <Text style={globalStyles.standardText}>
                    Loading...
                </Text>
            </FullscreenView>
        );
    }


    return(
        <FullscreenView>
            <Text style={globalStyles.standardText}>
                {JSON.stringify(currentTrial)}
            </Text>
            <SubmitButton
                text="Submit"
                onPress={() => {
                    handleEndTrial({
                        rt: Date.now(),
                        response: currentTrial
                    });
                }}
            />
        </FullscreenView>
       );
}

