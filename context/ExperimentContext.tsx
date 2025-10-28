import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import { ExperimentDefinition } from '@/types/experimentConfig';
import { ExperimentDisplayState, ExperimentState } from '@/types/trackExperimentState';
import { experimentDefinition } from '@/config/experimentDefinition';
import {ExperimentTracker} from "@/services/longitudinal/ExperimentTracker";
import { DataService } from '@/services/data/DataService';
import {router} from "expo-router";
import {Alert} from "react-native";
import { useAutoRefresh } from '@/hooks/useAutoRefresh'
import {ConditionAssignment} from "@/services/ConditionAssignment";
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
    refreshing: boolean;

    // Functions to change experiment state
    startExperiment: (participantId?: string, condition?: string) => Promise<void>;
    completeTask: (taskId: string) => Promise<void>;
    submitTaskData: (taskId: string, data: any, filename?: string, datapipeId?: string, addTimestampWhenSending?: boolean) => Promise<void>;

    resetTaskCompletion: () => Promise<void>;
    stopExperiment: () => Promise<void>;
    confirmAndStopExperiment: () => void;

    refreshState: () => Promise<void>;
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
    // const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    // Pull in experiment definition
    const definition = experimentDefinition;

    const loadExperimentState = useCallback(async () => {
        try {
            // TODO: why not load the state directly from the context???
            let experimentState = await ExperimentTracker.getState();
            if (experimentState) {
                const newDisplayState = ExperimentTracker.calculateDisplayState(experimentState);

                if (newDisplayState.isExperimentComplete) {
                    router.replace('/end');
                    return;
                }
                setState(experimentState);
                setDisplayState(newDisplayState);
            }
        } catch (error) {
            console.error("Error loading experiment status:", error);
            // Let the hook handle errors, or setActionError here
        }
        // NO 'finally' block with setIsLoading
    }, []); // Empty dependency array is fine

    const { refreshing, refresh, loading } = useAutoRefresh({
        onRefresh: loadExperimentState, // Pass the function directly
        refreshOnMount: true,
        refreshOnFocus: false,
        refreshOnAppActive: true,
        scheduledRefreshHour: definition.cutoff_hour,
    });

    const startExperiment = useCallback(async (participantId?: string, condition?: string) => {
        setIsActionLoading(true);
        setActionError(null);
        try {
            let newCondition: string|string[];
            if(!condition) {
                const conditionDef = definition.conditions
                newCondition = await ConditionAssignment.getCondition(conditionDef.conditions,conditionDef.repeatedMeasures,conditionDef.datapipe_id)
            } else {
                newCondition = condition
            }
             // State needs
            const newState = await ExperimentTracker.startExperiment(Array.isArray(newCondition) ? newCondition[0] : newCondition, Array.isArray(newCondition) ? newCondition : undefined, participantId);
            const newDisplayState = ExperimentTracker.calculateDisplayState(newState);
            setState(newState);
            setDisplayState(newDisplayState);
        } catch (e: any) {
            console.error("Failed to start experiment:", e);
            setActionError(e.message || "Failed to start experiment");
        } finally {
            setIsActionLoading(false);
        }
    }, [definition.conditions]);

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

        const newDisplayState = ExperimentTracker.calculateDisplayState(newState);

        // Set react states
        setState(newState);
        setDisplayState(newDisplayState);

        // UI already updated so fire and forget saving task
        ExperimentTracker.setTaskCompleted(taskId).catch(err => {
            console.error("Failed to save task completion to storage:", err);
            // TODO: consider reverting state on error
        });

    }, [displayState, state]);

    const submitTaskData = useCallback(async (taskId: string, data: any, filename?: string, datapipeID?: string, addTimestampWhenSending?:boolean) => {
        if (!state || displayState === null) {
            // Note this is state issue not action error
            console.error("Cannot submit data: no experiment state found.");
            return;
        }
        // Note: Error state only set on failure - but useSurvey has own isSubmitting do isActionLoading not set
        // TODO: should use isActionLoading instead?
        setActionError(null);
        const { participantId } = state;
        if(!filename) {
            console.log("No filename passed, creating filename");
            const { experimentDay } = displayState;
            filename = ExperimentTracker.constructFilename(taskId, experimentDay, participantId)
        }
        try {
            await DataService.saveData(data, filename, datapipeID, participantId, addTimestampWhenSending);
            await completeTask(taskId); // 'optimistic' function - updates state and uses that, expects saving will be fine.
        } catch (e) {
            console.error("Failed to submit task data:", e);
            setActionError(`Failed to submit data\n${e}`);
            throw e; // Re-throw so useSurvey's 'handleSurveySubmit' can catch it
        }

    }, [state, displayState, completeTask]);

    const resetTaskCompletion = useCallback(async () => {
        setIsActionLoading(true);
        setActionError(null);
        try {
            const newState = await ExperimentTracker.resetTasks();

            if (newState) {
                // Recalculate the display state
                const newDisplayState = ExperimentTracker.calculateDisplayState(newState);
                setState(newState);
                setDisplayState(newDisplayState);
            } else {
                throw new Error("No state found to reset.");
            }
        } catch (e: any) {
            console.error("Failed to reset tasks:", e); // Corrected error
            setActionError(e.message || "Failed to reset tasks"); // Corrected error
        } finally {
            setIsActionLoading(false);
        }
    }, []); // No dependencies needed as the tracker handles getting the state

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
        isLoading: loading,
        definition,
        state,
        displayState,
        refreshState: refresh,
        refreshing,
        startExperiment,
        completeTask,
        submitTaskData,
        resetTaskCompletion,
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
