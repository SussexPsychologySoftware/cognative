import { Stack, Slot } from "expo-router";
import {StatusBar} from "expo-status-bar";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {dataQueue} from "@/services/data/dataQueue";
import {useRestore} from "@/hooks/useRestore";
import React from "react";
import {ExperimentProvider} from "@/context/ExperimentContext";
import {AppGate} from "@/components/auth/AppGate";

export default function RootLayout() {
    // void dataQueue.processQueue(); // To process queue on app load
    //useRestore(); // Restore app to specific screen when opened

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ExperimentProvider>
                {/*Consider changing status bar*/}
                <StatusBar style="light" />
                <AppGate>
                    <Slot/>
                </AppGate>
            </ExperimentProvider>
        </GestureHandlerRootView>
  )
}
