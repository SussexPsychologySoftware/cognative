import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import { ExperimentDefinition } from '@/types/experimentConfig';
import { ExperimentDisplayState, ExperimentState } from '@/types/trackExperimentState';
import { experimentDefinition } from '@/config/experimentDefinition';
import {ExperimentTracker} from "@/services/longitudinal/ExperimentTracker";
import { DataService } from '@/services/data/DataService';
import {router} from "expo-router";
import {Alert} from "react-native";

// Define context type
interface ExperimentContextType {
    // Experiment info
    definition: ExperimentDefinition;         // The static config
    state: ExperimentState | null;            // The core stored state
    displayState: ExperimentDisplayState | null; // The calculated display state
    // Expose action specific states
    isLoading: boolean;                       // For loading screens
    isActionLoading: boolean;
    actionError: string | null;
    // Functions to change experiment state
    startExperiment: (condition: string, participantId?: string) => Promise<void>;
    completeTask: (taskId: string) => Promise<void>;
    submitTaskData: (taskId: string, data: any, datapipeId: string) => Promise<void>;
    stopExperiment: () => Promise<void>;
    confirmAndStopExperiment: () => void;
}

// init context as undefined
const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

// Easy way to use this context here, gives custom error
export function useExperiment() {
    const context = useContext(ExperimentContext);
    if (context === undefined) {
        throw new Error('useExperiment must be used within an ExperimentProvider');
    }
    return context;
}

// Component to wrap the app root in.
export function ExperimentProvider({ children }: { children: ReactNode }) {
    // States containing experiment info
    const [state, setState] = useState<ExperimentState | null>(null);
    const [displayState, setDisplayState] = useState<ExperimentDisplayState | null>(null);
    // Current action progress states
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    // Pull in experiment definition
    const definition = experimentDefinition;

    // Loading state logic
    useEffect(() => {
        const loadExperimentStatus = async () => {
            try {
                let experimentState = await ExperimentTracker.getState();
                if (experimentState) { // state remains null if it doesn't exist
                    const newDisplayState = ExperimentTracker.calculateDisplayState(experimentState);

                    if (newDisplayState.isExperimentComplete) {
                        router.replace('/end'); // TODO: consider a more flexible restoration router routeUsingState()
                        return;
                    }
                    setState(experimentState);
                    setDisplayState(newDisplayState);
                }

            } catch (error) {
                console.error("Error loading experiment status:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void loadExperimentStatus();
    }, []); // This runs once on app load

    const startExperiment = useCallback(async (condition: string, participantId?: string) => {
        setIsActionLoading(true);
        setActionError(null);
        try {
            const newState = await ExperimentTracker.startExperiment(condition, participantId);
            const newDisplayState = ExperimentTracker.calculateDisplayState(newState);
            setState(newState);
            setDisplayState(newDisplayState);
        } catch (e: any) {
            console.error("Failed to start experiment:", e);
            setActionError(e.message || "Failed to start experiment");
        } finally {
            setIsActionLoading(false);
        }
    }, []);

    const completeTask = useCallback(async (taskId: string) => {
        // Get current states using setState to ensure up to date (between rerenders?)
        if (!state || !displayState) {
            console.warn("Cannot complete task: state is not loaded.");
            return;
        }

        // 2. Create the new state *optimistically*
        const newCompletionDate = new Date().toISOString();

        // Update core state
        const newState: ExperimentState = {
            ...state, // No error here
            tasksLastCompletionDate: {
                ...state.tasksLastCompletionDate,
                [taskId]: newCompletionDate,
            },
        };

        // Update display state - faster than recalculating
        const newDisplayState: ExperimentDisplayState = {
            ...displayState, // No error here
            tasks: displayState.tasks.map(task =>
                task.definition.id === taskId
                    ? { ...task, completed: true }
                    : task
            ),
            // TODO: Update 'allTasksCompleteToday'
        };

        // Set react states
        setState(newState);
        setDisplayState(newDisplayState);

        // UI already updated so fire and forget saving task
        ExperimentTracker.setTaskCompleted(taskId).catch(err => {
            console.error("Failed to save task completion to storage:", err);
            // TODO: consider reverting state on error
        });

    }, [displayState, state]);

    const submitTaskData = useCallback(async (taskId: string, data: any, datapipeID?: string) => {
        if (!state || displayState === null) {
            // Note this is state issue not action error
            console.error("Cannot submit data: no experiment state found.");
            return;
        }
        // Note: Error state only set on failure - but useSurvey has own isSubmitting do isActionLoading not set
        // TODO: should use isActionLoading instead?
        setActionError(null);
        const { participantId } = state;
        const { experimentDay } = displayState;
        // Build the key to submit data with - by default experiment day is used
        // TODO: make this more flexible - issue with non-longitudinal studies
        const responseKey = ExperimentTracker.constructResponseKey(taskId, experimentDay)
        console.log({responseKey})
        try {
            await DataService.saveData(data, responseKey, datapipeID, participantId);
            await completeTask(taskId); // 'optimistic' function - updates state and uses that, expects saving will be fine.
        } catch (e) {
            console.error("Failed to submit task data:", e);
            setActionError(`Failed to submit data\n${e}`);
            throw e; // Re-throw so useSurvey's 'handleSurveySubmit' can catch it
        }

    }, [state, completeTask]);

    const stopExperiment = useCallback(async () => {
        setIsActionLoading(true);
        setActionError(null);
        try {
            await ExperimentTracker.stopExperiment();
            setState(null);
            setDisplayState(null);
        } catch (e: any) {
            console.error("Failed to stop experiment:", e);
            setActionError(e.message || "Failed to stop experiment");
        } finally {
            setIsActionLoading(false);
        }
        // App gate should automatically redirect to welcome page
    }, []);

    const confirmAndStopExperiment = useCallback(() => {
        Alert.alert(
            'WARNING',
            "Experiment progress will be reset. Are you sure?",
            [
                {
                    text: 'Reset experiment',
                    onPress: () => void stopExperiment(),
                    style: "destructive"
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    }, [stopExperiment]); // Add dependency

    // Create object to pass to context
    const value: ExperimentContextType = {
        isLoading,
        definition,
        state,
        displayState,
        startExperiment,
        completeTask,
        submitTaskData,
        stopExperiment,
        confirmAndStopExperiment,
        isActionLoading,
        actionError,
    };

    // return provider
    return (
        <ExperimentContext.Provider value={value}>
            {children}
        </ExperimentContext.Provider>
    );
}