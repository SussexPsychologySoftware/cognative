export interface TaskDefinition {
    name: string,
    type: 'repeating' | 'once', //repeating is dated, singular is boolean
    showWhen: '', //function
    allowWhen: '', //function
    required: boolean,
}

export interface TaskStateBase {
    name: string;
    // Note these will need to be calculated from user defined functions during the experiment?
    shouldShow: boolean;
    isAllowed: boolean;
    isRequired: boolean;
    completed?: boolean, // need this or no?
}

export interface RepeatingTaskState extends TaskStateBase {
    dateLastCompleted: string, // or Date?
}

export interface SingularTaskState extends TaskStateBase {
    completed: boolean,
}

export type TaskState = RepeatingTaskState | SingularTaskState;

export interface ExperimentState {
    startDate: string;
    experimentDay: number;
    isExperimentComplete: boolean;
    tasks: TaskState[];
}
