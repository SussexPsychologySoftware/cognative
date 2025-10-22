import React from 'react';
import {
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    View
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

export const ScreenWrapper = ({
                                  children,
                                  scrollable = true,
                                  statusBarStyle = 'dark',
                                  keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height',
                                  contentContainerStyle,
                                  style,
                                  safeAreaStyle,
                                  headerShown
                              }:
                              {
                                  children?: any,
                                  scrollable?: boolean,
                                  statusBarStyle?: 'light'|'dark',
                                  keyboardBehavior?: 'padding'|'height'|'position',
                                  contentContainerStyle?: object,
                                  style?: object,
                                  safeAreaStyle?: object,
                                  headerShown?: boolean,
                              }) => {

    const content = scrollable ? (
        <ScrollView
            contentContainerStyle={contentContainerStyle}
            keyboardShouldPersistTaps="handled"
        >
            {children}
        </ScrollView>
    ) : (
        <View style={[{ flex: 1 }, style]}>
            {children}
        </View>
    );

    return (
        <SafeAreaView style={[{ flex: 1 }, safeAreaStyle]}>
            <Stack.Screen
                options={{
                    headerShown: headerShown,
                    // headerStyle: { backgroundColor: '#f4511e' },
                    // headerTintColor: '#fff',
                    // headerTitleStyle: {
                    //     fontWeight: 'bold',
                    // },
            }} />
            <KeyboardAvoidingView
                behavior={keyboardBehavior}
                style={{ flex: 1 }}
            >
                <StatusBar style={statusBarStyle}/>
                {content}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
