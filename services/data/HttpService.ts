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
            console.error('Fetch failed:', err);
            return {
                ok: false,
                status: 0,
                error: err instanceof Error ? err.message : String(err)
            };
        }
    }

     static async isConnectedToInternet() {
        const networkState = await Network.getNetworkStateAsync();
        return networkState.isConnected === true && networkState.isInternetReachable === true
    }

}
