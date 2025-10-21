import {ExperimentDefinition} from "@/types/experimentState";

export const experimentDefinition: ExperimentDefinition = {
    name: 'Experiment',
    total_days: 14, //
    cutoff_hour: 4,
    conditions: ['control', 'monaural', 'binaural'],
    repeated_or_independent_conditions: 'repeated',
    condition_datapipe_id: 'dOS0nQ93xCSV',
    // blocks: {
    //     names: [],
    //     baseline_length: 2, //days
    //     n_days_per_block: 3, // nullable
    // },
    // end_when: '', // function??
    tasks: [
        {
            name: 'morning diary',
            prompt: 'Just woke up?',
            path_to_screen: '/morningDiary',
            show_on_days: [1,2,3],
            datapipe_id: 'dOS0nQ93xCSV',
            show_for_conditions: ['control'], //independent conditions
            // required: true,
            // optional fields
            // showWhen: (context: object) => {
            //     const { day, condition, block, dayInBlock } = context;
            //     return day > 2 && condition !== 'baseline' && dayInBlock < 3;
            // },
            // availableFrom: '06:00',
            // availableTo: '12:00',
            // deadlineWarning: '11:30',
            // reminder: true,
        }
    ]
}
