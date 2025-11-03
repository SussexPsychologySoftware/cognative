import {HttpService} from "@/services/data/HttpService";

export class ConditionAssignment {

    static heapPermutations(arr: string[]): string[][] {
        // Generates all possible conditions
        const result: string[][] = [];

        const generate = (n: number, heapArr: string[]) => {
            if (n === 1) {
                result.push([...heapArr]);
                return;
            }

            for (let i = 0; i < n; i++) {
                generate(n - 1, heapArr);

                const j = n % 2 === 0 ? i : 0;
                [heapArr[j], heapArr[n - 1]] = [heapArr[n - 1], heapArr[j]];
            }
        };

        generate(arr.length, [...arr]);
        return result;
    }

    private static shuffle(arr: string[]): string[] {
        for (let i = arr.length -1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    private static getConditionFromNumber(conditions: string[], conditionNumber: number, repeatedMeasures: boolean) {
        let allConditions = repeatedMeasures ? this.heapPermutations(conditions) : conditions;
        return allConditions[conditionNumber]
    }

    private static getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    static async getCondition(conditions: string[], repeatedMeasures: boolean, experimentId?: string) {
        // NOTE: repeatedMeasures true selects a permutation of entire array, false selects one condition from array
        // const conditions = ['control','monaural','binaural']
        const conditionNumber = experimentId ?
            await HttpService.requestConditionFromDatapipe(experimentId) :
            this.getRandomInt(conditions.length)
        // TODO: await DataService.setData(saveKey??'condition', condition)
        return this.getConditionFromNumber(conditions, conditionNumber, repeatedMeasures)
    }
}
