import {StyleSheet, View, Text} from "react-native";
import {globalStyles} from "@/styles/appStyles";
import {Link, RelativePathString} from "expo-router";

export default function PageList({ pages }: { pages?: string[]}){
    //print out files with: `find app/ -type f -name "*.tsx"` in terminal
    if(!pages) pages = ['','surveyExample','end'] // TODO: add pages here
    return (
        <View style={styles.pageList}>
            <Text style={styles.debugTitle}>Page List:</Text>
            {
                pages.map((page,i) =>
                    <Link
                        key={page}
                        href={"/"+page as RelativePathString}
                        style={[styles.debugLink]}
                    >
                        {page !== '' ? page : 'home'}
                    </Link>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    // Page list for debugging
    pageList: {
        gap: 5,
        paddingVertical: 8,
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
