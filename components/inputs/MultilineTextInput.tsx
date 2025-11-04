import {InputAccessoryView, Keyboard, Platform, Pressable, TextInput, View, Text} from "react-native";
import {globalStyles} from "@/styles/appStyles";

export default function MultilineTextInput({ value, placeholder, onChange, maxLength }: { value: string, placeholder?: string, onChange: (number: string) => void, maxLength?: number}){
    // controlled component, no internal state
    const inputAccessoryViewID = 'uniqueID'; // required for adding the done button back in

    function handleInput(response: string) {
        onChange(response);
    }

    return (
        <>
            <TextInput
                multiline
                value={value}
                placeholder={placeholder}
                placeholderTextColor={'grey'}
                style={globalStyles.input}
                onChangeText={text => handleInput(text)}
                // returnKeyType='done' // This changes the 'enter' key, and no done button present by default
                inputAccessoryViewID={inputAccessoryViewID}
                maxLength={maxLength}
            />
            { // Include custom done button in top bar on iOS
                Platform.OS === 'ios' &&
                <InputAccessoryView nativeID={inputAccessoryViewID}
                                    style={{backgroundColor: 'white'}}
                >
                    <View style={{
                        backgroundColor: '#c8cbcd', // Roughly iOS ish for now TODO: improve
                    }}
                    >
                        <Pressable onPress={()=>Keyboard.dismiss()}>
                            <Text style={{
                                color: '#007AFF',
                                fontSize: 17,
                                fontWeight: '500',
                                textAlign: 'right',
                                padding: 12
                            }}
                            >
                                Done
                            </Text>
                        </Pressable>
                    </View>
                </InputAccessoryView>
            }
        </>
    )
}
