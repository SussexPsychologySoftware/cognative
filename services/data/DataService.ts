import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataQueue } from './dataQueue';

export class DataService {
    static async setData(key: string, data: any) {
        // Direct setting of data, good for e.g. participantID
        let dataString = data
        if(typeof data === 'object') dataString = JSON.stringify(data)
        await AsyncStorage.setItem(key, dataString);
        return dataString;
    }

    private static prepDataString(str: string): any {
        try {
            const parsed = JSON.parse(str);
            if (parsed && typeof parsed === 'object') {
                return parsed;
            } else {
                return str
            }
        } catch {
            return str;
        }
    }

    static async getData(key: string) {
        const dataString = await AsyncStorage.getItem(key);
        return dataString ? this.prepDataString(dataString) : null;
    }

    static async saveData(data: Record<string, any>, name: string, datapipeId?: string, participantId?: string) {
        data.timestamp = new Date().toISOString();
        data.participantId = participantId;
        // Save local copy
        const dataString = await this.setData(name, data)

        // If datapipeId then send to server
        if (datapipeId) {
            const filename = participantId ? `${participantId}_${name}` : name
            try {
                await dataQueue.addToQueue(dataString, filename, datapipeId);
            } catch (error) {
                console.error('Error adding to queue: ', error);
            }
        }
    }

    static async deleteData(id: string) {
        await AsyncStorage.removeItem(id);
    }

    // Special method to tag with participantID - makes sure this is set
    static async setParticipantID(id: string) {
        const participantID = await AsyncStorage.getItem('participantID');
        if (participantID) throw new Error("Participant already exists");

        await AsyncStorage.setItem('participantID', id);
    }

    static async getParticipantID() {
        const participantID = await AsyncStorage.getItem('participantID');
        if (!participantID) throw new Error("Participant ID not found");
        return participantID;
    }
}
