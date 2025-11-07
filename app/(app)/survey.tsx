import {View, StyleSheet, Text} from "react-native";
import SubmitButton from "@/components/inputs/SubmitButton";
import {StandardView} from "@/components/layout/StandardView";
import {globalStyles} from "@/styles/appStyles";
import {useSurvey} from "@/hooks/useSurvey";
import Survey from "@/components/survey/Survey";
import {RelativePathString, router, useLocalSearchParams} from 'expo-router';
import {useExperiment} from "@/context/ExperimentContext";
import {SurveyTaskDefinition} from "@/types/experimentConfig";
import {useCallback, useEffect} from "react";
import ExperimentInfo from "@/components/debug/ExperimentInfo";
import {useProcessTaskDefinition} from "@/hooks/useProcessTaskDefinition";
import {experimentDefinition} from "@/config/experimentDefinition";

export default function SurveyScreen() {
    // This is a typical screen setup (view layer),
        // Separation of concerns: orchestrates getting data from useExperiment, passing to useSurvey, when to submit, what to do after
    const { taskId } = useLocalSearchParams<{ taskId: string }>();
    // TODO: (small) concern user could be on task when day ticks over and survey will be recorded for that next day...
    //    FIX: pipe experimentDay as local search param, send to submitTaskData -> getTaskFilename
    const { submitTaskData, displayState, getTaskFilename } = useExperiment();

    // LOAD TASK AND SURVEY INFO -------
    // Note to avoid useProcessTaskDefinition load directly with:
        // const taskDefinition = definition.tasks.find(t => t.id === taskId);
    const {taskDefinition, isProcessingTask, taskProcessingError} = useProcessTaskDefinition(taskId);
    const questions = (taskDefinition && taskDefinition.type === 'survey')
        ? (taskDefinition as SurveyTaskDefinition).questions
        : undefined;
    const surveyTitle = taskDefinition?.name || "Survey";
    // Display state used for submission
    const taskDisplayState = displayState
        ? displayState.tasks.find(t => t.definition.id === taskId)
        : undefined;

    // SUBMISSION -------
    const surveyFilename = getTaskFilename(taskId);
    const onSubmit = useCallback(async (responses: object) => {
        if (taskDefinition) {
            await submitTaskData(taskDefinition, responses);
        } else {
            console.error("Unable to save responses: ", {taskDefinition});
        }
    }, [submitTaskData, taskDefinition]);

    const {
        responses,
        updateResponses,
        handleSurveySubmit,
        warning,
        isSubmitting,
        progress,
        resetSurvey,
        invalidQuestions,
        isLoading // Get the loading state from the hook
    } = useSurvey(questions, onSubmit, surveyFilename);

    useEffect(() => {
        const autoSubmitOnFirstCompletion = async () => {
            if (!isSubmitting && !taskDisplayState?.completed && taskDefinition?.autosumbit_on_complete && progress === 100) {
                await handleSurveySubmit();
            }
        };

        // Call the async function
        void autoSubmitOnFirstCompletion();
    }, [isSubmitting, handleSurveySubmit, progress, taskDefinition?.autosumbit_on_complete, taskDisplayState?.completed])

    // RENDER INCORRECT DATA STATES -------
    if (!questions || taskProcessingError) {
        return (
            <StandardView>
                <Text style={globalStyles.pageTitle}>Error</Text>
                <Text style={globalStyles.standardText}>Survey configuration could not be found for task ID: {taskId}</Text>
            </StandardView>
        );
    }

    // Handle loading state (especially for when restoring responses)
    if (isLoading || isProcessingTask) {
        return (
            <StandardView>
                <Text style={globalStyles.pageTitle}>Loading Survey...</Text>
            </StandardView>
        )
    }

    // RENDER COMPONENT -------
    return (
        <StandardView
            headerShown={true}
            statusBarStyle={'dark'}
        >
            <Text style={[globalStyles.pageTitle, {marginVertical: 30}]}>
                {surveyTitle}
            </Text>
            <View style={styles.inputsContainer}>
                {/* TODO: add a 'group' or 'page' property to SurveyQuestion type and render the survey in sections dynamically.*/}
                {/*<Text style={globalStyles.sectionTitle}>Please fill out the following survey</Text>*/}
                <Survey
                    questions={questions}
                    responses={responses}
                    updateResponses={updateResponses}
                    handleSurveySubmit={handleSurveySubmit}
                    warning={warning}
                    isSubmitting={isSubmitting}
                    // progress={progress}
                    invalidQuestions={invalidQuestions}
                />

                <SubmitButton
                    onPress={() => {resetSurvey()}}
                    text={"Reset Survey"}
                    disabledText={"Resetting..."}
                    disabled={false}
                />

                { experimentDefinition.debug &&
                    <ExperimentInfo
                        object={responses}
                        objectTitle={'Survey Responses'}
                        showExperimentDefinition={false}
                        showExperimentState={false}
                        showDisplayState={false}
                        showQueue={false}
                    />
                }
            </View>
        </StandardView>
    );
}

const styles = StyleSheet.create({
    inputsContainer: {
        gap: 10
    },
});
