import { Stack } from "expo-router";
import {StatusBar} from "expo-status-bar";

export default function RootLayout() {
  return (
      <>
        <StatusBar style="light" />
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="surveyExample" options={{ title: 'Example Survey' }} />
        </Stack>
      </>
  )
}
