import {useEffect, useState} from "react";


export function useTrials (
    trials: Record<string, any>[],
    onSubmit: (data: object) => Promise<void>,
)
{
    const [trialIndex, setTrialIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, any>[]>([]);
    const [trialStartTime, setTrialStartTime] = useState<number>(Date.now());

    // Derived states
    let currentTrial = trials[trialIndex];
    const isTaskFinished = trials.length > 0 && trialIndex >= trials.length;

    // NEW: Effect to update the start time whenever a new trial begins
    useEffect(() => {
        // When the trialIndex changes, record the current time as start of the new trial.
        if (!isTaskFinished) {
            setTrialStartTime(Date.now());
        }
    }, [trialIndex, isTaskFinished]); // This effect runs when trialIndex changes

    const handleEndTrial = async(response: object): Promise<void> => {
        // Don't do anything if the task is already finished
        if (isTaskFinished) return;

        const endTime = Date.now();
        const reactionTime = endTime - trialStartTime; // Calculate RT duration

        const newResponse = {
            ...currentTrial,
            response,
            rt: reactionTime,       // Add the calculated RT
            startTime: trialStartTime, // Add the trial start time
            endTime: endTime,         // Add the trial end time
        }

        const newResponsesList = [
            ...responses,
            newResponse
        ];

        setResponses(newResponsesList);

        const nextIndex = trialIndex + 1;
        if (nextIndex === trials.length) {
            await onSubmit({
                responses: newResponsesList
            });
        }

        setTrialIndex(nextIndex);
    }

    return {
        handleEndTrial,
        currentTrial,
        isTaskFinished,
        responses,
    }
}
