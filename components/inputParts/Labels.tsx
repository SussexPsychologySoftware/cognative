import {StyleSheet, Text, View} from "react-native";
import {globalStyles} from "@/styles/appStyles";

export default function Labels({labels}: { labels: string[] }) {
    return (
        <View style={styles.container}>
            {labels.map((label, index) => (
                <View key={`labels-${label}`} style={styles.labelContainer}>
                    <Text style={[globalStyles.whiteText, styles.labelText]}>
                        {label}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        columnGap: 3,
        paddingVertical: 5,
    },
    labelContainer: {
        width: 70,
        textAlign: 'center',
    },
    labelText: {
        fontWeight: "500",
    }

});
