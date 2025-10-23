import { Stack } from "expo-router";
import {StatusBar} from "expo-status-bar";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {useRestore} from "@/hooks/useRestore";

export default function RootLayout() {
  return (
    //useRestore(); // Restore app to specific screen when opened

    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="surveyExample" options={{ title: 'Example Survey' }} />
        </Stack>
      </GestureHandlerRootView>
  )
}
