import {StyleSheet, View, Text} from 'react-native';
import {Image} from 'expo-image'

export default function Picture({asset, caption, width, height}: {asset: number, caption?: string, width?: number, height?: number}) {
    // e.g. asset = require('../assets/images/screens.jpg')
    return (
        <View style={styles.imageContainer}>
            <Image
                style={[styles.image, {width: width ?? '100%'}, {height: height ?? 300}]}
                source={asset}
                placeholder={'Image missing'}
                contentFit="contain"
            />
            {
                caption &&
                <Text style={styles.imageCaption}>
                    {caption}
                </Text>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    imageContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    image: {
        // maxWidth: '100%',
        // maxHeight: '100%',
    },
    imageCaption: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 20,
    },
})



