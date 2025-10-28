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

    private static async requestConditionFromDatapipe(experimentId: string): Promise<number> {
        try {
            const jsonResponse = await fetch("https://pipe.jspsych.org/api/condition/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                },
                body: JSON.stringify({
                    experimentID: experimentId,
                }),
            });
            if (!jsonResponse.ok) {
                throw new Error(`HTTP error! status: ${jsonResponse.status}`);
            }
            const json = await jsonResponse.json();
            if (json.condition === undefined || json.condition === null) {
                throw new Error('No condition received from server');
            }
            return Number(json.condition)
        } catch (e) {
            console.error(e);
            throw e;  // Re-throw to stop the setup process
        }
    }
    
    static async getCondition(conditions: string[], repeatedMeasures: boolean, experimentId?: string) {
        // NOTE: repeatedMeasures true selects a permutation of entire array, false selects one condition from array
        // const conditions = ['control','monaural','binaural']
        const conditionNumber = experimentId ? await this.requestConditionFromDatapipe(experimentId) : this.getRandomInt(conditions.length)
        // TODO: await DataService.setData(saveKey??'condition', condition)
        return this.getConditionFromNumber(conditions, conditionNumber, repeatedMeasures)
    }
}
