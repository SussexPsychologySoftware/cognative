import {globalStyles} from "@/styles/appStyles";
import {StyleSheet, Text, TouchableOpacity} from 'react-native'
import {Checkbox} from 'expo-checkbox';

// Called Tickbox to avoid clash with expo's Checkbox - this is mostly a wrapper to in-line the text.
export default function Tickbox({ checked, text, colour, onChange }: {
    checked: boolean,
    text: string,
    colour?: string,
    onChange: (checked: boolean) => void,
}) {
    return(
        <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => {onChange(!checked)}}
        >
            <Checkbox
                style={styles.checkbox}
                value={checked}
                onValueChange={onChange}
                color={checked ? colour : 'grey'}
            />
            <Text style={globalStyles.standardText}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    checkbox: {
    },
})

