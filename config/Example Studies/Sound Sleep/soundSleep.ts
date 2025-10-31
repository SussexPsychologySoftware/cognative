import {ExperimentDefinition} from "@/types/experimentConfig";
import {DisplayCondition, SurveyComponent, SurveyDataType} from "@/types/surveyQuestions";

const ethnicitiesList = {
    'Asian or Asian British': [
        'Indian',
        'Pakistani',
        'Bangladeshi',
        'Chinese',
        'Any other Asian background',
    ],
    'Black, African, Caribbean or Black British': [
        'African',
        'Caribbean',
        'Any other Black, African or Caribbean background',
    ],
    'Mixed': [
        'Mixed or multiple ethnic groups',
        'White and Black Caribbean',
        'White and Black African',
        'White and Asian',
        'Any other Mixed or multiple ethnic background'
    ],
    'White': [
        'White English, Welsh, Scottish, Northern Irish or British',
        'White Irish',
        'White Gypsy or Irish Traveller',
        'White Roma',
        'Any other White background',
    ],
    'Other ethnic group': [
        'Arab',
        'Any other ethnic group',
    ]
}

const demographics: SurveyComponent[] = [
    {
        key: 'age',
        type: "number",
        question: 'What is your age?',
        required: true,
    },
    {
        key: 'gender',
        type: 'radio',
        question: 'What is your gender?',
        // TODO: add difference between label and value {label: value}, or auto capilatise first letter?
        options: ['Male', 'Female', 'Other or prefer to self describe', 'Prefer not to say'],
        required: true,
    },
    {
        key: 'selfDescribeGender',
        type: 'text',
        question: 'Describe your gender',
        conditions: [
            {key: 'gender', value: 'Other or prefer to self describe'},
        ],
        required: true
    },
    {
        key: 'Ethnicity',
        type: 'select',
        question: 'What is your ethnicity?',
        options: ethnicitiesList,
        multiple: false,
        required: true,
    },
]

const morningSleepDiary: SurveyComponent[] = [
    {
        key: 'time_went_bed',
        question: 'Time I went to bed last night',
        type: "time",
        default: '22:00',
        required: true,
    },
    {
        key: 'time_got_out_bed',
        question: 'Time I got out of bed this morning',
        type: 'time',
        default: '08:00',
        required: true,
    },
    {
        key: 'hours_in_bed',
        question: 'Hours spent in bed last night',
        type: 'number',
        default: '0',
        required: true
    },
    {
        key: 'number_awakenings',
        question: 'Number of awakenings last night',
        type: 'number',
        default: '0',
        required: true
    },
    {
        key: 'time_awake',
        question: 'Total time awake last night',
        type: 'lengthOfTime',
        default: '00:00',
        required: true
    },
    {
        key: 'how long fall asleep',
        question: 'How long I took to fall asleep last night',
        type: 'lengthOfTime',
        default: '00:00',
        required: true
    },
    {
        key: 'medicines',
        question: "Medicines taken last night to improve sleep",
        type: 'multiline',
    },
    {
        key: 'alertness',
        type: 'radio',
        question: 'How alert did I feel when I got up this morning',
        options: ['Alert', 'Alert but a little tired', 'Sleepy'],
        required: true
    }
]

const eveningSleepDiary: SurveyComponent[] = [
    {
        key: 'caffeinated',
        question: 'Number of caffeinated drinks (coffee, tea, cola) and time when I had them today',
        type: 'multiline',
    },
    {
        key: 'alcoholic',
        question: 'Number of alcoholic drinks (beer, wine, liquor) and time when I had them today',
        type: 'multiline',
    },
    {
        key: 'naptimes',
        question: 'Naptimes and lengths today',
        type: 'multiline',
    },
    {
        key: 'exercise',
        question: 'Exercise times and lengths today',
        type: 'multiline',
    },
    {
        key: 'sleepiness',
        question: 'How sleepy did I feel during the day today?',
        type: 'radio',
        options: ['So sleepy I had to struggle to stay awake during much of the day',
            'Somewhat tired', 'Fairly alert', 'Alert'],
        required: true
    }
]

const blockQuestionnaire: SurveyComponent[] = [
    {
        key: 'PHQ-8',
        type: 'likertGrid',
        name: 'PHQ-8',
        question: 'How often have you been bothered by the following over the past 4 days?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        statements: ['Little interest or pleasure in doing things?', 'Feeling down, depressed, or hopeless?',
            'Trouble falling or staying asleep, or sleeping too much?', 'Feeling tired or having little energy?',
            'Poor appetite or overeating?',
            'Feeling bad about yourself — or that you are a failure or have let yourself or your family down?',
            'Trouble concentrating on things, such as reading the newspaper or watching television?',
            'Moving or speaking so slowly that other people could have noticed? Or so fidgety or restless that you have been moving a lot more than usual?'
        ],
        required: true
    },
    {
        key: 'GAD-7',
        type: 'likertGrid',
        name: 'GAD-7',
        question: 'Over the last 4 days, how often have you been bothered by the following problems?',
        options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        statements: ['Feeling nervous, anxious, or on edge?', 'Not being able to stop or control worrying?',
            'Worrying too much about different things?', 'Trouble relaxing?', 'Being so restless that it is hard to sit still?',
            'Becoming easily annoyed or irritable?', 'Feeling afraid as if something awful might happen?'],
        required: true
    },
    {
        key: 'PROMIS_SD-SF_1-4',
        type: 'likertGrid',
        name: 'PROMIS SD-SF Q1-4',
        question: 'In the past 4 days...',
        options: ['Not at all', 'A little bit', 'Somewhat', 'Quite a bit', 'Very much'],
        statements: ['My sleep was restless','I was satisfied with my sleep','My sleep was refreshing',
            'I had difficulty falling asleep'
        ],
        required: true
    },
    {
        key: 'PROMIS_SD-SF_5-7',
        type: 'likertGrid',
        name: 'PROMIS SD-SF Q5-7',
        question: 'In the past 4 days...',
        options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
        statements: ['I had trouble staying asleep', 'I had trouble sleeping', 'I got enough sleep'],
        required: true
    },
    {
        key: 'PROMIS_SD-SF_8',
        type: 'likertGrid',
        name: 'PROMIS SD-SF Q8',
        question: 'In the past 4 days...',
        options: ['Very poor', 'Poor', 'Fair', 'Good', 'Very good'],
        statements: ['My sleep quality was'],
        required: true
    },
    {
        key: 'PROMIS_SRI-SF',
        type: 'likertGrid',
        name: 'PROMIS SRI-SF',
        question: 'In the past 4 days...',
        options: ['Not at all', 'A little bit', 'Somewhat', 'Quite a bit', 'Very much'],
        statements: ['I had a hard time getting things done because I was sleepy', 'I felt alert when I woke up',
            'I felt tired', 'I had problems during the day because of poor sleep',
            'I had a hard time concentrating because of poor sleep', 'I felt irritable because of poor sleep',
            'I was sleepy during the daytime', 'I had trouble staying awake during the day'],
        required: true
    },
    {
        key: 'MOSS-SS_1',
        type: 'radio', // Could be radio tbf
        question: 'How long did it usually take for you to fall asleep during the past 4 days?',
        options: ['0–15 minutes', '16–30 minutes', '31–45 minutes', '46–60 minutes', '>60 minutes'],
        required: true
    },
    {
        key: 'MOS-SS_Q2',
        question: 'On average, how many hours did you sleep each night during the past 4 days?',
        placeholder: 'Hours Slept',
        type: 'number',
        required: true
    }
]

const expectanciesQuestionnaire: SurveyComponent[] = [
    {
        key: 'CEQ_1',
        type: 'likertSingle',
        question: 'At this point, how logical does the current intervention seem to you?',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        labels: ['Not at all logical', 'Somewhat logical', 'Very logical'],
        required: true
    },
    {
        key: 'CEQ_2',
        type: 'likertSingle',
        question: 'At this point, how successfully do you think this treatment will be in improving your sleep?',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        labels: ['Not at all useful','Somewhat useful', 'Very useful'],
        required: true
    },
    {
        key: 'CEQ_3',
        type: 'likertSingle',
        question: 'How confident would you be in recommending this treatment to a friend who experiences similar sleep problems?',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        labels: ['Not at all confident', 'Somewhat confident', 'Very confident'],
        required: true
    },
    {
        key: 'CEQ_4',
        type: 'slider',
        // TODO: can be slider - pass in units suffix argument
        question: 'By the end of the treatment period (4 days), how much improvement in your sleep symptoms do you think will occur?',
        min:0,
        max:100,
        step:10,
        units:'%',
        showValue: true,
        default: 0,
        required: true
        // type: 'likertGrid',
        // options: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
        // oneWordPerLine: true
    },
    {
        key: 'set2_instructions', // note these are needed to cut down on unnecessary rerenders in react
        type: 'paragraph',
        title: 'Set 2',
        text: 'For this set, close your eyes for a few moments, and try to identify what you really feel about the ' +
            'intervention and its likely success. Then answer the following questions:',
    },
    {
        key: 'CEQ_5',
        type: 'likertSingle',
        question: 'At this point, how much do you really feel that this audio tone will help you to improve your sleep?',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        labels: ['Not at all', 'Somewhat', 'Very much'],
        required: true
    },
    {
        key: 'CEQ_6',
        type: 'slider',
        question: 'By the end of the treatment period (4 days), how much improvement in your sleep do you really feel will occur?',
        min:0,
        max:100,
        step:10,
        units:'%',
        showValue: true,
        default: 0,
        required: true
        // options: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
        // oneWordPerLine: true
    },
]

const audioTaskBinaural: SurveyComponent[] = [
    {
        key: 'audioBinaural',
        type: 'audio',
        question: '',
        file: require('@/assets/sounds/binaural.mp3'),
        instructions: ['Connect your headphones and press play when you are ready to begin playing your nightly sleep audio.',
        'Please do not exceed 50% volume on your device. Please make sure your phone is plugged in or has enough battery to last the night.'],
        containerStyle: {},
        textStyle: {},
        required: true,
        default: false, // autoplay
    }
]

const audioTaskControl: SurveyComponent[] = [
    {
        key: 'audioControl',
        type: 'audio',
        question: '',
        file: require('@/assets/sounds/control.mp3'),
        instructions: ['Connect your headphones and press play when you are ready to begin playing your nightly sleep audio.',
            'Please do not exceed 50% volume on your device. Please make sure your phone is plugged in or has enough battery to last the night.'],
        containerStyle: {},
        textStyle: {},
        required: true,
        default: false, // autoplay
    }
]

const audioTaskMonaural: SurveyComponent[] = [
    {
        key: 'audioMonaural',
        type: 'audio',
        question: '',
        file: require('@/assets/sounds/monaural.mp3'),
        instructions: ['Connect your headphones and press play when you are ready to begin playing your nightly sleep audio.',
            'Please do not exceed 50% volume on your device. Please make sure your phone is plugged in or has enough battery to last the night.'],
        containerStyle: {},
        textStyle: {},
        required: true,
        default: false, // autoplay
    }
]

function daysBetween(from: number, to: number) {
    return Array.from({ length: to - from + 1 }, (_, i) => i + from);
}

export const soundSleepDefinition: ExperimentDefinition = {
    name: 'Sound Sleep',
    total_days: 14,
    cutoff_hour: 4, // TODO: make cutoff time?
    conditions: {
        conditions: ['control', 'monaural', 'binaural'],
        repeatedMeasures: true,
        datapipe_id: 'dOS0nQ93xCSV',
        increase_on_days: [2,6,10] // baseline: 0,1; c1: 2,3,4,5; c2: 6,7,8,9; c3: 10,11,12,13; post-test 14
    },
    tasks: [
        {
            id: 'demographics',
            type: 'survey',
            name: 'Demographics',
            prompt: 'Please provide us with demographic information:',
            questions: demographics,
            show_on_days: [0],
            datapipe_id: 'dOS0nQ93xCSV',
            show_for_conditions: [], // all
            allow_edit: false,
        },
        {
            id: 'setVolume',
            type: 'screen',
            name: 'Set Volume',
            prompt: 'Set Audio Volume',
            path_to_screen: '/setVolume',
            show_on_days: [0], // TODO: remove 0
            datapipe_id: 'dOS0nQ93xCSV',
            show_for_conditions: [],
            allow_edit: false,
        },
        {
            id: 'morningSleepDiary',
            type: 'survey',
            name: 'Morning Sleep Diary',
            prompt: 'Just woke up?',
            questions: morningSleepDiary,
            show_on_days: daysBetween(1,13),
            datapipe_id: 'dOS0nQ93xCSV',
            show_for_conditions: [], // all
            allow_edit: true,
            notification: {
                prompt: 'Morning sleep diary:',
            }
        },
        {
            id: 'expectancies',
            type: 'survey',
            name: 'Expectancies',
            prompt: 'Complete this survey before your next session:',
            questions: expectanciesQuestionnaire,
            show_on_days: [0,3,7,11], //TODO: remove 0
            datapipe_id: 'dOS0nQ93xCSV',
            show_for_conditions: [], //all
            allow_edit: true,
        },
        {
            id: 'blockQuestionnaire',
            type: 'survey',
            name: 'Questionnaire',
            prompt: 'Complete this survey before your next session:',
            questions: blockQuestionnaire,
            show_on_days: [0,2,6,10,14],
            datapipe_id: 'dOS0nQ93xCSV',
            show_for_conditions: [], //all
            allow_edit: true,
        },
        {
            id: 'eveningSleepDiary',
            type: 'survey',
            name: 'Evening Sleep Diary',
            prompt: 'Going to bed?',
            questions: eveningSleepDiary,
            show_on_days: daysBetween(1,13),
            datapipe_id: 'dOS0nQ93xCSV',
            show_for_conditions: [], //all
            allow_edit: true,
            notification: {
                prompt: 'Evening sleep diary:',
            },
        },
        {
            id: 'audioTaskControl',
            type: 'survey',
            name: 'Sleep Audio',
            prompt: 'Listen to daily audio:',
            questions: audioTaskControl,
            show_on_days: daysBetween(0,13), // TODO: remove 0
            datapipe_id: 'dOS0nQ93xCSV',
            show_for_conditions: ['control'],
            allow_edit: false,
            notification: {
                prompt: 'Notification to listen to audio:',
            },
            autosumbit_on_complete: true
        },
        {
            id: 'audioTaskMonaural',
            type: 'survey',
            name: 'Sleep Audio',
            prompt: 'Listen to daily audio:',
            questions: audioTaskMonaural,
            show_on_days: daysBetween(1,13), // TODO: remove 0
            datapipe_id: 'dOS0nQ93xCSV',
            show_for_conditions: ['monaural'],
            allow_edit: false,
            notification: {
                prompt: 'Notification to listen to audio:',
            },
            autosumbit_on_complete: true
        },
        {
            id: 'audioTaskBinaural',
            type: 'survey',
            name: 'Sleep Audio',
            prompt: 'Listen to daily audio:',
            questions: audioTaskBinaural,
            show_on_days: daysBetween(1,13), // TODO: remove 0
            datapipe_id: 'dOS0nQ93xCSV',
            show_for_conditions: ['binaural'],
            allow_edit: false,
            notification: {
                prompt: 'Notification to listen to audio:',
            },
            autosumbit_on_complete: true
        },

    ]
}
