const {
    withAppDelegate,
    withMainActivity,
    createRunOncePlugin,
} = require("@expo/config-plugins");

// TODO: See more at: https://docs.expo.dev/config-plugins/introduction/

function withRootBackground(config, backgroundColor = "#000000") {
    // --- iOS ---
    config = withAppDelegate(config, (config) => {
        let contents = config.modResults.contents;
        const colorLine = `self.window.backgroundColor = [UIColor colorWithRed:${parseInt(backgroundColor.slice(1,3),16)/255.0} green:${parseInt(backgroundColor.slice(3,5),16)/255.0} blue:${parseInt(backgroundColor.slice(5,7),16)/255.0} alpha:1.0];`;

        if (!contents.includes("self.window.backgroundColor")) {
            contents = contents.replace(
                /didFinishLaunchingWithOptions:[\s\S]*?\{([\s\S]*?)return YES;/,
                (match, body) => `${match}\n  ${colorLine}\n  return YES;`
            );
            config.modResults.contents = contents;
        }
        return config;
    });

    // --- Android ---
    config = withMainActivity(config, (config) => {
        const colorHex = backgroundColor.replace("#", "");
        if (!config.modResults.contents.includes("setBackgroundColor")) {
            config.modResults.contents = config.modResults.contents.replace(
                /super\.onCreate\(savedInstanceState\);/,
                `super.onCreate(savedInstanceState);\n    getWindow().getDecorView().setBackgroundColor(0xFF${colorHex.toUpperCase()});`
            );
        }
        return config;
    });

    return config;
}

module.exports = createRunOncePlugin(
    withRootBackground,
    "withRootBackground",
    "1.0.0"
);
