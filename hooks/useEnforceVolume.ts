import { useEffect, useState, useRef } from "react";
import { Alert, Platform } from "react-native";
import VolumeManager from "react-native-volume-manager"; // NOTE: doesn't work on expo go

export function useEnforceVolume(target: number = 0.5, tolerance: number = 0.05, enforceLowerBound: boolean = false) {
    const [warning, setWarning] = useState<string>("");
    const alertShownRef = useRef(false);

    useEffect(() => {
        if (!VolumeManager || !VolumeManager.addVolumeListener) {
            // NOTE: not available on later iOS, apple stopped letting apps control volume
            console.warn("VolumeManager not available");
            return;
        }

        const clampVolume = async (vol: number) => {
            // Only clamp on Android (iOS does not allow programmatic volume changes)
            if (Platform.OS === "android") {
                try {
                    await VolumeManager.setVolume(target, {
                        type: "music",
                        playSound: false,
                        showUI: false,
                    });
                } catch (err) {
                    console.warn("Failed to set volume:", err);
                }
            }
        };

        const checkVolume = (vol: number) => {
            const lowThreshold = target - tolerance;
            const highThreshold = target + tolerance;

            if ((enforceLowerBound && vol >= lowThreshold && vol <= highThreshold) || (!enforceLowerBound && vol <= highThreshold)) {
                setWarning("");
                alertShownRef.current = false;
                return;
            }

            if (!alertShownRef.current) {
                alertShownRef.current = true;
                if (enforceLowerBound && vol < lowThreshold) {
                    Alert.alert(
                        "Volume Too Low",
                        `Please raise your device volume to about ${Math.round(target * 100)}%.`
                    );
                    setWarning(`Please raise your device volume to about ${Math.round(target * 100)}%.`);
                } else if (vol > highThreshold) {
                    Alert.alert(
                        "Volume Too High",
                        `Please lower your device volume to about ${Math.round(target * 100)}%.`
                    );
                    setWarning(`Please lower your device volume to about ${Math.round(target * 100)}%.`);
                }
            }
        };

        const handleVolume = async (vol?: number) => {
            if (vol === undefined) {
                const { volume: currentVolume } = await VolumeManager.getVolume();
                vol = currentVolume;
            }
            if(vol !== undefined) {
                checkVolume(vol);
                await clampVolume(vol);
            }
        };

        // Initial check
        void handleVolume();

        const listener = VolumeManager.addVolumeListener(({ volume }: {volume: number}) => {
            void handleVolume(volume);
        });

        return () => {
            listener.remove();
        };
    }, [enforceLowerBound, target, tolerance]);

    return { warning };
}
