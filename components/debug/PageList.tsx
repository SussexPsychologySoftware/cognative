import {StyleSheet, View, Text} from "react-native";
import {globalStyles} from "@/styles/appStyles";
import {experimentDefinition} from "@/config/experimentDefinition";
import {Link, RelativePathString, Href} from "expo-router";

interface Page {
    pathname: string;
    params?: Record<string, string>;
}

export default function PageList({ pages }: { pages?: Page[]}){
    //print out files with: `find app/ -type f -name "*.tsx"` in terminal
    // TODO: Add ability to pass through local search params

    if(!pages) {
        // consider using .reduce for more complex filtering in future.
        const surveyList = experimentDefinition.tasks
            .filter(task => task.type === 'survey' || task.type === 'screen')
            .map(task => ({
                pathname: task.type === 'survey' ? '/survey' : task.path_to_screen,
                params: { taskId: task.id }
            }));

        pages = [
            // {pathname: "/(onboarding)/welcome"},
            {pathname:'/'},
            {pathname: '/end'},
            {pathname:'/settings'},
            ...surveyList
        ]
    }

    return (
        <View style={globalStyles.debugContainer}>
            <Text style={[globalStyles.debugText,globalStyles.debugTitle]}>Page List:</Text>
            {
                pages.map((page,i) =>
                    <Link
                        key={`${page.pathname}-${page.params?.taskId}-${i}`}
                        href={page as unknown as Href} // bit dodgy but can't get anything else to work
                        style={[globalStyles.debugText,styles.debugLink]}
                    >
                        {page.pathname === '/' ? 'home' : /[^/]*$/.exec(page.pathname)}
                        {page.params?.taskId ? ': '+page.params?.taskId : ''}
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
