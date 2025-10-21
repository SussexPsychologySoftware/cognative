import {ExperimentDefinition} from "@/types/experimentConfig";

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
            id: 'surveyExample',
            name: 'Example Survey',
            prompt: 'Here it is:',
            path_to_screen: '/surveyExample',
            show_on_days: [0,1,2,3],
            datapipe_id: 'dOS0nQ93xCSV',
            show_for_conditions: ['control'], //independent conditions
            allow_edit: true,
            // required: true,
            // optional fields
            // showWhen: (context: object) => {
            //     const { day, condition, block, dayInBlock } = context;
            //     return day > 2 && condition !== 'baseline' && dayInBlock < 3;
            // },
            // availableFrom: '06:00',
            // availableUntil: '12:00',
            // reminder: true,
            // deadlineWarning: '11:30',
            // conditional_on_tasks: ['eveningDiary']
            // allow_edit: true
        }
    ]
}
