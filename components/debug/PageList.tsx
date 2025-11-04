import {StyleSheet, View, Text} from "react-native";
import {globalStyles} from "@/styles/appStyles";
import {Link, RelativePathString} from "expo-router";

export default function PageList({ pages }: { pages?: string[]}){
    //print out files with: `find app/ -type f -name "*.tsx"` in terminal
    // TODO: Add ability to pass through local search params
    if(!pages) pages = ['','surveyExample','end', 'settings'] // TODO: add pages here
    return (
        <View style={globalStyles.debugContainer}>
            <Text style={[globalStyles.debugText,globalStyles.debugTitle]}>Page List:</Text>
            {
                pages.map((page,i) =>
                    <Link
                        key={page}
                        href={"/"+page as RelativePathString}
                        style={[globalStyles.debugText,styles.debugLink]}
                    >
                        {page !== '' ? page : 'home'}
                    </Link>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    debugLink: {
        textDecorationLine: 'underline',
    },
});
