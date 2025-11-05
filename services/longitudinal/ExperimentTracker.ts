import * as Notifications from "expo-notifications";
import {ExperimentDisplayState, ExperimentState, TaskDisplayStatus, NullableStringRecord} from "@/types/trackExperimentState";
import {DataService} from "@/services/data/DataService";
import {experimentDefinition} from "@/config/experimentDefinition";
import {TaskDefinition} from "@/types/experimentConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ============ State Management ============
// EXPERIMENT TRACKER - this saves and calculates states for display
// Experiment Context deals with reacty style setting and getting of live states whilst app is open
// TODO: some of this is a bit high level - maybe needs to be split into 'diary study'  and 'todo list' and 'experiment state' etc?
export class ExperimentTracker {
    private static readonly STORAGE_KEY = 'experimentState'; // Storage
    private static readonly TEST_MINUS_DAYS_FROM_START = 0; // NEEDS 2 to get 1 day diff?

    // ============ START EXPERIMENT ============

    private static createInitialState(participantId: string, firstCondition: string, repeatedMeasuresConditionOrder?: string[]): ExperimentState {
        const emptyTaskStates = Object.fromEntries(
            experimentDefinition.tasks.map((task, index)=> {
                return [task.id, null];
            })
        );

        const emptyNotificationTimes = Object.fromEntries(
            experimentDefinition.tasks
                .filter(task => task.notification)
                .map((task, index)=> {
                return [task.id, task.notification?.default_time ?? null];
            })
        );

        const baseState = {
            startDate: new Date().toISOString(),
            participantId,
            tasksLastCompletionDate: emptyTaskStates,
            notificationTimes: emptyNotificationTimes, // Note an empty object works fine here too actually.
        };

        if (repeatedMeasuresConditionOrder) {
            return {
                ...baseState,
                conditionType: 'repeated',
                repeatedMeasuresConditionOrder: repeatedMeasuresConditionOrder
            };

        } else {
            return {
                ...baseState,
                conditionType: 'independent',
                assignedCondition: firstCondition // Use 'firstCondition' as the one and only condition
            };
        }
    }

    static generateRandomID(length: number)  {
        let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
        let id = '';
        for (let i = 0; i < length; i++) {
            id += (characters[Math.floor(Math.random() * characters.length)]);
        }
        return id
    }

    static async startExperiment(firstCondition: string, repeatedMeasuresConditionOrder?: string[], participantId?: string): Promise<ExperimentState> {
        if(!participantId) participantId = this.generateRandomID(16)
        const initialState = this.createInitialState(participantId, firstCondition, repeatedMeasuresConditionOrder)
        await this.saveState(initialState);
        return initialState
    }

    // ============ STOP EXPERIMENT ============

     static async stopExperiment(): Promise<void> {
        // TODO: resetExperiment() also needed?
        // await DataService.deleteData(this.STORAGE_KEY)
         await AsyncStorage.clear() // risky - maybe use AsyncStorage.multiRemove() for multiple keys instead?
         await Notifications.cancelAllScheduledNotificationsAsync();
    }

    // ============ SET STATE ============

    private static async saveState(state: ExperimentState): Promise<void> {
        if (this.TEST_MINUS_DAYS_FROM_START > 0) {
            state.startDate = this.testAddDaysToDate(state.startDate, this.TEST_MINUS_DAYS_FROM_START);
        }
        await DataService.setData(this.STORAGE_KEY, state);
    }

    static async updateNotificationTimes(times: NullableStringRecord): Promise<ExperimentState | null> {
        const state = await this.getState();
        if (!state) return null;

        state.notificationTimes = times; // Overwrite with the new object

        await this.saveState(state); // Persist the change
        return state;
    }

    static async resetTasks(): Promise<ExperimentState | null> {
        const state = await this.getState();
        if (!state) return null;

        // Get the correct initial empty task state
        // Update the state
        state.tasksLastCompletionDate = Object.fromEntries(
            experimentDefinition.tasks.map((task) => [task.id, ''])
        );

        await this.saveState(state); // Persist the change
        return state;
    }

    // ============ GET STATE ============

    private static testAddDaysToDate(date: string, days: number){
        if(date === '') return ''
        const date_test = new Date(date);
        date_test.setDate(new Date(date_test).getDate() + days)
        return date_test.toISOString();
    }

    static async getState(): Promise<ExperimentState|null> {
        const state = await DataService.getData(this.STORAGE_KEY);
        if (!state) return null
        // add some functions
        return state;
    }

    // ============ TASK MANAGER ============

    // Need function to create daily tasks list
    // Separate function to refresh daily tasks list
    static getTaskDefinition(taskId: string): TaskDefinition | undefined {
        return experimentDefinition.tasks.find(t => t.id === taskId);
    }

    static filterPendingTasks(experimentDay: number, condition: string): TaskDefinition[] {
        return experimentDefinition.tasks.filter(task => {
            // Check day schedule
            const showOnDay = task.show_on_days.length === 0 || task.show_on_days.includes(experimentDay);
            // Check condition schedule
            const showForCondition = task.show_for_conditions.length === 0 || task.show_for_conditions.includes(condition);
            return showOnDay && showForCondition;
        });
    }

    static calculateTaskDisplayStatuses(visibleTasks: TaskDefinition[],
                                        taskCompletionDates: NullableStringRecord): TaskDisplayStatus[] {
        const displayStatuses: TaskDisplayStatus[] = [];
        let allPreviousRequiredTasksComplete = true;

        for (const taskDef of visibleTasks) {
            const taskCompletionDate = taskCompletionDates[taskDef.id];
            const taskCompleted = taskCompletionDate ? this.happenedToday(taskCompletionDate) : false;

            // Task is allowed if all previous required tasks are done
            displayStatuses.push({
                definition: taskDef, // Just pass the whole definition
                isAllowed: (allPreviousRequiredTasksComplete && !taskCompleted) || (taskCompleted && taskDef.allow_edit),
                completed: taskCompleted,
            });

            // Update for next iteration
            if (!taskCompleted) {
                allPreviousRequiredTasksComplete = false;
            }
        }

        return displayStatuses;
    }

     static updateCondition(state: ExperimentState, experimentDay: number) {
        let currentCondition: string;
        let currentConditionIndex: number = 0;
        const { conditions } = experimentDefinition;

        switch (state.conditionType) {
            case 'independent':
                currentCondition = state.assignedCondition;
                currentConditionIndex = 0;
                break;

            case 'repeated':
                if (!("increase_on_days" in conditions)) {
                    // This is a state/definition mismatch, a serious error
                    console.error("Experiment state is 'repeated', but definition is not!");
                    currentCondition = 'error_condition';
                    break; // Or throw
                }

                const { increase_on_days } = conditions;
                const { repeatedMeasuresConditionOrder } = state; // No '?' needed
                // Slightly too clever here - true for each element that matches condition, and length is then conditionIndex
                currentConditionIndex = increase_on_days.filter(day => experimentDay >= day).length;
                if (currentConditionIndex >= repeatedMeasuresConditionOrder.length) {
                    // TODO: note sticking with end of array allows for different lengths of conditions, but looping would be a different design type.
                    currentConditionIndex = repeatedMeasuresConditionOrder.length - 1;
                }
                currentCondition = repeatedMeasuresConditionOrder[currentConditionIndex];
                break;
        }

        return { currentCondition, currentConditionIndex };
    }

    static calculateDisplayState(state: ExperimentState): ExperimentDisplayState {
        const experimentDay = this.calculateDaysPassed(state.startDate);
        const {currentCondition, currentConditionIndex} = this.updateCondition(state, experimentDay);
        // Get tasks that should show today
        const visibleTasks = this.filterPendingTasks(experimentDay, currentCondition);
        // Calculate display status for each visible task
        const taskDisplayStatuses = this.calculateTaskDisplayStatuses(visibleTasks, state.tasksLastCompletionDate);

        return {
            participantId: state.participantId??'',
            experimentDay,
            currentCondition,
            currentConditionIndex,
            isExperimentComplete: this.hasExperimentEnded(state),
            allTasksCompleteToday: false,
            tasks: taskDisplayStatuses
        };
    }

    static hasExperimentEnded(state: ExperimentState): boolean {
        // TODO: calculate from state if all tasks completed for today and is last day...
        const experimentDay = this.calculateDaysPassed(state.startDate)
        return experimentDay>experimentDefinition.total_days
    }


    // ============ Task Completion Recording ============
    static async setTaskCompleted(taskId: string): Promise<void> {
        const state = await this.getState();
        if(!state) return
        state.tasksLastCompletionDate[taskId] = new Date().toISOString();
        await this.saveState(state);
    }

    static constructFilename(taskId: string, participantID: string, day?: number): string {
        // TODO: should this be somewhere else?
        let filename = `${participantID}_${taskId}`
        if (day !== null && day !== undefined) {
            // For longitudinal tasks
            return `${filename}_${day}`;
        }
        return filename;
    }

    // ============ Date Utilities ===========
    static calculateDaysPassed(eventDate: string): number {
        if (!eventDate) return -1; // -1 should be treated as incorrect - known as a 'sentinel value'
        const parsed = new Date(eventDate);
        const now = new Date();

        // Adjust both dates to previous day if before cutoff hour, then normalize to midnight
        [now, parsed].forEach(date => {
            if (date.getHours() < experimentDefinition.cutoff_hour) {
                date.setDate(date.getDate() - 1);
            }
            date.setHours(0, 0, 0, 0);
        });

        return Math.floor((now.getTime() - parsed.getTime()) / (1000 * 60 * 60 * 24));
    }

    static async getDaysSinceStart(): Promise<number|null> {
        const state = await this.getState();
        if(!state) return null
        return this.calculateDaysPassed(state.startDate);
    }

    static happenedToday(dateString: string): boolean {
        return this.calculateDaysPassed(dateString) === 0;
    }

}
