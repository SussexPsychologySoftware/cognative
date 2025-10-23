import {View, Pressable, Text, StyleSheet, DimensionValue} from 'react-native';
import { globalStyles } from "@/styles/appStyles";
import Radio from "@/components/inputParts/Radio";
import Labels from "@/components/inputParts/Labels";

function RadioButton({ selected, onChange, size } : { selected: boolean, onChange: () => void, size?: DimensionValue }) {
    return (
        <Pressable style={styles.radioButton} onPress={onChange}>
            <Radio
                selected={selected}
                size={size}
            />
        </Pressable>
    );
}

export function RadioRow(
    {
        value,
        options,
        onChange,
    }: {
        value: string,
        options: string[],
        onChange: (answer: string) => void,
    }) {
    const minSize = 10;
    const maxSize = 40;
    const baseSize = 300 / options.length; // adjust to tune the curve
    const size = Math.max(minSize, Math.min(maxSize, baseSize));
    return (
        <View style={styles.radioRow}>
            {
                options.map((option, index) => (
                    <RadioButton
                        key={`radio-${option}`}
                        selected={value===option}
                        onChange={() => onChange(option)}
                        size={size} //options.length > 8 ? 20 : 30
                    />
                ))
            }
        </View>
    );
}

export default function LikertSingle(
    {
        value,
        options,
        labels,
        onChange,
        oneWordPerLine
    }:
    {
        value: string,
        options: string[],
        labels?: string[], // Secondary labels
        onChange: (answer: string) => void,
        oneWordPerLine?: boolean,
    }) {
    return (
        <View style={styles.container}>
            {
                labels &&
                <Labels
                    labels={labels}
                    oneWordPerLine={oneWordPerLine}
                    spread={true}
                    // labelMaxWidth={70}
                />
            }
            <View style={{paddingHorizontal: labels ? '5%' : null}}>
                <Labels
                    labels={options}
                    oneWordPerLine={oneWordPerLine}
                />
                <RadioRow
                    value={value}
                    options={options}
                    onChange={(answer) => onChange(answer)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: 'darkgrey',
        borderRadius: 5,
        padding: 2,
    },
    radioRow: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        columnGap: 5,
        // borderWidth: 1,
    },
    radioButton: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1, // Keeps in-line with labels
        // borderWidth: 1,
    },
});
