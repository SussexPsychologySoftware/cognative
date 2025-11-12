import {Slot} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {dataQueue} from "@/services/data/dataQueue";
import {ExperimentProvider} from "@/context/ExperimentContext";
import {AppGate} from "@/components/auth/AppGate";
import {NotificationHandler} from "@/components/auth/NotificationHandler";
import {useEffect} from "react";
import {ExperimentTracker} from "@/services/longitudinal/ExperimentTracker";
// import {useRestore} from "@/hooks/useRestore";

export default function RootLayout() {

    // Turn sending data on or off, this pattern avoids require cycle between dataQueue and experiment tracker
    useEffect(() => {
        // "Inject" the state-checking function into the dataQueue singleton
        dataQueue.setSendDataStateGetter(ExperimentTracker.getSendDataState);
    }, []);
    void dataQueue.processQueue(); // To process queue on app load
    //useRestore(); // Restore app to specific screen when opened

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ExperimentProvider>
                {/*Consider changing status bar*/}
                <StatusBar style="light" />
                <AppGate>
                    <NotificationHandler />
                    <Slot/>
                </AppGate>
            </ExperimentProvider>
        </GestureHandlerRootView>
  )
}
