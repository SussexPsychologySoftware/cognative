import {StyleSheet, Text, TextInput, View} from "react-native";
import {useEffect, useMemo, useRef, useState} from 'react';
import {globalStyles} from "@/styles/appStyles";

// NOTE: for now this returns separate 0 padded hours and minute. Seems like a good compromise.
// or should it be called TimeTyper in line with TimePicker?
// see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/time
export default function TimeInput({ value, clock=true, onChange }: { value: string, clock:boolean, onChange: (time: string) => void }){
    function zeroPad(num:string) {
        return (num.length===1 ? '0' : '') + num
    }

    // handle focusing minute input
    const minuteInputRef = useRef<TextInput | null>(null);

    // useMemo will re-calculate the initial hour/minute only when the value prop changes
    const [initialHour, initialMinute] = useMemo(() => {
        return (value && value.includes(':'))
            ? value.split(':')
            : ['', ''];
    }, [value]);

    // Initialize internal state from the parsed prop
    const [formattedHour, setFormattedHour] = useState(() => zeroPad(initialHour));
    const [formattedMinute, setFormattedMinute] = useState(() => zeroPad(initialMinute));

    // sync internal state with prop change
    useEffect(() => {
        setFormattedHour(zeroPad(initialHour));
        setFormattedMinute(zeroPad(initialMinute));
    }, [initialHour, initialMinute]);

    function formatTime(time:string, max:number|null){
        const strippedNumber = time.replace(/[^0-9]/g, '');
        if(strippedNumber.length===0) return '';

        const numericAnswer = Number(strippedNumber);
        let textAnswer = String(numericAnswer);
        if (max && numericAnswer > max) textAnswer = String(max);
        else if (numericAnswer < 0) textAnswer = '0';

        return zeroPad(textAnswer);
    }

    function formatHour(hour:string){
        return formatTime(hour, clock ? 23 : null)
    }

    function formatMinute(minute:string){
        return formatTime(minute, 59)
    }

    // onChange handlers update internal state
    function onChangeHour(newHour: string){
        setFormattedHour(newHour);
        if(newHour.length===2){
            minuteInputRef.current?.focus()
        }
    }

    function onChangeMinute(newMinute: string){
        setFormattedMinute(newMinute);
    }

    // onBlur handlers when user leaves field format state and call parent onChange
    function onBlurHour(newHour: string){
        const cleanHour = formatHour(newHour);
        setFormattedHour(cleanHour); // Update internal state to formatted value
        // Get the other value (already in state) and format it too
        const cleanMinute = formatMinute(formattedMinute);
        // Combine and call parent
        // Default to '00' if a field is empty
        const newTime = `${cleanHour || '00'}:${cleanMinute || '00'}`;
        // Only call parent if the value has actually changed
        if (newTime !== value) {
            onChange(newTime);
        }
    }

    function onBlurMinute(newMinute: string){
        const cleanMinute = formatMinute(newMinute);
        setFormattedMinute(cleanMinute); // Update internal state to formatted value
        // Get the other value (already in state) and format it too
        const cleanHour = formatHour(formattedHour);
        // Combine and call parent
        // Default to '00' if a field is empty
        const newTime = `${cleanHour || '00'}:${cleanMinute || '00'}`;
        // Only call parent if the value has actually changed
        if (newTime !== value) {
            onChange(newTime);
        }
    }


    return (
        <View style={styles.container}>
            <TextInput
                keyboardType="numeric"
                placeholder={'00'}
                placeholderTextColor={'grey'}
                value={formattedHour}
                style={globalStyles.inputNoFont}
                // onFocus={()=> onChangeHour('')}
                selectTextOnFocus={true}
                // onPressIn={()=> onChangeHour('')}
                onChangeText={onChangeHour}
                onEndEditing={e => onBlurHour(e.nativeEvent.text)}
                maxLength={2}
                returnKeyType='done'
            />

            <Text style={styles.text}>{clock ? ':' : 'hrs'}</Text>
            <TextInput
                keyboardType="numeric"
                placeholder={'00'}
                placeholderTextColor={'grey'}
                value={formattedMinute}
                style={globalStyles.inputNoFont}
                // onFocus={()=> onChangeMinute('')}
                selectTextOnFocus={true}
                // onPressIn={()=> onChangeMinute('')}
                onChangeText={onChangeMinute}
                onEndEditing={e => onBlurMinute(e.nativeEvent.text)}
                maxLength={2}
                returnKeyType='done'
                ref={minuteInputRef}
            />
            <Text style={styles.text}>{clock ? '' : 'mins'}</Text>
        </View>);
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 5,
    },
    text: {
        color: 'white',
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        color: 'white'
    },
});
