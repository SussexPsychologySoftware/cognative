import {useEffect} from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import {OrientationLock} from "expo-screen-orientation";


export function useLockOrientation(orientation?: OrientationLock) {
    useEffect(() => {
        const lockOrientation = async () => {
            await ScreenOrientation.lockAsync(orientation ?? ScreenOrientation.OrientationLock.LANDSCAPE);
        };
        void lockOrientation();

        return () => {
            ScreenOrientation.unlockAsync().catch(console.error);
        };
    }, [orientation]);
}
