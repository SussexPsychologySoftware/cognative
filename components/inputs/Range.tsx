import {StyleSheet, View, Text} from "react-native";
import {globalStyles} from "@/styles/appStyles";
import Slider from "@react-native-community/slider";
import Labels from "@/components/inputParts/Labels";

export default function Range({ value, min, max, step, showValue, onChange, style, labels }: { value: number, min?: number, max?: number, step?: number, showValue?: boolean, onChange: (value: number) => void, style?: object, labels?: string[] }) {
    // Note value/markers broken for steps between 0-1, floating point issues
    // TODO: implement my own simple version

    return (
        <View style={styles.container}>
            {labels && <Labels
                labels={labels}
                spread={true}
                labelMaxWidth={100}
                oneWordPerLine={true}
            />}
            <Slider
                style={[styles.slider, style]}
                value={value}
                minimumValue={min??0}
                maximumValue={max??10}
                onValueChange={(val) => onChange(Math.round(val * 10) / 10)}
                // onSlidingComplete={onChange}
                step={step??0}
                tapToSeek={true}
                renderStepNumber={!!step}
            />
            { showValue &&
                <Text style={styles.valueDisplay}>
                    {value}
                </Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        gap: 10
    },
    slider: {
        width: '100%',
        height: 40
    },
    valueDisplay: {
    }
});
