import {StyleSheet, View, Text} from "react-native";
import {globalStyles} from "@/styles/appStyles";
import {RelativePathString, router} from "expo-router";
import SubmitButton from "@/components/inputs/SubmitButton";
import {TaskDisplayStatus} from "@/types/trackExperimentState";

// TODO: add back in debounce
function Activity({ task, params }: { task: TaskDisplayStatus, params: Record<string, any> }){
    // console.log({task, params});
    return (
        <View style={[
            styles.activity,
            task.completed && styles.completedActivity,
            // TODO: (!task.isAllowed && task.completed) seems like isAllowed should handle this itself?
            !task.isAllowed && styles.disabledActivity
        ]}>
            <View style={styles.activityContent}>
                <View style={styles.checkboxContainer}>
                    <View style={[
                        styles.checkbox,
                        task.completed && styles.checkboxCompleted
                    ]}>
                        {task.completed && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                </View>
                <View style={styles.textContainer}>
                    <Text style={[
                        globalStyles.standardText,
                        task.completed && styles.completedText,
                        !task.isAllowed && styles.disabledText
                    ]}>
                        {task.definition.prompt}
                    </Text>
                </View>
            </View>
            <SubmitButton
                disabled={!task.isAllowed}
                text={(task.completed && task.definition.allow_edit) ? `Edit ${task.definition.name} responses` : `Complete ${task.definition.name}`} // TODO: better button naming
                // TODO: add disabled text?
                onPress={()=>{
                    let pathname;
                    switch (task.definition.type) {
                        case "screen":
                            pathname = task.definition.path_to_screen
                            break;
                        default:
                            pathname = '/'+task.definition.type
                    }
                    router.push({
                        pathname: pathname as RelativePathString,
                        params
                    })
                }}
                style={styles.activityButton}
                cooldown={500}
            />
        </View>
    );
}

export default function ToDoList({ taskStates, data }: { taskStates: TaskDisplayStatus[], data?: Record<string, any> }) {

    return (
        <View style={styles.todoList}>
            {
                taskStates.length > 0 ? taskStates.map(task => {
                    // TODO: consider passing in all data to all children, and task definition entirely?
                    // const params: Record<string, any> = { ...data }; // (includes day, condition)
                    // params = task.definition; // Pass the name for completion tracking
                    const params = {
                        taskId: task.definition.id, // Pass the name for completion tracking
                        // data // Optionally pass in other data here
                    }
                    return (
                        <Activity
                            key={task.definition.id}
                            task={task}
                            params={params}
                        />
                    )
                }) :
                <Text style={[globalStyles.sectionTitle]}>
                    There are no activities to complete for today, please return tomorrow.
                </Text>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    // TO DO LIST
    todoList: {
        marginVertical: 30,
        gap: 15,
    },
    activity: {
        // backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
        borderRadius: 24/2,
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
});
