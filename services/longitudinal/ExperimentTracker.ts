import {Alert} from "react-native";
import {RelativePathString, router} from "expo-router";
import * as Notifications from "expo-notifications";
import {ExperimentDisplayState, ExperimentState, TaskDisplayStatus} from "@/types/trackExperimentState";
import {DataService} from "@/services/data/DataService";
import {experimentDefinition} from "@/config/experimentDefinition";
import {TaskDefinition} from "@/types/experimentConfig";

// ============ State Management ============
// TODO: some of this is a bit high level - maybe needs to be split into 'diary study'  and 'todo list' and 'experiment state' etc?
export class ExperimentTracker {
    private static readonly STORAGE_KEY = 'experimentState'; // Storage
    private static readonly TEST_MINUS_DAYS_FROM_START = 0; // NEEDS 2 to get 1 day diff?

    // ============ START EXPERIMENT ============

    private static createInitialState(participantId: string, currentCondition: string): ExperimentState {
        const emptyTaskStates = Object.fromEntries(
            experimentDefinition.tasks.map((task, index)=> {
            return [task.name, ''];
        }))

        console.log(emptyTaskStates)

        return {
            startDate: new Date().toISOString(),
            participantId,
            currentCondition,
            tasksLastCompletionDate: emptyTaskStates
        };
    }

    static generateRandomID(length: number)  {
        let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
        let id = '';
        for (let i = 0; i < length; i++) {
            id += (characters[Math.floor(Math.random() * characters.length)]);
        }
        return id
    }

    static async startExperiment(condition: string, participantId?: string): Promise<ExperimentState> {
        if(!participantId) participantId = this.generateRandomID(16)
        const initialState = this.createInitialState(participantId, condition)
        await this.saveState(initialState);
        return initialState
    }

    // ============ STOP EXPERIMENT ============

     static async stopExperiment(): Promise<void> {
        // TODO: resetExperiment() also needed?
        await DataService.deleteData(this.STORAGE_KEY)
        await Notifications.cancelAllScheduledNotificationsAsync();
    }

    // ============ SET STATE ============

    private static async saveState(state: ExperimentState): Promise<void> {
        if (this.TEST_MINUS_DAYS_FROM_START > 0) {
            state.startDate = this.testAddDaysToDate(state.startDate, this.TEST_MINUS_DAYS_FROM_START);
        }
        await DataService.saveData(state, this.STORAGE_KEY, state.participantId);
    }

    static async resetDailyTasks(): Promise<void> {
        const state = await this.getState()
        if(!state) return
        // loop: if(task.type === 'repeating') state.dateOfX = ''
        await this.saveState(state)
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
    static getTaskDefinition(taskName: string): TaskDefinition | undefined {
        return experimentDefinition.tasks.find(t => t.name === taskName);
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
                                        taskCompletionDates: Record<string, string>): TaskDisplayStatus[] {
        const displayStatuses: TaskDisplayStatus[] = [];
        let allPreviousRequiredTasksComplete = true;

        for (const taskDef of visibleTasks) {
            const taskCompletionDate = taskCompletionDates[taskDef.name];
            const taskCompleted = this.happenedToday(taskCompletionDate);

            // Task is allowed if all previous required tasks are done
            displayStatuses.push({
                definition: taskDef, // Just pass the whole definition
                isAllowed: allPreviousRequiredTasksComplete,
                completed: taskCompleted,
            });

            // Update for next iteration
            if (!taskCompleted) {
                allPreviousRequiredTasksComplete = false;
            }
        }

        return displayStatuses;
    }

    static calculateDisplayState(state: ExperimentState): ExperimentDisplayState {
        const experimentDay = this.calculateDaysPassed(state.startDate);
        const currentCondition = state.currentCondition;
        // Get tasks that should show today
        const visibleTasks = this.filterPendingTasks(experimentDay, currentCondition);
        // Calculate display status for each visible task
        const taskDisplayStatuses = this.calculateTaskDisplayStatuses(visibleTasks, state.tasksLastCompletionDate);

        return {
            participantId: state.participantId??'',
            experimentDay,
            currentCondition,
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
    static async setTaskCompleted(task: string): Promise<void> {
        const state = await this.getState();
        if(!state) return
        state.tasksLastCompletionDate[task] = new Date().toISOString();
        await this.saveState(state);
    }

    static constructResponseKey(taskName: string, day: number | null | undefined): string {
        if (day !== null && day !== undefined) {
            // For longitudinal tasks
            return `${taskName}_${day}`;
        }
        // For one-off tasks (e.g., initial demographics survey)
        return taskName;
    }

    // ============ Date Utilities ===========
    static calculateDaysPassed(eventDate: string): number {
        if (!eventDate) return 0;
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

    private static happenedToday(dateString: string): boolean {
        return this.calculateDaysPassed(dateString) === 0;
    }

}
