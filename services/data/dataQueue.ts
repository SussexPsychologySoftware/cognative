import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from "expo-network";
import {HttpService} from "@/services/data/HttpService";

const STORAGE_KEY = 'dataQueue';

interface QueueItem {
    data: string,
    name: string,
    datapipeId: string
}

class DataQueue {
    private processingPromise: Promise<string> | null = null;

    constructor() {
        this.processingPromise = null;
        this.initNetworkListener();
    }

    async getQueue(): Promise<QueueItem[]> {
        try {
            const dataString = await AsyncStorage.getItem(STORAGE_KEY);
            return dataString ? JSON.parse(dataString) : []
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    async hasQueue(): Promise<boolean> {
        try {
            const queue = await this.getQueue();
            return queue.length > 0;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async setQueue(queue: QueueItem[]): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    }

    async addToQueue(data: string, name: string, datapipeId: string): Promise<void> {
        const queueItem: QueueItem = {
            name,
            data,
            datapipeId
        };
        const queue: QueueItem[] = await this.getQueue();
        queue.push(queueItem);
        await this.setQueue(queue);
        // Try to process immediately - might be slight redundant but maybe might as well??
        void this.processQueue();
    }

    async processQueue(): Promise<string> {
        // If already processing, return the existing promise
        if (this.processingPromise) {
            return this.processingPromise;
        }

        // Start new processing
        this.processingPromise = this._processQueueInternal();

        try {
            return await this.processingPromise;
        } finally {
            this.processingPromise = null;
        }
    }

    private async _processQueueInternal(): Promise<string> {
        const networkAvailable = await HttpService.isConnectedToInternet()
        if (!networkAvailable) return 'No internet connection';

        try {
            const queue = await this.getQueue();
            if(queue.length === 0) return 'No items to sync';

            let responseMessage = 'All items successfully sent to server';
            for (let i = queue.length - 1; i >= 0; i--) {
                const item = queue[i];
                try {
                    console.log({item});
                    // const uniqueName = `${item.name}_${Date.now()}`; // Timestamp to ensure unique if wanted.
                    const response = await HttpService.sendToServer(item.data, item.name, item.datapipeId)
                    if (response.status === 409 || (response.json && response.json.error === 'OSF_FILE_EXISTS')) {
                        console.warn(`Skipping duplicate file: ${item.name}, response: ${JSON.stringify(response)}`);
                    } else if (!response.ok) {
                        responseMessage = `Send to server failed for ${item.name}\n${JSON.stringify(response)}`;
                        console.error(JSON.stringify(response))
                        break;
                    }
                    queue.splice(i, 1);
                } catch (e) {
                    responseMessage = `Send to server failed for ${item.name}\n${e}`;
                    break;
                }
            }

            await this.setQueue(queue);
            return responseMessage;
        } catch (error) {
            console.error('Error in queue processing:', error);
            return 'Error processing queue';
        }
    }

    initNetworkListener() {
        Network.addNetworkStateListener(({ isConnected, isInternetReachable }) => {
            if (isConnected && isInternetReachable) {
                // Network back online - process queue
                setTimeout(() => this.processQueue(), 1000);
            }
        })
    }
}

export const dataQueue = new DataQueue();
