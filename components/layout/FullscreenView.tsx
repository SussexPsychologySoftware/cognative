import {useEffect} from "react";
import {Stack} from "expo-router";
import * as NavigationBar from 'expo-navigation-bar';
import {Platform, StyleSheet, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {SafeAreaView} from "react-native-safe-area-context";

export default function FullscreenView({children, style} : {children?: any, style?: Record<string, string|number>}) {
    useEffect(() => {
        const hideNavBar = async () => {
            try {
                if (Platform.OS === 'android') {
                    // Set the navigation bar style
                    const invisibleBlack = '#00000000'
                    await NavigationBar.setBackgroundColorAsync(invisibleBlack);
                    await NavigationBar.setBorderColorAsync(invisibleBlack);
                    // await NavigationBar.setBehaviorAsync('overlay-swipe')
                    // await NavigationBar.setPositionAsync('absolute')
                    NavigationBar.setStyle('dark');
                    // Hide, everything above are just fallbacks
                    await NavigationBar.setVisibilityAsync("hidden");
                }
            } catch (error) {
                console.error(error);
            }
        };
        hideNavBar()

        return () => {
            if(Platform.OS === 'android') NavigationBar.setVisibilityAsync("visible").catch(console.error);
        };
    }, []);



    return(
        <SafeAreaView
            style={[styles.container, style]}
        >
            <StatusBar translucent hidden/>
            <Stack screenOptions={{
                // Just incase
                headerShown: false,
                headerStyle: { backgroundColor: 'black' },
                headerTintColor: 'black',
                contentStyle: { backgroundColor: 'black' }
            }}/>
            {children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        width: "100%",
        minWidth: "100%",
        minHeight: "100%",
        maxHeight: "100%",
        maxWidth: "100%",
    },
});

