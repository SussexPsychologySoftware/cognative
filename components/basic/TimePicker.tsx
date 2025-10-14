// TimePicker.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TimePickerProps {
    value: Date | null; // MODIFIED: Allow null values
    onChange: (date: Date | null) => void; // MODIFIED: Allow setting null
}

export default function TimePicker({ value, onChange }: TimePickerProps) {
    // Nullable time picker component - scroll type and cross-platform similar.
    const [showPicker, setShowPicker] = useState(false);

    const formatTime = (date: Date | null) => {
        if (!date) return '--:--'
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleChange = (event: any, selectedTime?: Date) => {
        // On Android, dismissing the picker can trigger onChange with an undefined time
        setShowPicker(false);
        onChange(selectedTime??null);
    };

    // ADDED: Handler to clear the time
    const handleClear = () => {
        setShowPicker(false);
        onChange(null);
    };

    // Use a default date if value is null, otherwise the picker can crash
    const pickerValue = value || new Date();

    return (
        <View style={styles.container}>
            {/* MODIFIED: Conditionally render based on whether a value is set */}
            {!showPicker && !value ? (
                <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    style={styles.timeButton}
                >
                    <Text style={styles.timeText}>Set Time</Text>
                </TouchableOpacity>
            ) : (
                <>
                    {Platform.OS === 'ios' && (
                        <DateTimePicker
                            value={pickerValue}
                            mode="time"
                            is24Hour={true}
                            onChange={handleChange}
                            textColor={'white'}
                            themeVariant={'light'} // TODO: Control as prop??
                        />
                    )}
                    {Platform.OS === 'android' && (
                        <TouchableOpacity
                            onPress={() => setShowPicker(true)}
                            style={styles.timeButton}
                        >
                            <Text style={styles.timeText}>{formatTime(value)}</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                        <Text style={styles.clearButtonText}>X</Text>
                    </TouchableOpacity>
                </>
            )}
            {Platform.OS === 'android' && showPicker && (
                <DateTimePicker
                    display={'spinner'}
                    value={pickerValue}
                    mode="time"
                    is24Hour={true}
                    onChange={handleChange}
                    textColor={'white'}
                    themeVariant={'dark'}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 10,
    },
    timeButton: {
        backgroundColor: '#393b42',
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        minWidth: 90, // Increased width for "Set Time"
        alignItems: 'center',
    },
    timeText: {
        fontSize: 18,
        color: 'white',
    },
    // ADDED: Styles for the clear button
    clearButton: {
        backgroundColor: '#e57373', // A soft red color
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
