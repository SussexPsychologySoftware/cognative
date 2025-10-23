import {DimensionValue, StyleSheet, Text, View} from "react-native";
import {globalStyles} from "@/styles/appStyles";
import Hypher from 'hypher';
import english from 'hyphenation.en-gb';

const h = new Hypher(english);

function hyphenate(text: string) {
    return text?.split(/(\s+)/).map(part =>
        part.trim() ? h.hyphenate(part).join('\u00AD') : part
    ).join('') ?? text;
}

// TODO: consider hyphenated text component as well
export default function Labels({labels, prependEmptyMinWidth, oneWordPerLine, spread, labelMaxWidth}: { labels: string[], prependEmptyMinWidth?: number, oneWordPerLine?: boolean, spread?: boolean, labelMaxWidth?: DimensionValue }) {
    return (
        <View style={[styles.container, spread && {justifyContent: 'space-between'}]}>
            {prependEmptyMinWidth && <Text style={[styles.labelContainer, {minWidth: prependEmptyMinWidth}]}></Text>}
            {labels.map((label, index) => (
                <View
                    key={`label-container-${label}-${index}`}
                    style={[
                        styles.labelContainer,
                        spread && {maxWidth: `${100/labels.length}%`, flex: 0},
                    ]}
                >
                    <Text
                        style={[globalStyles.whiteText, styles.labelText, {maxWidth: labelMaxWidth}]}
                        key={`label-text-${label}`}
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
        width: '100%',
        maxWidth: "100%",
        alignItems: 'flex-end',
        flexDirection: 'row',
        gap: 5,
    },
    labelContainer: {
        paddingVertical: 5,
        flex: 1,
        alignItems: 'center',
        // borderWidth: 1,
    },
    labelText: {
        textAlign: 'center',
        fontWeight: "500",
        // borderWidth: 1,
    }

});
