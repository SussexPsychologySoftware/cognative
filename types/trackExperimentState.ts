import { TaskDefinition, NotificationDefinition } from "@/types/experimentConfig";

// STORED INFO ON PARTICIPANT STATE ********
interface ParticipantInformation {
    // Stuff that never changes
    startDate: string; // ISO string
    participantId?: string;
}

export type NullableStringRecord = Record<string, string|null>

interface BaseExperimentState extends ParticipantInformation {
    tasksLastCompletionDate: NullableStringRecord;
    notificationTimes: NullableStringRecord;
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

export interface scheduledNotification {
    definition: NotificationDefinition,
    time: string, // or date? going to be serialised
}

export interface ExperimentDisplayState {
    participantId: string;
    experimentDay: number; // Day 0, 1, 2, etc.
    currentCondition: string;
    currentConditionIndex: number;
    isExperimentComplete: boolean;
    allTasksCompleteToday: boolean;
    tasks: TaskDisplayStatus[];
    notifications?: scheduledNotification[]
}
