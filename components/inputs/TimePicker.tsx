import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {globalStyles, colours} from "@/styles/appStyles";

// --- Helper functions to convert time string to Date type and back  ---
function createDateFromTime(timeString: string | null): Date {
    if (!timeString || !timeString.includes(':')) {
        return new Date(); // Fallback to now
    }
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

function createTimeFromDate(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

interface TimePickerProps {
    value: string | null; // Allow null values
    onChange: (time: string | null) => void; // Allow setting null
    cancellable?: boolean;
    defaultValue?: string; // Value to restore to if null is cancelled
}

export default function TimePicker({ value, onChange, cancellable=true, defaultValue }: TimePickerProps) {
    // Nullable time picker component - scroll type and cross-platform similar.
    const [showPicker, setShowPicker] = useState(false);

    const handleChange = (event: any, selectedTime?: Date) => {
        // On Android, dismissing the picker can trigger onChange with an undefined time
        setShowPicker(false);
        if(selectedTime) {
            onChange(createTimeFromDate(selectedTime));
        }
    };

    const handleShowPicker = () => {
        setShowPicker(true);
        // If no value, set to now and emit
        if (!value) {
            onChange(defaultValue ?? createTimeFromDate(new Date()));
        }
    }

    // ADDED: Handler to clear the time
    const handleClear = () => {
        setShowPicker(false);
        onChange(null);
    };

    return (
        <View style={styles.container}>
            {((Platform.OS === 'ios' && !value) || Platform.OS === 'android') &&
                <TouchableOpacity
                    onPress={handleShowPicker}
                    style={styles.timeButton}
                >
                    <Text style={[styles.timeText, globalStyles.standardText]}>
                        {/*WHY DOESN'T A NULL COALESCING OPERATOR WORK HERE?*/}
                        {value ? value : 'Set Time' }
                    </Text>
                </TouchableOpacity>
            }

            {((Platform.OS === 'ios' && value) || (Platform.OS === 'android' && showPicker)) &&
                // NOTE: the fact this renders at present as an inline modal pop-up is an iOS display rule quirk liable to break...
                <DateTimePicker
                    value={createDateFromTime(value)}
                    display={Platform.OS === 'android'? 'spinner' : undefined}
                    mode="time"
                    is24Hour={true}
                    onChange={handleChange}
                    textColor={colours.text}
                    accentColor={colours.text}
                    themeVariant='dark' // TODO: Control as prop??
                />
            }

            {cancellable && value &&
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <Text style={styles.clearButtonText}>X</Text>
                </TouchableOpacity>
            }
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
