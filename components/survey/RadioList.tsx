import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import Radio from "@/components/inputs/Radio";
import {globalStyles} from "@/styles/appStyles";

export default function RadioList({options, value, onSelect, containerStyle} : { options: string[], value: string, onSelect: (option: string)=>void, containerStyle?: object }) {
    // TODO: make the buttons next to the text
    const onOptionPress = (option: string) => {
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
                        selected={value===option}
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 5
    },
})



