import {useEffect, useState} from "react";
import { RGB, LCH, LAB } from "@/types/colours";
import {Text} from "react-native";
import FullscreenView from "@/components/layout/FullscreenView";
import {useLockOrientation} from "@/hooks/useLockOrientation";
import {useTrials} from "@/hooks/useTrials";
import SubmitButton from "@/components/inputs/SubmitButton";
import {globalStyles} from "@/styles/appStyles";
import ChangeBackground from "@/components/DSA/ChangeBackground";

export default function AdjustColourScreen() {
    useLockOrientation()

    // CREATE THE TRIALS
    const [trials, setTrials] = useState<Record<string, object>[]>([]);

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
                // Push like this so responses store as 'startingColour: {l,c,h}'
                trials.push({startingColour})
            }
            return trials
        }

        const trialsArray = createTrialsArray();
        console.log(trialsArray);
        setTrials(trialsArray)
    }, []);

    const onSubmit = () => {
        //saveData
    }
    const {
        handleEndTrial,
        currentTrial,
        isTaskFinished,
        responses,
        isSubmitting
    } = useTrials(trials, onSubmit);

    if (isTaskFinished) {
        return (
            <FullscreenView>
                <Text style={globalStyles.standardText}>
                    Task Complete! Thank you.
                    {JSON.stringify(responses, null, 2)}
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
            <ChangeBackground
                startColour={currentTrial.startingColour}
                onSubmit={
                    (LAB, RGB) => {
                        handleEndTrial({
                            rt: Date.now(),
                            response: {LAB, RGB},
                        });
                    }
                }
                submitting={isSubmitting}
            />
            <Text>{JSON.stringify(currentTrial)}</Text>
        </FullscreenView>
       );
}

