import { TaskDefinition } from "@/types/experimentConfig";

// STORED INFO ON PARTICIPANT STATE ********
interface ParticipantInformation {
    // Stuff that never changes
    startDate: string; // ISO string
    participantId?: string;
    repeatedMeasuresConditionOrder?: string[];
}

interface BaseExperimentState extends ParticipantInformation {
    tasksLastCompletionDate: Record<string, string>;
}

// Note
interface IndependentMeasuresState extends BaseExperimentState {
    conditionType: 'independent';
    assignedCondition: string;
}

interface RepeatedMeasuresState extends BaseExperimentState {
    conditionType: 'repeated';
    repeatedMeasuresConditionOrder: string[];
}

export type ExperimentState = IndependentMeasuresState | RepeatedMeasuresState;

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
    currentConditionIndex: number;
    isExperimentComplete: boolean;
    allTasksCompleteToday: boolean;
    tasks: TaskDisplayStatus[];
}
