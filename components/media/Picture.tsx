import {StyleSheet, View, Text} from 'react-native';
import {Image} from 'expo-image'

export default function Picture({asset, caption, width, height, imageStyle, captionStyle}: {asset: number, caption?: string, width?: number, height?: number, imageStyle?: object, captionStyle?: object}) {
    // e.g. asset = require('../assets/images/screens.jpg')
    return (
        <View style={styles.imageContainer}>
            <Image
                style={[styles.image, {width: width ?? '100%'}, {height: height ?? 300}, imageStyle]}
                source={asset}
                placeholder={'Image missing'}
                contentFit="contain"
            />
            {
                caption &&
                <Text style={[styles.imageCaption, captionStyle]}>
                    {caption}
                </Text>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center',
        // maxWidth: '100%',
        // maxHeight: '100%',
        gap: 5
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
        // paddingHorizontal: 30,
    },
})



