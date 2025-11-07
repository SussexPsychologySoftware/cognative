import {StyleSheet, View, Text} from "react-native";
import {globalStyles} from "@/styles/appStyles";
import {experimentDefinition} from "@/config/experimentDefinition";
import {Link, Href} from "expo-router";
import {RoutingService} from "@/services/RoutingService";

export default function PageList({ pages }: { pages?: Href[]}){
    //print out files with: `find app/ -type f -name "*.tsx"` in terminal
    // TODO: Add ability to pass through local search params

    if(!pages) {
        // consider using .reduce for more complex filtering in future.
        const surveyList = experimentDefinition.tasks
            .map(task => (RoutingService.getTaskHref(task)));

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
                pages.map((page,i) => {
                    const isString = typeof page === 'string';
                    const pathname = isString ? page : page.pathname;
                    const params = isString ? undefined : page.params;
                    const href = isString ? pathname : page; // href prop accepts string or object
                    // key
                    const key = `${pathname}-${params?.taskId || i}`;
                    // display text
                    const displayPath = pathname === '/' ? 'home' : /[^/]*$/.exec(pathname)?.[0] || pathname;
                    return(
                        <Link
                            key={key}
                            href={href}
                            style={[globalStyles.debugText,styles.debugLink]}
                        >
                            {displayPath}
                            {params?.taskId ? ': ' + params.taskId : ''}
                        </Link>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    debugLink: {
        textDecorationLine: 'underline',
    },
});
