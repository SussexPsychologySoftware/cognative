import {View, StyleSheet, Text} from "react-native";
import SubmitButton from "@/components/inputs/SubmitButton";
import {StandardView} from "@/components/layout/StandardView";
import {globalStyles} from "@/styles/appStyles";
import {useSurvey} from "@/hooks/useSurvey";
import Survey from "@/components/survey/Survey";
import {RelativePathString, router, useLocalSearchParams} from 'expo-router';
import {useExperiment} from "@/context/ExperimentContext";
import {ExperimentTracker} from "@/services/longitudinal/ExperimentTracker";
import {SurveyTaskDefinition} from "@/types/experimentConfig";
import {useCallback, useEffect} from "react";

export default function SurveyScreen() { // Renamed component
    const { taskId } = useLocalSearchParams<{ taskId: string }>();
    const { submitTaskData, definition, displayState, state } = useExperiment();

    // Get task definition and questions dynamically
    const taskDefinition = definition.tasks.find(t => t.id === taskId);
    const questions = (taskDefinition && taskDefinition.type === 'survey')
        ? (taskDefinition as SurveyTaskDefinition).questions
        : undefined;
    const surveyTitle = taskDefinition?.name || "Survey"; // Get name for the title

    const surveyFilename = displayState
        ? ExperimentTracker.constructFilename(taskId, displayState.experimentDay, state?.participantId)
        : undefined;

    const onSubmit = useCallback(async (responses: object, surveyFilename?: string) => {
        if (taskId && surveyFilename) {
            await submitTaskData(taskId, responses, surveyFilename, taskDefinition?.datapipe_id, taskDefinition?.allow_edit);
            if(taskDefinition?.route_on_submit){
                router.replace(taskDefinition.route_on_submit as RelativePathString);
            } else if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/');
            }
        } else {
            console.error("Unable to save responses: ", {taskId, surveyFilename, taskDefinition});
        }
    }, [taskId, submitTaskData, taskDefinition]);

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


    // TODO: Figure out how to do an autoroute without Max Depth Error - might be ExperimentContext re-rendering...
    // Get task display state dynamically
    const taskDisplayState = displayState
        ? displayState.tasks.find(t => t.definition.id === taskId)
        : undefined;

    useEffect(() => {
        const autoSubmitOnFirstCompletion = async () => {
            if (!isSubmitting && !taskDisplayState?.completed && taskDefinition?.autosumbit_on_complete && progress === 100) {
                await handleSurveySubmit();
            }
        };

        // Call the async function
        void autoSubmitOnFirstCompletion();
    }, [isSubmitting, handleSurveySubmit, progress, taskDefinition?.autosumbit_on_complete, taskDisplayState?.completed])


    if (!questions) {
        return (
            <StandardView>
                <Text style={globalStyles.pageTitle}>Error</Text>
                <Text style={globalStyles.standardText}>Survey configuration could not be found for task ID: {taskId}</Text>
            </StandardView>
        );
    }

    // Handle loading state (especially for when restoring responses)
    if (isLoading) {
        return (
            <StandardView>
                <Text style={globalStyles.pageTitle}>Loading Survey...</Text>
            </StandardView>
        )
    }

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

                {/* Debug: Show current responses */}
                {/*<Text style={globalStyles.whiteText}>*/}
                {/*    {JSON.stringify(responses, null, 2)}*/}
                {/*</Text>*/}

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
