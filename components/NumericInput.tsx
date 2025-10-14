import { TextInput } from "react-native";
import {globalStyles} from "@/styles/appStyles";

export default function NumericInput({ value, placeholder, maxLength, onChange, style }: { value: string, placeholder?: string, maxLength?: number, onChange: (number: string) => void, style?: object }) {
    // controlled component, no internal state
    function handleInput(response: string) {
        // Allow empty string for clearing the input
        if (response === '') {
            onChange('');
            return;
        }

        // Remove non-numeric characters
        const onlyNumbers = response.replace(/[^0-9]/g, '');

        // Convert to number and back to remove leading zeros
        // This prevents "00" but allows "0"
        const number = String(parseInt(onlyNumbers, 10) || 0);
        onChange(number);
    }

    return (
        <TextInput
            value={value}
            keyboardType="numeric"
            placeholder={placeholder}
            placeholderTextColor={'grey'}
            style={[globalStyles.input,{...style}]}
            onChangeText={newText => handleInput(newText)}
            maxLength={maxLength??2}
            returnKeyType='done'
        />
    )
}
