import React, { useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal} from 'react-native';
import {globalStyles} from "@/styles/appStyles";

// https://medium.com/@amolakapadi/react-native-implementing-a-multi-select-search-textinput-47ab2b4153d4
export default function Select({ value, options, onSelect, multiple }: { value: string|string[], options: Record<string, string[]>, onSelect: (selection: string|string[]) => void, multiple?: boolean }) {
    //https://reactnative.dev/docs/modal
    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible)
    }

    const handleSelect = (option: string) => {
        if(multiple && option){ // TODO: issue here in when multiple can return '' or [] as empty...
            if(Array.isArray(value) && value.includes(option)) onSelect(value.filter(item => item !== option))
            else onSelect([...value, option])
        } else {
            onSelect(option)
        }
        if(!multiple) setModalVisible(false)
    };

    function SelectOptions({options}: {options: Record<string, string[]>}) {
        const groupedOptions = []
        for (const [groupName, groupOptions] of Object.entries(options)) {
            const groupTitle =
                <TouchableOpacity
                    activeOpacity={1}
                    key={groupName}
                >
                    <Text
                        pointerEvents="none"
                        style={styles.groupTitle}
                    >
                        {groupName}
                    </Text>
                </TouchableOpacity>
            const optionsList = groupOptions.map((item, index) => {
                return(
                    <TouchableOpacity
                        key={`${groupName}-${item}`}
                        style={[styles.listOption,
                            value===item || (Array.isArray(value) && value.includes(item)) ? styles.selectedItemInList : {backgroundColor: 'inherit' }
                        ]}
                        onPress={() => handleSelect(item)}
                    >
                        <Text style={[
                            styles.optionText,
                            value===item || (Array.isArray(value) && value.includes(item)) ? styles.selectedItemInList : {backgroundColor: 'inherit' }
                        ]}
                        >
                            { item }
                        </Text>
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
                        {
                            (!value || (Array.isArray(value) && value.length===0)) ? 'Click to select an option' :
                            Array.isArray(value) ? value.join(',\n') : value
                        }
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
                        {multiple &&
                            <TouchableOpacity style={[styles.removeButtonContainer, styles.listCloseButton]} onPress={toggleModal}>
                                <Text style={[styles.removeButton]}>
                                    x
                                </Text>
                            </TouchableOpacity>
                        }
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
        // stop overflow
        maxWidth: '90%',
        maxHeight: '100%'
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

    // MODAL LIST CONTAINER -----
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
    listCloseButton: {
        backgroundColor: 'transparent',
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    listScrollContainer: {
        width: '100%',
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        backgroundColor: 'grey',
        color: 'white',
    },
    listOption: {
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
    },
    optionText: {
        fontSize: 18,
    },
    selectedItemInList: {
        backgroundColor: '#007AFF',
        color: 'white',
    }
});
