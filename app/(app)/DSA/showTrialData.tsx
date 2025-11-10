import {Text, View, StyleSheet, Pressable} from "react-native";
import React, {useEffect, useState} from "react";
import {LAB, LCH, RGB} from "@/types/colours";
import {useExperiment} from "@/context/ExperimentContext";
import {StandardView} from "@/components/layout/StandardView";
import {DataService} from "@/services/data/DataService";
import {globalStyles} from "@/styles/appStyles";
// Return selected colour,
// overthinking, maybe just pass in the update and toggle functions? horizontal?

interface TestColour {
    RGB: RGB,
    description: string
}


interface Trial {
    response: {
        RGB: RGB;
        LAB: LAB;
    }
    startingColour: LCH;
    rt: number;
}


export default function ShowTrialDataScreen() {
    const { displayState, getTaskFilename } = useExperiment();

    const [trialData, setTrialData] = useState<Trial[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const testData: TestColour[] = [
        {RGB: {r:255, g:0, b:0}, description: 'RED'},
        {RGB: {r:0, g:255, b:0}, description: 'GREEN'},
        {RGB: {r:0, g:0, b:255}, description: 'BLUE'},
        {RGB: {r:255, g:255, b:0}, description: 'YELLOW'},
        {RGB: {r:255, g:255, b:255}, description: 'WHITE'}
    ]
    const [backgroundColour, setBackgroundColour] = useState<RGB>(testData[0].RGB);
    const [consentData, setConsentData] = useState<Record<string, any>>({});

    useEffect(() => {
        const loadPreviousData = async () => {
            try {
                // Consent
                const consentFilename = getTaskFilename('consent')
                if(!consentFilename) return null;
                const consentData = await DataService.getData(consentFilename)
                if (consentData === null) return null;
                // const consentDataFiltered = Object.fromEntries(
                //     Object.entries(consentData).filter(([_, v]) => v)
                // )
                setConsentData(consentData);
                // Trials
                const trialsFilename = getTaskFilename('adjust')
                if(!trialsFilename) return null;
                const data = await DataService.getData(trialsFilename)
                if (data === null) return null;
                setTrialData(data);

            } catch (error) {
                console.error('Error loading trial data:', error);
            }
        };

        void loadPreviousData();
    }, [getTaskFilename]); // Empty dependency array means this runs once on mount


    const handlePress = (responseColour: RGB, selectedIndex: number) => {
        setBackgroundColour(responseColour);
        setSelectedIndex(selectedIndex);
    }

    function DisplayColourButton({index, RGB, targetColour, displayIndex}: {index: number, RGB: RGB, targetColour?: string, displayIndex?: number }) {
        return (
            <Pressable
                style={[styles.trialSelector, selectedIndex===index && styles.selectedTrial]}
                onPress={()=>handlePress(RGB, index)}>
                <Text
                    style={styles.text}
                >
                    {displayIndex??index}) {RGB.r}, {RGB.g}, {RGB.b} {targetColour && `| ${targetColour}`}
                </Text>
            </Pressable>
        )
    }

    return (
            <StandardView
                safeAreaStyle={{
                    backgroundColor: `rgb(${backgroundColour.r}, ${backgroundColour.g}, ${backgroundColour.b})`
                }}
            >
                {/*<Text style={{color: 'black', fontSize: 20, marginBottom: 5, fontWeight: 'bold'}}>ID: {displayState?.participantId}</Text>*/}
                <Text
                    selectable={true}
                    style={[styles.text, {marginVertical: 40}]}>
                    Consent Form: {JSON.stringify(consentData,null,4)}
                </Text>
                <View style={styles.trialList}>
                    <Text style={styles.text}>TEST COLOURS</Text>
                    {
                        testData.map((item, index) =>{
                            return(
                                <DisplayColourButton
                                    key={`test-${index}`}
                                    index={index}
                                    RGB={item.RGB}
                                    targetColour={item.description}
                                    displayIndex={index+1}
                                />)
                        })
                    }
                    <Text style={styles.text}>TRIAL DATA</Text>
                    {
                        trialData.map((item, index) => {
                            // console.log(item);
                            return(
                                <DisplayColourButton
                                    key={`trial-${index}`}
                                    index={index+testData.length}
                                    RGB={item.response.RGB} //item.RGB
                                    displayIndex={index+1}
                                />
                            )

                        }

                        )
                    }
                </View>
            </StandardView>
    );
}

const styles = StyleSheet.create({
    buttons:{
        alignItems: "flex-start",
        flexDirection: "column",
        gap: 10
    },
    button: {
        backgroundColor: 'black',
        alignSelf: 'flex-start'
    },

    container: {
        padding: 30,
        alignItems: "flex-start",
        minHeight: '100%'
    },
    trialList: {
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 10,
        marginBottom: 50,
    },
    trialSelector: {
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "black",
        padding: 10,
    },
    selectedTrial: {
        backgroundColor: "darkgrey",
    },
    text: {
        fontSize: 15,
        fontWeight: "bold",
        color: "black",
    },

});

