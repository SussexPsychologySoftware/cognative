import {
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    StyleSheet, RefreshControl
} from 'react-native';
import { SafeAreaView} from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import {colours} from "@/styles/appStyles";

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
                style={[styles.keyboardAvoidingView, keyboardAvoidingViewStyle]}
            >
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
