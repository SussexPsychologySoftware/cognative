export interface TaskDefinition {
    name: string;
    prompt?: string;
    path_to_screen: string;
    show_on_days: number[]; // Empty array means show all days
    show_for_conditions: string[]; // Empty array means show for all conditions
    datapipe_id: string;
}

export interface ExperimentDefinition {
    name: string; // Human-readable name
    total_days: number; // Total length of experiment
    cutoff_hour: number; // Hour (0-23) when "day" switches (e.g., 4 = 4am)
    conditions: string[];
    condition_datapipe_id?: string;
    repeated_or_independent_conditions: 'repeated'|'independent';
    tasks: TaskDefinition[];
}

