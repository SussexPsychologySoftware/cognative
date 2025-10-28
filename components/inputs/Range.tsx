import {StyleSheet, View, Text} from "react-native";
import {globalStyles} from "@/styles/appStyles";
import Slider from "@react-native-community/slider";
import Labels from "@/components/inputParts/Labels";

export default function Range({ value, min, max, step, showValue=true, onChange, style, labels }: { value: number, min?: number, max?: number, step?: number, showValue?: boolean, onChange: (value: number) => void, style?: object, labels?: string[] }) {
    // Note value/markers broken for steps between 0-1, floating point issues
    // TODO: implement my own simple version
    const trimNumber = (number: number) => {
        // return Math.round((val * 10) / 10)
        return Number(number.toPrecision(step?.toString().length));
    }
    return (
        <View style={styles.container}>
            {labels && <Labels
                labels={labels}
                spread={true}
                labelMaxWidth={100}
                oneWordPerLine={true}
            />}
            { showValue &&
                <Text style={[styles.valueDisplay, globalStyles.standardText]}>
                    {value}
                </Text>
            }
            <Slider
                style={[styles.slider, style, globalStyles.standardText]}
                value={value}
                minimumValue={min??0}
                maximumValue={max??10}
                onValueChange={(val) => onChange(trimNumber(val))}
                // onSlidingComplete={onChange}
                StepMarker={step ? (marker)=> (
                    <Text style={styles.customStepMarker}>
                        {Number(marker.index.toPrecision(step?.toString().length))}
                    </Text>
                ) : undefined}
                // StepMarker={ (step && step<1) ?
                //     (marker)=> {
                //         return (
                //             marker.stepMarked ?
                //                 <Text style={[styles.customStepMarker, styles.currentStepMarker]}>
                //                     {trimNumber(marker.currentValue)}
                //                 </Text>
                //                 : <Text style={styles.customStepMarker}>
                //                     {trimNumber(marker.index)}
                //                 </Text>
                //         )
                //     }
                //     : undefined
                // }
                step={step??0}
                tapToSeek={true}
                renderStepNumber={false} //(!!step) && step>1
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // justifyContent: "center",
        alignItems: "center",
        // gap: 10
    },
    slider: {
        width: '100%',
        height: 40
    },
    valueDisplay: {
        marginVertical: 5
    },
    customStepMarker: {
        color: "white",
        marginTop: 30,
        fontSize: 10,
    },
    currentStepMarker: {
        // backgroundColor: "red",
        fontWeight: "bold",
    }
});
