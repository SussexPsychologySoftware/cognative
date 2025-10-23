import {StyleSheet, View, Text} from "react-native";
import {globalStyles} from "@/styles/appStyles";
import {Link, RelativePathString, router} from "expo-router";
import React, {useCallback} from "react";
import SubmitButton from "@/components/inputs/SubmitButton";
import {ExperimentDisplayState, ExperimentState, TaskDisplayStatus} from "@/types/trackExperimentState";

// TODO: add back in debounce
function Activity({ prompt, buttonText, route, disabled, completed }: {
    prompt?: string,
    buttonText: string,
    route: RelativePathString,
    disabled: boolean,
    completed?: boolean
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
                onPress={()=>{router.push(route)}}
                style={styles.activityButton}
            />
        </View>
    );
}

export default function ToDoList({ taskStates }: { taskStates: TaskDisplayStatus[]}){
    return (
        <View style={styles.todoList}>
            {
                taskStates.length > 0 && taskStates.map(task => (
                    <Activity
                        key={task.id}
                        prompt={task.prompt}
                        buttonText={`Complete ${task.name}`}
                        route={task.path_to_screen as RelativePathString}
                        disabled={!task.isAllowed}
                        completed={task.completed}
                    />
                ))
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
