import * as Network from "expo-network";

export class HttpService {
    static async sendToServer(data: string, filename: string, datapipeId: string) {
        try {
            const res = await fetch("https://pipe.jspsych.org/api/data/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json", // better than */*
                },
                body: JSON.stringify({
                    experimentID: datapipeId,
                    filename: `${filename}.json`,
                    data: data,
                }),
            });

            const text = await res.text(); // first, read raw
            try {
                const json = JSON.parse(text);
                return { ok: res.ok, status: res.status, json, res};
            } catch {
                return { ok: res.ok, status: res.status, text }; // fallback if HTML error
            }
        } catch (err) {
            console.error(`--- HTTP SERVICE FETCH FAILED ---`);
            console.error(`Filename: ${filename}, DatapipeID: ${datapipeId}`);

            // Log the full error object to see all properties
            // We use JSON.stringify with Object.getOwnPropertyNames to capture non-enumerable properties
            console.error('Full Error Object:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));

            // Also log the error stack if it exists
            if (err instanceof Error && err.stack) {
                console.error('Error Stack:', err.stack);
            }

            // Return a more detailed error object
            return {
                ok: false,
                status: 0,
                error: err instanceof Error ? err.message : String(err),
                // Include the full error for the queue to log
                fullError: err
            };
        }
    }

     static async isConnectedToInternet() {
        const networkState = await Network.getNetworkStateAsync();
        return networkState.isConnected === true && networkState.isInternetReachable === true
    }

}
