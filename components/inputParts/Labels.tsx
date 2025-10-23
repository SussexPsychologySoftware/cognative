import {FlexStyle, StyleSheet, Text, View} from "react-native";
import {globalStyles} from "@/styles/appStyles";
import Hypher from 'hypher';
import english from 'hyphenation.en-gb';

const h = new Hypher(english);

function hyphenate(text: string) {
    return text?.split(/(\s+)/).map(part =>
        part.trim() ? h.hyphenate(part).join('\u00AD') : part
    ).join('') ?? text;
}

export default function Labels({labels, prependEmptyMinWidth, oneWordPerLine, justifyContent}: { labels: string[], prependEmptyMinWidth?: number, oneWordPerLine?: boolean, justifyContent?: FlexStyle['justifyContent'] }) {
    return (
        <View style={[styles.container, justifyContent && {justifyContent: justifyContent}]}>
            {prependEmptyMinWidth && <Text style={[styles.labelContainer, {minWidth: prependEmptyMinWidth}]}></Text>}
            {labels.map((label, index) => (
                <View key={`labels-${label}`} style={styles.labelContainer}>
                    <Text
                        style={[globalStyles.whiteText, styles.labelText]}
                        key={`label-${label}`}
                        android_hyphenationFrequency='full'
                        allowFontScaling={true}
                        adjustsFontSizeToFit={true}
                        numberOfLines={oneWordPerLine ? label.split(' ').length : 0}
                    >
                        {hyphenate(label)}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        columnGap: 3,
        paddingVertical: 5,
    },
    labelContainer: {
        width: 70,
        textAlign: 'center',
        paddingVertical: 5,
        // flex: 1, // TODO: works for secondary but not primary?
    },
    labelText: {
        fontWeight: "500",
    }

});
