import { TaskDefinition } from "@/types/experimentConfig";

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
export interface TaskDisplayStatus {
    definition: TaskDefinition;
    isAllowed: boolean;
    completed: boolean; // Let's make this non-optional for clarity
}

export interface ExperimentDisplayState {
    participantId: string;
    experimentDay: number; // Day 0, 1, 2, etc.
    currentCondition: string;
    isExperimentComplete: boolean;
    allTasksCompleteToday: boolean;
    tasks: TaskDisplayStatus[];
}
