// Note app.config.js is the same as app.json but loads it in javascript so can include logic
// used here due to bug in baseUrl param where if it's the same as the app name (case insensitive) the build crashes
// and want the app name to be the same as repo and GH Pages '/cognative' subdomain

const config = {
    expo: {
        name: "CogNative",
        slug: "cognative",
        scheme: "cognative",
        version: "1.0.0",
        icon: "./assets/images/icon.png",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            infoPlist: {
                UIBackgroundModes: ["audio"],
                UISupportedInterfaceOrientations: [
                    "UIInterfaceOrientationPortrait",
                    "UIInterfaceOrientationPortraitUpsideDown",
                    "UIInterfaceOrientationLandscapeLeft",
                    "UIInterfaceOrientationLandscapeRight",
                ],
                ITSAppUsesNonExemptEncryption: false,
            },
            bundleIdentifier: "com.maxlovell.cognative",
            backgroundColor: "#000000",
        },
        android: {
            userInterfaceStyle: "dark",
            backgroundColor: "#000000",
            adaptiveIcon: {
                backgroundColor: "#000000",
                foregroundImage: "./assets/images/android-icon-foreground.png",
                backgroundImage: "./assets/images/android-icon-background.png",
                monochromeImage: "./assets/images/android-icon-monochrome.png",
            },
            edgeToEdgeEnabled: true,
            softwareKeyboardLayoutMode: "pan",
            permissions: [
                "android.permission.WAKE_LOCK",
                "android.permission.MODIFY_AUDIO_SETTINGS",
                "android.permission.RECORD_AUDIO",
            ],
            package: "com.maxlovell.cognative",
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png",
        },
        plugins: [
            "expo-router",
            [
                "expo-screen-orientation",
                {
                    initialOrientation: "DEFAULT",
                },
            ],
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#000000",
                    userInterfaceStyle: "dark",
                    dark: {
                        backgroundColor: "#000000",
                    },
                },
            ],
            "expo-audio",
            "expo-secure-store",
            "expo-web-browser",
            "expo-asset",
            "expo-dev-client",
            ["./plugins/withRootBackground", "#000000"]
        ],
        experiments: {
            typedRoutes: true,
            reactCompiler: true,
            // baseUrl is added conditionally below
        },
        extra: {
            router: {},
            eas: {
                projectId: "cad52bbe-fe46-4866-bc69-005ad2b0780b",
            },
        },
        backgroundColor: "#000000",
        splash: {
            "backgroundColor": "#000000"
        }
    },
};

// This function checks the platform and modifies the config
export default () => {
    // Check if the build is for the web platform
    if (process.env.PLATFORM === "web") {
        // If it is web, add the baseUrl to experiments
        config.expo.experiments.baseUrl = "/cognative";
    }

    // Return the final config object
    return config;
};
