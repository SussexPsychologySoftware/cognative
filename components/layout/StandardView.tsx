import React from 'react';
import {
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    View, StyleSheet
} from 'react-native';
import {Edges, SafeAreaView} from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

export const StandardView = ({
                                  children,
                                  statusBarStyle = 'dark',
                                  keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height',
                                  headerShown = true,
                                  contentContainerStyle,
                                  safeAreaStyle,
                              }:
                              {
                                  children?: any,
                                  statusBarStyle?: 'light'|'dark',
                                  keyboardBehavior?: 'padding'|'height'|'position',
                                  contentContainerStyle?: object,
                                  style?: object,
                                  safeAreaStyle?: object,
                                  headerShown?: boolean,
                              }) => {

    return (
        <SafeAreaView
            style={[styles.outerContainer, safeAreaStyle]}
            // Deal with padding manually as component a little broken
            edges={headerShown ? ['left', 'right'] : ['top', 'left', 'right']}
        >
            <Stack.Screen
                options={{
                    headerShown: headerShown,
                }}
            />
            <StatusBar style={statusBarStyle}/>
            <KeyboardAvoidingView
                behavior={keyboardBehavior}
                style={styles.keyboardAvoidingView}
            >
            <ScrollView
                contentContainerStyle={[contentContainerStyle, styles.scrollViewContentContainer]}
                style={styles.scrollView}
                keyboardShouldPersistTaps="handled"
            >
                {children}
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        // flex: 1,
    },
    keyboardAvoidingView: {
        // flex: 1,
    },
    scrollViewContentContainer: {
        // Pad inner content so scroll bar is pushed to right name of screen
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    scrollView: {
    }
})
