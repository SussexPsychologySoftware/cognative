// TODO: move this into trackExperimentState and rename to experiment.ts
import {SurveyComponent} from "@/types/surveyQuestions";


export interface NotificationDefinition {
    prompt?: string;
    default_time?: string;
    // repeat_daily: true;
}

export interface TaskNotification extends NotificationDefinition {
    taskId: string;
}

interface TaskDefinitionBasic {
    id: string;
    name: string;
    prompt?: string;
    show_on_days: number[]; // Empty array means show all days
    show_for_conditions: string[]; // Empty array means show for all conditions
    datapipe_id: string;
    allow_edit: boolean; // TODO: change to allow_once
    params?: Record<string, any>; // other stuff to pass in
    type: 'survey' | 'screen' | 'web';
    notification?: NotificationDefinition;
    autosumbit_on_complete?: boolean;
    route_on_submit?: string; // Maybe make this the input to router.replace({pathname,params})?
    // Other ideas
    // required: true,
    // showWhen?: (context: object) => {
    //     const { day, condition, block, dayInBlock } = context;
    //     return day > 2 && condition !== 'baseline' && dayInBlock < 3;
    // },
    // availableFrom?: '06:00',
    // availableUntil?: '12:00',
    // reminder?: true,
    // deadlineWarning?: '11:30',
    // conditional_on_tasks?: ['eveningDiary']
}

// Export type tasks for use in each screen displaying that type
export interface SurveyTaskDefinition extends TaskDefinitionBasic {
    type: 'survey',
    questions: SurveyComponent[],
}

export interface ScreenTaskDefinition extends TaskDefinitionBasic {
    type: 'screen',
    path_to_screen: string;
}

export interface WebTaskDefinition extends TaskDefinitionBasic {
    type: 'web',
    url: string;
}

export type TaskDefinition = SurveyTaskDefinition | ScreenTaskDefinition | WebTaskDefinition;

// -*#*-*#*- EXPERIMENT -*#*-*#*-

interface IndependentMeasuresCondition {
    conditions: string[];
    datapipe_id?: string;
    repeatedMeasures: boolean;
}

export interface RepeatedMeasuresCondition extends IndependentMeasuresCondition {
    repeatedMeasures: true;
    increase_on_days: number[];
}

type ConditionDefinition = RepeatedMeasuresCondition | IndependentMeasuresCondition

export interface ExperimentDefinition {
    name: string; // Human-readable name
    passphrase?: string;
    total_days: number; // Total length of experiment
    cutoff_hour: number; // Hour (0-23) when "day" switches (e.g., 4 = 4am)
    conditions: ConditionDefinition;
    tasks: TaskDefinition[];
    // Other ideas
    // blocks?: {
    //     names: [],
    //     baseline_length: 2, //days
    //     n_days_per_block: 3, // nullable
    // },
    // end_when?: '', // function??
}

