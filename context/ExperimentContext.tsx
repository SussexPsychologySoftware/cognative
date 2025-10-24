import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import { ExperimentDefinition } from '@/types/experimentConfig';
import { ExperimentDisplayState, ExperimentState } from '@/types/trackExperimentState';
import { experimentDefinition } from '@/config/experimentDefinition';
import {ExperimentTracker} from "@/services/longitudinal/ExperimentTracker";
import {router} from "expo-router";

// Define context type
interface ExperimentContextType {
    definition: ExperimentDefinition;         // The static config
    state: ExperimentState | null;            // The core stored state
    displayState: ExperimentDisplayState | null; // The calculated display state
    isLoading: boolean;                       // For loading screens
    startExperiment: (condition: string, participantId?: string) => Promise<void>;
    completeTask: (taskName: string) => Promise<void>;
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
    // States for loading experiment state
    const [isLoading, setIsLoading] = useState(true);
    const [state, setState] = useState<ExperimentState | null>(null);
    const [displayState, setDisplayState] = useState<ExperimentDisplayState | null>(null);

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

    const completeTask = useCallback(async (taskName: string) => {
        await ExperimentTracker.setTaskCompleted(taskName); // Complete the task
        const newState = await ExperimentTracker.getState(); // Grab new state
        if (!newState) return; // Shouldn't happen, but good to check
        // Recalculate the display state
        const newDisplayState = ExperimentTracker.calculateDisplayState(newState);
        // Update the React state, triggering a re-render
        setState(newState);
        setDisplayState(newDisplayState);

    }, []);

    const startExperiment = useCallback(async (condition: string, participantId?: string) => {
        const newState = await ExperimentTracker.startExperiment(condition, participantId);
        const newDisplayState = ExperimentTracker.calculateDisplayState(newState);
        setState(newState);
        setDisplayState(newDisplayState);
    }, []);

    // Create object to pass to context
    const value: ExperimentContextType = {
        isLoading,
        definition,
        state,
        displayState,
        startExperiment,
        completeTask
    };

    // return provider
    return (
        <ExperimentContext.Provider value={value}>
            {children}
        </ExperimentContext.Provider>
    );
}