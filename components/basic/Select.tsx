import React, { useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal} from 'react-native';
import {globalStyles} from "@/styles/appStyles";


// https://medium.com/@amolakapadi/react-native-implementing-a-multi-select-search-textinput-47ab2b4153d4


export default function Select({ value, options, onSelect }: { value: string, options: Record<string, string[]>, onSelect: (selection: string) => void }) {
    //https://reactnative.dev/docs/modal
    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible)
    }

    const handleSelect = (option: string) => {
        onSelect(option);
        setModalVisible(false)
    };


    function SelectOptions({options}: {options: Record<string, string[]>}) {
        const groupedOptions = []
        for (const [groupName, groupOptions] of Object.entries(options)) {
            const groupTitle = <Text style={styles.groupTitle}>{groupName}</Text>;
            const optionsList = groupOptions.map((item, index) => {
                return(
                    <TouchableOpacity
                        key={`${groupName}-${item}`}
                        style={[styles.listOption, value===item ? {backgroundColor: 'grey' } : {backgroundColor: 'inherit' }]}
                        onPress={() => handleSelect(item)}
                    >
                        <Text style={styles.optionText}>{ item }</Text>
                    </TouchableOpacity>
                )
            })
            groupedOptions.push(groupTitle, ...optionsList)
        }
        return groupedOptions
    }

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
                            <SelectOptions
                                options={options}
                            />
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

    // REMOVE BUTTON -----
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

    // LIST CONTAINER -----

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
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        backgroundColor: '#007AFF',
        color: 'white',
    },
    listOption: {
        marginLeft: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
    },
    optionText: {
        fontSize: 18,
    },
});
