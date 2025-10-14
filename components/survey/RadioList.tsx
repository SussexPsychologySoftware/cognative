import React, {useState} from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import Radio from "@/components/basic/Radio";
import {globalStyles} from "@/styles/appStyles";

export default function RadioList({options, onSelect, containerStyle} : { options: string[], onSelect: (option: string)=>void, containerStyle?: object }) {
    // TODO: make the buttons next to the text
    const [selectedOption, setSelectedOption] = useState('');

    const onOptionPress = (option: string) => {
        setSelectedOption(option);
        onSelect(option);
    }

    return(
        <View style={containerStyle}>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={option}
                    style={styles.container}
                    onPress={()=>onOptionPress(option)}
                >
                    <Radio
                        selected={selectedOption===option}
                    />
                    <Text style={globalStyles.standardText}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
})



