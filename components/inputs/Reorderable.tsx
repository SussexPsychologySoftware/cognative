import {Pressable, StyleSheet, View, Text, TouchableOpacity} from "react-native";
import {globalStyles} from "@/styles/appStyles";
import {useCallback} from "react";

const ReorderButton = ({text, handleReorder, style}:{text: string, handleReorder: ()=>void, style?: object}) => {
    // const displayText = typeof text === 'symbol' ? text.description ?? text.toString() : text;
    return (
        <TouchableOpacity
            style={[styles.reorderButton, style]}
            onPress={handleReorder}
        >
            <Text style={[styles.reorderButtonText, globalStyles.standardText]}>{text}</Text>
        </TouchableOpacity>
    )
}

const ReorderableItem = ({ index, text, handleReorder, vertical }: { index: number, text: string, handleReorder: (index: number, changeIndex: number)=>void, vertical?: boolean }) => {
    return (
        <View style={[
            styles.itemContainer,
            {flexDirection: vertical ? 'row' : 'column'},
        ]}>
            <Text style={[globalStyles.standardText, styles.itemText]}>{text}</Text>
            <View style={[
                styles.reorderButtonsContainer,
                vertical ? styles.reorderButtonsContainerVertical : styles.reorderButtonsContainerHorizontal
            ]}>
                <ReorderButton
                    text={vertical ? '+' : "<"}
                    handleReorder={()=>handleReorder(index, -1)}
                    style={[vertical ? {borderBottomWidth: 1} : {borderRightWidth: 1}]}
                />
                <ReorderButton
                    text={vertical ? '-' : ">"}
                    handleReorder={()=>handleReorder(index, 1)}
                    style={styles.rightButton}
                />
            </View>
        </View>
    )
}

export default function Swap({ items, onChange, vertical, style }: { items: string[], onChange: (order: string[]) => void, vertical?: boolean, style?: object }) {
    //e.g. const [order, setOrder] = useState(['control','binaural','monaural']);
    // <Swap items={order} onChange={setOrder} vertical={true}/>
    function mod(n: number, m: number) {
        return ((n % m) + m) % m;
    }

    const reorderItem = (index: number, change: number) => {
        const itemsCopy = [...items]
        let newIndex = mod(index+change, items.length);
        const itemCopy = itemsCopy[index];
        itemsCopy.splice(index, 1) //delete from current location
        itemsCopy.splice(newIndex, 0, itemCopy) // add in new location
        onChange(itemsCopy)
    }

    return (
        <View style={[styles.container, style, {flexDirection: vertical ? 'column' : 'row'}]}>
            {
                items.map((item, i) => (
                    <ReorderableItem
                        key={item} //or i?
                        index={i}
                        text={item}
                        handleReorder={reorderItem}
                        vertical={vertical}
                    />
                ))
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        // flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: 3,
    },
    itemContainer: {
        flex: 1,
        backgroundColor: 'lightgray',
        borderWidth: 1,
        borderColor: 'darkgray',
        borderRadius: 10, // rounded edges for the whole unit
        overflow: 'hidden', // clips children’s inner corners,
    },
    itemText: {
        color: 'black',
        fontSize: 18,
        padding: 10,
        backgroundColor: 'white',
        // borderWidth: 1,
        borderColor: 'darkgray',
        textAlign: 'center',
        flex: 1,
    },
    reorderButtonsContainer: {
        // flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        borderColor: 'darkgray',
    },
    reorderButtonsContainerVertical: {
        minWidth: '10%',
        borderLeftWidth: 1
    },
    reorderButtonsContainerHorizontal: {
        flexDirection: 'row',
        borderTopWidth: 1,
        flex: 1,
    },
    reorderButton: {
        borderColor: 'darkgray',
        // borderWidth: 1,
        flex: 2,
        alignItems: 'center',
        width: '100%',
    },
    leftButton: {
        // borderTopStartRadius: 10,
        // borderBottomStartRadius: 10,
        // borderRightWidth: 1,
    },
    rightButton: {
        // borderTopEndRadius: 10,
        // borderBottomEndRadius: 10,
    },
    reorderButtonText: {
        color: 'black',
        fontSize: 20,
    },
})
