import {StyleSheet, View, Text} from "react-native";
import {globalStyles} from "@/styles/appStyles";
import {RelativePathString, router} from "expo-router";
import SubmitButton from "@/components/inputs/SubmitButton";
import {TaskDisplayStatus} from "@/types/trackExperimentState";
import {experimentDefinition} from "@/config/experimentDefinition";

// TODO: add back in debounce
function Activity({ prompt, buttonText, pathname, disabled, completed, params }: {
    prompt?: string,
    buttonText: string,
    pathname: RelativePathString,
    disabled: boolean,
    completed?: boolean,
    params?: Record<string, any>
}){
    return (
        <View style={[
            styles.activity,
            completed && styles.completedActivity,
            disabled && !completed && styles.disabledActivity
        ]}>
            <View style={styles.activityContent}>
                <View style={styles.checkboxContainer}>
                    <View style={[
                        styles.checkbox,
                        completed && styles.checkboxCompleted
                    ]}>
                        {completed && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                </View>
                <View style={styles.textContainer}>
                    <Text style={[
                        globalStyles.standardText,
                        completed && styles.completedText,
                        disabled && !completed && styles.disabledText
                    ]}>
                        {prompt}
                    </Text>
                </View>
            </View>
            <SubmitButton
                disabled={disabled} // Disable button while routing
                text={buttonText}
                onPress={()=>{
                    router.push({pathname, params})
                }}
                style={styles.activityButton}
            />
        </View>
    );
}

export default function ToDoList({ taskStates, data }: { taskStates: TaskDisplayStatus[], data: Record<string, any> }) {

    return (
        <View style={styles.todoList}>
            {

                taskStates.length > 0 && taskStates.map(task => {
                    // Create params TODO: this feels messy and not maintainable
                    const params: Record<string, any> = { ...data }; // (includes day, condition)
                    if (data.day) {
                        // TODO: day is available from useExperiment so this feels a bit messy - maybe construct in provider.
                        params.responseKey = `${task.definition.id}_${data.day}`;
                    } else {
                        params.responseKey = task.definition.id
                    }
                    params.taskName = task.definition.name; // Pass the name for completion tracking
                    return (
                        <Activity
                            key={task.definition.id}
                            prompt={task.definition.prompt}
                            buttonText={`Complete ${task.definition.name}`}
                            pathname={task.definition.path_to_screen as RelativePathString}
                            params={params}
                            disabled={!task.isAllowed}
                            completed={task.completed}
                        />
                    )
                })
            }

        </View>
    )
}

const styles = StyleSheet.create({
    homeScreen: {
        flex: 1,
        paddingTop: 40,
        gap: 20
    },
    dayCounter: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 16,
        textAlign: 'center',
        marginTop: -10,
        marginBottom: 10,
    },

    // TO DO LIST
    todoList: {
        gap: 15,
    },
    activity: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    completedActivity: {
        backgroundColor: 'rgba(100, 100, 100, 0.7)',
        borderColor: 'rgba(100, 100, 100, 1)',
    },
    disabledActivity: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    activityContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkboxContainer: {
        marginRight: 12,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxCompleted: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    checkmark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textContainer: {
        flex: 1,
    },
    completedText: {
        opacity: 0.7,
        textDecorationLine: 'line-through',
    },
    disabledText: {
        opacity: 0.5,
    },
    activityButton: {
        alignSelf: 'stretch', // Stretch to full width
    },

    // Settings
    settingsSection: {
        alignItems: 'center',
        gap: 12,
        marginBottom: 40,
    },

    // Page list for debugging
    pageList: {
        gap: 5,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'grey',
    },
    debugTitle: {
        color: 'grey',
        fontSize: 14,
        marginBottom: 8,
    },
    debugLink: {
        color: 'grey',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
