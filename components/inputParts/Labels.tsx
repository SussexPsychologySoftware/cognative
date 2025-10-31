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
// TODO: not sure this was worth the pain of abstraction tbh... just make it spread labels and put the other stuff in the actual components
export default function Labels({labels, prependEmptyMinWidth, oneWordPerLine, spread, labelMaxWidth}: { labels: string[], prependEmptyMinWidth?: number, oneWordPerLine?: boolean, spread?: boolean, labelMaxWidth?: DimensionValue }) {
    return (
        <View style={[
            styles.container,
            spread && styles.spreadContainer
        ]}>
            {prependEmptyMinWidth && <Text style={[
                styles.labelContainer,
                {minWidth: prependEmptyMinWidth}
            ]}></Text>}
            {labels.map((label, index) => (
                <View
                    key={`label-container-${label}-${index}`}
                    style={[
                        styles.labelContainer,
                        // spread && {maxWidth: `${100/labels.length}%`},
                        spread && styles.spreadLabelContainer,
                        spread && index===0 && {alignItems:'flex-start'},
                        spread && index===labels.length-1 && {alignItems:'flex-end'},
                        {maxWidth: labelMaxWidth},
                    ]}
                >
                    <Text
                        style={[
                            globalStyles.whiteText,
                            styles.labelText,
                            spread && styles.spreadText,
                            index===0 && spread && {textAlign:'left'},
                            index===labels.length-1 && spread && {textAlign:'right'},
                        ]}
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
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'row',
        gap: 5,
    },
    labelContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    labelText: {
        textAlign: 'center',
        fontWeight: "500",
    },
    // Spread mode
    spreadContainer: {
        justifyContent: 'space-between',
        gap: 15,
        paddingBottom: 5,
    },
    spreadLabelContainer: {
        justifyContent: 'flex-start',
        // borderWidth: 1,
        borderColor: 'white'
    },
    spreadText: {
        fontWeight: "300",
        fontSize: 13,
    }
});
