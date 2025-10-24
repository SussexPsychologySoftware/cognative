// TODO: move this into trackExperimentState and rename to experiment.ts

export interface TaskDefinition {
    id: string;
    name: string;
    prompt?: string;
    path_to_screen: string;
    show_on_days: number[]; // Empty array means show all days
    show_for_conditions: string[]; // Empty array means show for all conditions
    datapipe_id: string;
    allow_edit: boolean;
    params?: Record<string, any>;
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

export interface ExperimentDefinition {
    name: string; // Human-readable name
    total_days: number; // Total length of experiment
    cutoff_hour: number; // Hour (0-23) when "day" switches (e.g., 4 = 4am)
    conditions: string[];
    condition_datapipe_id?: string;
    repeated_or_independent_conditions: 'repeated'|'independent';
    tasks: TaskDefinition[];
    // Other ideas
    // blocks?: {
    //     names: [],
    //     baseline_length: 2, //days
    //     n_days_per_block: 3, // nullable
    // },
    // end_when?: '', // function??
}

