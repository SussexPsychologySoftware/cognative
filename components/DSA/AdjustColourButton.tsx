import { Text, StyleSheet, Pressable, View, ColorValue } from 'react-native';
import { useState, useRef, useEffect } from "react";

export default function AdjustColourButton({ style, disabled, onPress, text, textStyle, colour}: {style: object, disabled: boolean, onPress: ()=>void, text?: string, textStyle?: object, colour?: ColorValue}) {

    const [pressed, setPressed] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const endPress = () => {
        setPressed(false)
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const startLongPress = () => {
        if(disabled || intervalRef.current) return; // If disabled or already interval running
        setPressed(true)
        intervalRef.current = setInterval(onPress, 10);
    };

    useEffect(endPress, [disabled]);

    // Cleanup on unmount just incase
    useEffect(() => {
        return () => {
            endPress();
        };
    }, []);

    return (
        <Pressable
            // key={disabled ? 'disabled' : 'enabled'}
            disabled={disabled}
            onPress={onPress}
            onPressIn={()=>setPressed(true)}
            onLongPress={startLongPress}
            onPressOut={endPress}
            delayLongPress={200}
            // unstable_pressDelay={0}
        >
            <View style={[
                    styles.adjustColourButton,
                    style,
                    {
                        borderColor: disabled ? 'transparent' : colour??'black',
                        backgroundColor: pressed ? colour??'black' : 'transparent',
                    },
                ]}>
                <Text style={
                    [
                        styles.text,
                        textStyle,
                        {color: disabled ? 'transparent' : colour??'black'}
                    ]
                }>
                    {text ?? '+'}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    adjustColourButton: {
        // paddingVertical: 10,
        // paddingHorizontal: 10,
        // margin: 10,
        borderWidth: 1,
        borderRadius: 20,
        height: 80,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 30,
    }
});
