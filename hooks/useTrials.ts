import { useState } from "react";


export function useTrials (
    trials: Record<string, any>[],
    onSubmit: (data: object) => void,
)
{
    const [trialIndex, setTrialIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, any>[]>([]);
    // Derived states
    let currentTrial = trials[trialIndex];
    const isTaskFinished = trialIndex >= trials.length;

    const handleEndTrial = (response: object): void => {
        // Don't do anything if the task is already finished
        if (isTaskFinished) return;

        const newResponse = {
            ...currentTrial,
            ...response
        }

        setResponses(prevResponses =>
            [
                ...prevResponses,
                newResponse
            ]
        );

        // TODO: store responses in a new state array inside this hook.

        const nextIndex = trialIndex + 1;
        if(nextIndex === trials.length){
            onSubmit(
                [
                    ...responses,
                    newResponse
                ]
            )
        }

        setTrialIndex(nextIndex);
    }

    const handleEndTask = (): void => {
        // onSubmit(trials)
    }

    return {
        handleEndTrial,
        currentTrial,
        isTaskFinished
    }
}
