import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataQueue } from './dataQueue';

export class DataService {
    static async setData(key: string, data: any) {
        // Direct setting of data, good for e.g. participantID
        let dataString = data
        if(typeof data === 'object') dataString = JSON.stringify(data)
        else dataString = String(data)
        await AsyncStorage.setItem(key, dataString);
        return dataString;
    }

    private static prepDataString(str: string): any {
        try {
            const parsed = JSON.parse(str);
            if (parsed && typeof parsed === 'object') {
                return parsed;
            }
            return str
        } catch {
            return str;
        }
    }

    static async getData(key: string) {
        const dataString = await AsyncStorage.getItem(key);
        return dataString ? this.prepDataString(dataString) : null;
    }

    // TODO: change signature to make participant id required and earlier
    static async saveData(data: Record<string, any>, name: string, datapipeId?: string, sendAfter?: string) {
        // Note this function is intentionally dumb and doesn't know what a taskDef or displayState etc is, just strings and records.
        // TODO: add metadata object and just pass to data, add condition, day, participantID, taskId, etc to all data if required
        // TODO: participantID should be required here - perhaps a taskID should as well.
        data.timestamp = new Date().toISOString();
        // Save local copy
        const dataString = await this.setData(name, data)

        // If datapipeId then send to server
        if (datapipeId) {
            try {
                await dataQueue.addToQueue(dataString, name, datapipeId, sendAfter);
            } catch (error) {
                console.error('Error adding to queue: ', error);
            }
        }
    }

    static async deleteData(id: string) {
        await AsyncStorage.removeItem(id);
    }
}
