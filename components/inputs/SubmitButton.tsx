import React, {useState} from 'react'
import {Text, StyleSheet, Pressable} from 'react-native'

export default function SubmitButton({ text, disabledText, disabled, onPress, style, cooldown=0 } : { text: string, disabledText?: string, disabled?: boolean, onPress: () => void | Promise<void>, style?: object, cooldown?: number }) {
    const [pressExecuting, setPressExecuting] = useState(false); // Define pressExecuting state

    const handlePress = async () => {
        // This makes the disabled function a little tighter but not air-tight
            // Good for if the function wants to e.g. prevent multiple submissions
            // Consider the debouncing function in parent if looking to stop multiple presses quicker
        if (pressExecuting) return;
        setPressExecuting(true);
        try {
            await onPress(); // Just doesn't do anything if synchronous function
        } catch (error) {
            console.error('Error executing press: ', error);
        } finally {
            if (cooldown > 0) {
                setTimeout(() => {
                    setPressExecuting(false);
                }, cooldown);
            } else {
            setPressExecuting(false);
        }
        }
    };

    const disabledOrExecuting = disabled || pressExecuting;

    return(
        <Pressable
            disabled={disabled}
            onPress={handlePress}
            style={[{backgroundColor: disabledOrExecuting ? 'grey' : 'white'}, styles.button, style]}        >
            <Text
                style={styles.text}
            >
                { disabledOrExecuting ? (disabledText??text) : text}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        color: 'black',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        alignSelf: 'center'
    },
    text: {
        color: 'black',
        justifyContent: 'center'
    }
})

