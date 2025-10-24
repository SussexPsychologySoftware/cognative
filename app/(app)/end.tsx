import {Text, View, StyleSheet} from 'react-native';

export default function EndScreen() {
    return (
        <View style={styles.container}>
            <Text>The experiment is now over</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#25292e',
        // alignItems: 'center',
        justifyContent: 'center',
    },
    resetButtons: {
        marginVertical: 40,
        gap: 10
    },
    // Page list for debugging
    pageList: {
        gap: 5,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'grey',
    },
    debugTitle: {
        color: 'grey',
        fontSize: 14,
        marginBottom: 8,
    },
    debugLink: {
        color: 'grey',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});
