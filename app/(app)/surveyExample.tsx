import {View, StyleSheet, Text} from "react-native";
import SubmitButton from "@/components/inputs/SubmitButton";
import {StandardView} from "@/components/layout/StandardView";
import {StatusBar} from "expo-status-bar";
import {globalStyles} from "@/styles/appStyles";
import {useSurvey} from "@/hooks/useSurvey";
import {SurveyQuestion} from '@/types/surveyQuestions'
import Survey from "@/components/survey/Survey";
import Picture from "@/components/media/Picture";
import {router, useLocalSearchParams} from 'expo-router';
import {useExperiment} from "@/context/ExperimentContext"; // 1. Import hook


export default function SurveyExample() {
    const { responseKey, taskName, datapipeId } = useLocalSearchParams<{ responseKey: string, taskName: string, datapipeId: string }>();
    const { submitTaskData } = useExperiment();

    // Define survey questions with keys
    const optionsListNested = {
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


    const questions: SurveyQuestion[] = [
        {
            key: 'age',
            question: 'What is your age?',
            required: true,
            type: "number",
        },
        {
            key: 'gender',
            question: 'What is your gender?',
            type: 'radio',
            // TODO: add difference between label and value {label: value}
            options: ['Male', 'Female', 'Other or prefer to self describe', 'Prefer not to say'],
        },
        {
            key: 'selfDescribeGender',
            question: 'Describe your gender',
            type: 'text',
            conditions: [
                {key: 'gender', value: 'Other or prefer to self describe'},
            ],
            required: true
        },
        {
            key: 'Ethnicity',
            question: 'What is your ethnicity?',
            type: 'select',
            options: optionsListNested
        },
        {
            key: 'localTime',
            question: 'What is the time where you are now?',
            type: "time",
        },
        {
            key: 'multilineTextInput',
            question: "Tell us about yourself",
            type: 'multiline',
            placeholder: "Say as much as you like...",
        },
        {
            key: 'consent',
            question: '',
            label: 'Do you consent to take part in this experiment?',
            type: 'checkbox',
            required: false,
        },
        {
            key: 'content',
            question: 'On a scale of 0-1, how content are you?',
            type: 'slider',
            default: 5,
            min: 0,
            max: 10,
            step: 1,
            labels: ['Content', 'Neither content nor uncontent', 'Uncontent']
        },
        {
            key: 'confidence',
            question: 'How confident would you be in recommending this treatment to a friend who experiences similar problems?',
            options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            labels: ['Not at all confident', 'Very confident'],
            type: 'likertSingle'
        },
        {
            key: 'phq8',
            type: 'likertGrid',
            name: 'PHQ-8',
            required: false,
            question: 'Over the last 4 days have you felt...',
            statements: [
                'Little interest or pleasure in doing things?',
                'Feeling down, depressed, or hopeless?',
                'Trouble falling or staying asleep, or sleeping too much?',
                'Feeling tired or having little energy?',
                'Poor appetite or overeating?',
                'Feeling bad about yourself, or that you are a failure or have let yourself or your family down?',
                'Trouble concentrating on things, such as reading the newspaper or watching television?',
                'Moving or speaking so slowly that other people could have noticed? Or so fidgety or restless that you have been moving a lot more than usual?'
            ],
            options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
        }
    ];

    const onSubmit = async (responses: object) => {
        if (taskName) {
            await submitTaskData(taskName, responses, datapipeId);
        }
        if (router.canGoBack()) {
            router.back(); // Go back to the to-do list
        } else {
            router.replace('/');
        }
    }

    const {
        responses, // Contains responses as {fieldKey: "response"} made from survey definition
        updateResponses, // Function to update responses
        handleSurveySubmit, // Function to run when submitting responses
        warning, // Text listing first incorrect question in survey
        isSubmitting, // Useful for blocking submit buttons
        progress, // % of survey currently completed
        resetSurvey, // Function to reset survey state
        invalidQuestions // Contains an object of invalid responses to update state with
    } = useSurvey(questions, onSubmit, responseKey);

    return (
        <StandardView headerShown={true}>
            <Text style={[globalStyles.pageTitle, {marginVertical: 30}]}>Survey Example</Text>
            <StatusBar style={'dark'}/>
            <View style={styles.inputsContainer}>
                <Text style={globalStyles.sectionTitle}>Demographics</Text>
                <Picture
                    asset={require('@/assets/images/icon.png')}
                    caption='Images are displayed like this'
                />
                <Survey
                    questions={questions.slice(0,8)}
                    responses={responses}
                    updateResponses={updateResponses}
                    invalidQuestions={invalidQuestions}
                />

                <Text style={globalStyles.sectionTitle}>Please fill out the following survey</Text>
                <Survey
                    questions={questions.slice(8)}
                    responses={responses}
                    updateResponses={updateResponses}
                    handleSurveySubmit={handleSurveySubmit}
                    warning={warning}
                    isSubmitting={isSubmitting}
                    progress={progress}
                    invalidQuestions={invalidQuestions}
                />

                {/* Debug: Show current responses */}
                <Text style={globalStyles.whiteText}>
                    {JSON.stringify(responses, null, 2)}
                </Text>

                <SubmitButton
                    onPress={() => {resetSurvey()}}
                    text={"Reset Survey"}
                    disabledText={"Resetting..."}
                    disabled={false}
                />
            </View>
        </StandardView>
    );
}

const styles = StyleSheet.create({
    inputsContainer: {
        gap: 10
    },
});
