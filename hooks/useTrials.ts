import {useCallback, useEffect, useRef, useState} from "react";


export function useTrials (
    trials: Record<string, any>[],
    onSubmit: (data: Record<string, any>[]) => Promise<void>,
    isi?: number
)
{
    const [trialIndex, setTrialIndex] = useState(0);
    const [responses, setResponses] = useState<Record<string, any>[]>([]);
    const [trialStartTime, setTrialStartTime] = useState<number>(Date.now());

    // Derived states
    let currentTrial = trials[trialIndex];
    const isTaskFinished = trials.length > 0 && trialIndex >= trials.length;

    const [inISI, setInISI] = useState(false);
    const isiStartTime = useRef<number>(Date.now());
    const animationFrameRef = useRef<number | null>(null);

    const endISI = useCallback(()=>{
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        setInISI(false);
        setTrialStartTime(Date.now());
    }, [])

    const runIsiTimer = useCallback(() => {
        const timeLeft = Date.now()-isiStartTime.current
        if(isi && timeLeft >= isi) {
            endISI()
            return;
        }
        animationFrameRef.current = requestAnimationFrame(runIsiTimer);
    }, [endISI, isi]);

    useEffect(() => {
        // Stop if the task is finished
        if (trialIndex >= trials.length) {
            setInISI(false); // Ensure we're not stuck in ISI
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            return;
        }

        // Check if a valid ISI is provided
        if(isi) {
            // Start the ISI period
            isiStartTime.current = Date.now();
            animationFrameRef.current = requestAnimationFrame(runIsiTimer);
            setInISI(true);
        } else {
            // No ISI, start the trial immediately
            setInISI(false);
            setTrialStartTime(Date.now());
        }

        // Cleanup: ensures the timer is stopped if the component unmounts
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        }

    }, [trialIndex, isi, runIsiTimer, trials.length]);

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
            await onSubmit(newResponsesList); //Consider wrapping: {responses: newResponsesList}
        }

        setTrialIndex(nextIndex);
    }

    return {
        handleEndTrial,
        currentTrial,
        isTaskFinished,
        responses,
        inISI
    }
}
