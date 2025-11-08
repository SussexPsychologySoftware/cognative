import { useState } from "react";


export function useTrials (
    trials: Record<string, any>[],
    onSubmit: (data: object) => Promise<void>,
)
{
    const [trialIndex, setTrialIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, any>[]>([]);
    // Derived states
    let currentTrial = trials[trialIndex];
    const isTaskFinished = trials.length > 0 && trialIndex >= trials.length;

    const handleEndTrial = async(response: object): Promise<void> => {
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
            await onSubmit(
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
        isTaskFinished,
        responses,
    }
}
