import React, { useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert, Dimensions} from 'react-native';
import {modelId} from "expo-device";
import {useWindowDimensions} from 'react-native';
import {globalStyles} from "@/styles/appStyles";


// https://medium.com/@amolakapadi/react-native-implementing-a-multi-select-search-textinput-47ab2b4153d4

export default function Select({ value, options, onSelect }: { value: string, options: string[], onSelect: (selection: string) => void }) {
    //https://reactnative.dev/docs/modal
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (option: string) => {
        console.log('Select changed to:', option);
        onSelect(option);
        setModalVisible(false)
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible)
    }

    const {height, width} = useWindowDimensions();

    return (
        <>
            <TouchableOpacity style={styles.selectedItemContainer} onPress={toggleModal}>
                <View style={styles.selectedItemTextContainer}>
                    <Text
                        numberOfLines={8}
                        adjustsFontSizeToFit={true}
                        style={[globalStyles.standardText, styles.selectedItemText]}
                    >
                        {value ? value : 'Click to select an option'}
                    </Text>
                </View>
                <TouchableOpacity style={styles.removeButtonContainer} onPress={() => handleSelect('')}>
                    <Text style={[styles.removeButton, !value && styles.disabled]}>
                        x
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>

            <Modal
                supportedOrientations={['portrait', 'landscape']}
                style={styles.modalContainer}
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                // backdropColor={'black'}
                onRequestClose={toggleModal}
            >
                <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    style={styles.touchableOpacityContainer}
                >
                    <View style={styles.listContainer}>
                        <ScrollView style={styles.listScrollContainer}>
                            {options.map((option, index) => {
                                return(
                                    <TouchableOpacity
                                        key={option}
                                        style={[styles.listOption, option===value ? {backgroundColor: 'grey' } : {backgroundColor: 'inherit' }]}
                                        onPress={() => handleSelect(option)}
                                    >
                                        <Text style={styles.optionText}>{ option }</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    selectedItemContainer: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: 'darkgray',
        borderWidth: 1,
    },
    selectedItemTextContainer: {
    },
    selectedItemText: {
        fontSize: 16,
        fontWeight: '500',
    },
    removeButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButton: {
        borderColor: 'red',
        color: 'red',
        fontSize: 18,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        borderWidth: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    disabled: {
        borderColor: 'grey',
        color: 'grey',
    },
    selectedText: {
    },

    modalContainer: {
    },
    touchableOpacityContainer: {
        height: '100%',
        width: '100%',
    },
    listContainer: {
        height: '80%',
        maxWidth: '80%',
        top: '10%',
        alignSelf: 'center',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
        backgroundColor: 'white',
    },
    listScrollContainer: {
        width: '100%',
    },
    listOption: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        padding: 10,
    },
    optionText: {
        fontSize: 18,
    },
});
