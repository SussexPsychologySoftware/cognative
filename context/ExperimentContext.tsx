import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
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
    // TODO: add actions
}

// 2. CREATE THE CONTEXT
// init context as undefined
const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

// Easy way to use context here, gives custom error
export function useExperiment() {
    const context = useContext(ExperimentContext);
    if (context === undefined) {
        throw new Error('useExperiment must be used within an ExperimentProvider');
    }
    return context;
}

// TODO add <ExperimentProvider> component

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
                if (!experimentState) {
                    // TODO: fix loading of participant ID and condition
                    experimentState = await ExperimentTracker.startExperiment('control');
                }

                const newDisplayState = ExperimentTracker.calculateDisplayState(experimentState);

                // TODO: useRestore here??
                if (newDisplayState.isExperimentComplete) {
                    router.replace('/end');
                    return;
                }

                // Set the state for the provider
                setState(experimentState);
                setDisplayState(newDisplayState);

            } catch (error) {
                console.error("Error loading experiment status:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void loadExperimentStatus();
    }, []); // This runs once on app load

    // Create object to pass to context
    const value: ExperimentContextType = {
        isLoading,
        definition,
        state,
        displayState,
        // TODO: actions like 'completeTask' here
    };

    // return provider
    return (
        <ExperimentContext.Provider value={value}>
            {children}
        </ExperimentContext.Provider>
    );
}