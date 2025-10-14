import { Text, View, StyleSheet } from "react-native";
import NumericInput from "@/components/NumericInput";
import {useState} from "react";
import MultilineTextInput from "@/components/MultilineTextInput";
import TimePicker from "@/components/TimePicker";

export default function Index() {
    const [responses, setResponses] = useState({
        numericInput: '',
        multilineTextInput: '',
        timePicker: new Date()
    });

    function updateResponses(newValue: any, responseField: string) {
        setResponses({...responses, [responseField]: newValue})
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Edit app/index.tsx to edit this screen.</Text>
            <View style={styles.inputsContainer}>
                <NumericInput
                    value={responses.numericInput}
                    placeholder={"Enter numeric number"}
                    onChange={(newValue: string) => {updateResponses(newValue,'numericInput')}}
                />
                <MultilineTextInput
                    value={responses.multilineTextInput}
                    placeholder={"Multiline text input"}
                    onChange={(newValue: string) => {updateResponses(newValue,'multilineTextInput')}}
                />
                <TimePicker
                    value={responses.timePicker}
                    onChange={(newValue: Date|null) => {updateResponses(newValue,'timePicker')}}
                />
            </View>
        </View>
);
}

const styles = StyleSheet.create({
    inputsContainer: {
        gap: 10
    },
});

