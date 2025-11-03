import {
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    StyleSheet, RefreshControl
} from 'react-native';
import { SafeAreaView} from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import {router, Stack} from 'expo-router';
import {colours} from "@/styles/appStyles";
import {Ionicons} from "@expo/vector-icons";
import Debug from "@/components/debug/Debug";
import React from "react";
import {experimentDefinition} from "@/config/experimentDefinition";

export const StandardView = ({
                                 children,
                                 statusBarStyle = 'dark',
                                 keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height',
                                 headerShown = true,
                                 safeAreaStyle,
                                 keyboardAvoidingViewStyle,
                                 contentContainerStyle,
                                 scrollViewStyle,
                                 refreshState,
                                 refreshing,
                                 debug
                              }:
                              {
                                  children?: any,
                                  statusBarStyle?: 'light'|'dark',
                                  keyboardBehavior?: 'padding'|'height'|'position',
                                  headerShown?: boolean,
                                  safeAreaStyle?: object,
                                  keyboardAvoidingViewStyle?: object,
                                  contentContainerStyle?: object,
                                  scrollViewStyle?: object,
                                  refreshState?: () => Promise<void>,
                                  refreshing?: boolean,
                                  debug?: boolean
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
                    // headerLeft: () => (
                    //     <Ionicons
                    //         name={Platform.OS === "ios" ? "chevron-back" : "arrow-back-sharp"}
                    //         size={25}
                    //         color="white"
                    //         onPress={() => router.replace('/')}
                    //     />
                    // ),
                }}
            />
            <StatusBar style={statusBarStyle}/>
            <KeyboardAvoidingView
                behavior={keyboardBehavior}
                style={[styles.keyboardAvoidingView, keyboardAvoidingViewStyle]}
            >
                {/*<TouchableWithoutFeedback onPress={Keyboard.dismiss}>*/}
                <ScrollView
                    contentContainerStyle={[styles.scrollViewContentContainer, contentContainerStyle]}
                    style={[styles.scrollView, scrollViewStyle]}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={refreshState &&
                        <RefreshControl
                            refreshing={refreshing??false}
                            onRefresh={refreshState}
                            tintColor="#fff" // For iOS
                            colors={['#fff']} // For Android
                        />
                    }
                >
                    {children}
                    {experimentDefinition.debug && debug !== false && <Debug/> }
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        // flex: 1,
        backgroundColor: colours.background,
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
        minHeight: '100%', //or flexGrow: 1?
        maxWidth: '100%',
    }
})
