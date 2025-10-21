import {Alert} from "react-native";
import {router} from "expo-router";
import * as Notifications from "expo-notifications";
import {ExperimentState} from "@/types/DiaryTasks";
import {DataService} from "@/services/data/DataService";


// TODO: NOTE UNFINISHED PSEUDOCODE FOR ENTIRE SCRIPT

// TODO: some of this is a bit high level - maybe needs to be split into 'diary study'  and 'todo list' and 'experiment state' etc?
const experimentDefinition = {
    total_days: 14, //
    cutoff_hour: 4,
    blocks: {
        names: [],
        baseline_length: 2, //days
        n_days_per_block: 3, // nullable
    },
    // end_when: (context: object) => {
    //     const { day, condition, block, dayInBlock } = context;
    //     return day > 2 && condition !== 'baseline' && dayInBlock < 3;
    // },, // function??
    tasks: [
        {
            name: 'morningDiary',
            path_to_screen: '/morningDiary',
            show_on_days: [1,2,3],
            show_for_conditions: ['control'], //independent conditions
            // optional fields
            // showWhen: (context: object) => {
            //     const { day, condition, block, dayInBlock } = context;
            //     return day > 2 && condition !== 'baseline' && dayInBlock < 3;
            // },
            // required: true,
            // availableFrom: '06:00',
            // availableTo: '12:00',
            // deadlineWarning: '11:30',
            // reminder: true,
        }
    ]
}

export class ExperimentTracker {
    private static readonly STORAGE_KEY = 'experimentState'; // Storage
    private static readonly TEST_MINUS_DAYS_FROM_START = 0; // NEEDS 2 to get 1 day diff?

    // ============ State Management ============
    private static createInitialState() {
        const emptyTaskStates = Object.fromEntries(
            experimentDefinition.tasks.map((task, index)=> {
            return [task.name, ''];
        }))

        console.log(emptyTaskStates)

        return {
            startDate: new Date().toISOString(),
            taskCompletion: emptyTaskStates
        };
    }

    static async startExperiment(): Promise<void> {
        const initialState = this.createInitialState()
        await this.saveState(initialState);
    }


    private static async stopExperiment(): Promise<void> {
        // TODO: resetExperiment() also needed?
        await DataService.deleteData(this.STORAGE_KEY)
        await Notifications.cancelAllScheduledNotificationsAsync();
    }

    static async stopExperimentConfirmation(): Promise<void> {
        Alert.alert(
            'WARNING',
            "Experiment progress will be reset",
            [
                {
                    text: 'Reset experiment',
                    onPress: async () => {
                        await this.stopExperiment()
                        router.push('/'); // Change this to 'end' or something...
                    },
                    style: "default"
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            {
                cancelable: true,
            },
        );
    }

    private static testAddDaysToDate(date: string, days: number){
        if(date === '') return ''
        const date_test = new Date(date);
        date_test.setDate(new Date(date_test).getDate() + days)
        return date_test.toISOString();
    }

    static async getState(): Promise<Record<string, string>|null> {
        const state = await DataService.getData(this.STORAGE_KEY);
        if (!state) return null

        // For testing, minus days from TODAY, not actual start date
        if (this.TEST_MINUS_DAYS_FROM_START > 0) {
            state.startDate = this.testAddDaysToDate(new Date().toISOString(), -this.TEST_MINUS_DAYS_FROM_START);
        }

        // add some functions
        return state;
    }

    private static async saveState(state: object): Promise<void> {
        if (this.TEST_MINUS_DAYS_FROM_START > 0) {
            state.startDate = this.testAddDaysToDate(state.startDate, this.TEST_MINUS_DAYS_FROM_START);
        }
        await DataService.saveData(state, this.STORAGE_KEY);
    }

    static async resetDailyTasks(): Promise<void> {
        const state = await this.getState()
        if(!state) return
        // loop: if(task.type === 'repeating') state.dateOfX = ''
        await this.saveState(state)
    }


    // ============ Task Completion Recording ============
    static async setTaskCompleted(task: string): Promise<void> {
        const state = await this.getState();
        if(!state) return
        state.tasks[task].dateLastCompleted = new Date();
        state.tasks[task].completed = true;
        await this.saveState(state);
    }

    // ============ COMPLETION STATUS WRAPPER ============
    private static calculateTasksState(state: object): DailyTasksState {
        const experimentDay = this.calculateDaysPassed(state.startDate)
        const condition = state.condition
        const tasksToDo = []
        const tasks = experimentDefinition.tasks
        let previousTaskCompleted = true
        for(let i=tasks.length-1; i >= 0; i--) {
            if(!tasks[i].show_on_days.includes(experimentDay)) continue
            if(tasks[i].show_for_conditions.length !== 0 && !tasks[i].show_for_conditions.includes(condition)) continue
            const taskCompletedToday = this.happenedToday(state.tasks[task.name]['dateLastCompleted'])
            const taskState = {
                completed: !taskCompletedToday,
                allow: previousTaskCompleted, // Allow task to be taken (basically, not disabled) if previous task completed
            }
            tasksToDo.push(taskState)
            previousTaskCompleted = taskCompletedToday
        }
        return tasksToDo
    }

    static hasExperimentEnded(experimentState: ExperimentState): boolean {
        // TODO: calculate from state if all tasks completed for today and is last day...
        const experimentDay = this.calculateDaysPassed(state.startDate),
        return experimentDay>experimentDefinition.total_days
    }

    static async calculateExperimentState() {
        const state = await this.getState();
        if(!state) return null
        return {
            taskStates: this.calculateTasksState(state),
            experimentDay: this.calculateDaysPassed(state.startDate),
            isExperimentComplete: this.hasExperimentEnded(state),
        };
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

    private static  calculateDaysIntoCurrentBlock(elapsedDays: number) {
        // note 0 based so first day of block is '0'
        return elapsedDays < experimentDefinition.blocks.baseline_length ? elapsedDays :
            (elapsedDays - experimentDefinition.blocks.baseline_length) % experimentDefinition.blocks.n_days_per_block
        // baseline: [0,1], condition_1: [2,3,4,5], condition_2: [6,7,8,9], condition_3: [10,11,12,13]
    }

    private static async calculateCurrentCondition(startDate: string): Promise<string|null> {
        // Check participantInfo and .conditionOrder exist first
        const participantInfo = await DataService.getData('condition_order')
        if (!participantInfo?.conditionOrder || !Array.isArray(participantInfo.conditionOrder)) {
            return null;
        }

        const elapsedDays = this.calculateDaysPassed(startDate)
        // Get block
        const blockLength = 4 //days
        const baselineLength = 2 //days
        const blockNumber = Math.floor((elapsedDays - baselineLength) / blockLength) + 1
        // Add baseline here for now - should probably just store it with that in future
        const conditionsWithBaseline = ['baseline', ...participantInfo.conditionOrder];
        // TODO: how to handle last day of intervention? ------
        if (blockNumber >= conditionsWithBaseline.length) { // check block number can index condition order
            console.warn(`Block index ${blockNumber} exceeds available conditions, days passed: ${elapsedDays}`);
            return null;
        }
        return conditionsWithBaseline[blockNumber]
    }

    static async getCondition() {
        const state = await this.getState()
        if(!state) return
        const startDate = state.startDate
        return this.calculateCurrentCondition(startDate)
    }

}
