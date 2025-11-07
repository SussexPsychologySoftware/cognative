import {StyleSheet, View, Text, Dimensions, useWindowDimensions} from 'react-native';
import {Image, ImageLoadEventData} from 'expo-image'
import {useState} from "react";

export default function Picture({asset, caption, width, height, imageStyle, captionStyle}: {asset: number, caption?: string, width?: number, height?: number, imageStyle?: object, captionStyle?: object}) {
    // e.g. asset = require('../assets/images/screens.jpg')

    // Note if image has no height onLoad doesn't fire, so initial state needs to be 1 to calculate proper aspectRatio
    const [aspectRatio, setAspectRatio] = useState<number>(1);
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const screenRatio = windowWidth / windowHeight;

    console.log('aspectRatio', aspectRatio);
    return (
        <View style={styles.imageContainer}>
            <Image
                style={[
                    styles.image,
                    // This doesn't work 100% but good enough for now.
                    aspectRatio > screenRatio ? {width: '100%'} : {height: windowHeight-100},
                    {aspectRatio},
                    width!==undefined && {width: width},
                    height!==undefined && {height: height},
                    imageStyle
                ]}
                source={asset}
                placeholder={'Image missing'}
                contentFit="contain"
                onLoad={(event: ImageLoadEventData) => {
                    const { width, height } = event.source;
                    setAspectRatio(width / height);
                    console.log({ width, height, aspectRatio });
                }}
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
        gap: 10,
        // maxHeight: Dimensions.get('window').height,
    },
    image: {
        width: '100%',
        // maxHeight: '100%',
    },
    imageCaption: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#666',
    },
})



