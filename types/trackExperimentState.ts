// STORED INFO ON PARTICIPANT STATE ********
interface ParticipantInformation {
    // Stuff that never changes
    startDate: string; // ISO string
    participantId?: string;
}

export interface ExperimentState extends ParticipantInformation {
    currentCondition: string; // For repeated measures, or string for independent
    tasksLastCompletionDate: Record<string, string>;
}

// FOR DISPLAY STATE **************
export interface TaskDisplayStatus { // This is essentially a to-do list item
    // Info from the definition
    id: string,
    name: string;
    prompt?: string;
    path_to_screen: string;
    params?: Record<string, any>;

    // Actual status stuff
    // shouldShow: boolean; // redundant
    isAllowed: boolean; // Can be clicked
    completed?: boolean; // need this or no?
}

export interface ExperimentDisplayState {
    participantId: string;
    experimentDay: number; // Day 0, 1, 2, etc.
    currentCondition: string;
    isExperimentComplete: boolean;
    allTasksCompleteToday: boolean;
    tasks: TaskDisplayStatus[];
}
