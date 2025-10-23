import { View, Pressable, Text, StyleSheet } from 'react-native';
import { globalStyles } from "@/styles/appStyles";
import Hypher from 'hypher';
import english from 'hyphenation.en-gb';
import Radio from "@/components/inputParts/Radio";
import SecondaryLabels from "@/components/inputParts/Labels";

const h = new Hypher(english);

function hyphenate(text: string) {
    return text?.split(/(\s+)/).map(part =>
        part.trim() ? h.hyphenate(part).join('\u00AD') : part
    ).join('') ?? text;
}

// Define single radio button component
export function OptionLabels({options, hasQuestion, oneWordPerLine}: { options: string[], hasQuestion?: boolean, oneWordPerLine?: boolean }) {
    return (
        <View style={[styles.row, styles.optionsTextContainer]} >
            {hasQuestion && <Text style={[styles.gridItem, styles.question]}></Text>}
            {options.map((option, index) => {
                return(
                    <Text
                        key={`label-${option}`}
                        android_hyphenationFrequency='full'
                        allowFontScaling={true}
                        adjustsFontSizeToFit={true}
                        numberOfLines={oneWordPerLine ? option.split(' ').length : 0}
                        style={[globalStyles.whiteText, styles.optionsText, styles.gridItem]}
                    >
                        {hyphenate(option)}
                    </Text>
                )
            })}
        </View>
    );
}

function RadioButton({ selected, onChange } : { selected: boolean, onChange: () => void }) {
    return (
        <Pressable style={[styles.gridItem, styles.radioButton]} onPress={onChange}>
            <Radio selected={selected} />
        </Pressable>
    );
}

export function LikertQuestionRow(
    {
        selectedResponse,
        question,
        options,
        onChange,
        oddRow,
        isInvalid
    }: {
        selectedResponse: string,
        question?: string,
        options: string[],
        onChange: (answer: string) => void,
        oddRow?: boolean,
        isInvalid?: boolean
    }) {
    return (
        <View style={[
            styles.likertRow,
            styles.row,
            oddRow ? styles.oddRow : styles.evenRow,
            isInvalid && globalStyles.invalidInput
        ]}>
            {
                question &&
                <Text style={[
                    globalStyles.whiteText,
                    styles.question,
                    styles.gridItem,
                ]}>{question}</Text>
            }
            {
                options.map((option, index) => (
                    <RadioButton
                        key={`radio-${option}`}
                        selected={selectedResponse===option}
                        onChange={() => onChange(option)}
                    />
                ))
            }
        </View>
    );
}

export default function LikertGrid(
    {
        responses,
        questions,
        options,
        onChange,
        secondaryLabels,
        oneWordPerLine,
        headerRepeatInterval=0,
        invalidStatements
    }:
    {
        responses: Record<string, string>, // Just this grid's responses: { statement0: 'answer', statement1: 'answer' }
        questions: string[], // The statements
        options: string[], // Likert scale options
        onChange: (statementKey: string, answer: string) => void,
        secondaryLabels?: string[],
        headerRepeatInterval?: number,
        oneWordPerLine?: boolean,
        invalidStatements?: Set<string>
    }) {
    return (
        <View style={[styles.radioGrid, {paddingHorizontal: secondaryLabels ? '5%' : undefined}]}>
            {
                [
                    // secondaryLabels && (
                    //     <SecondaryLabels
                    //         key="secondary-labels"
                    //         labels={!!questions ? secondaryLabels.push('') : secondaryLabels}
                    //     />
                    // ),
                    ...(questions.flatMap((question, i) => {
                        const isInvalid = invalidStatements?.has(question);
                        return [
                            (i === 0 || (headerRepeatInterval > 0 && i % headerRepeatInterval === 0)) && (
                                <OptionLabels
                                    key={`options-${i}`}
                                    options={options}
                                    oneWordPerLine={oneWordPerLine}
                                    hasQuestion={!!questions} />
                            ),
                            <LikertQuestionRow
                                key={`question-${i}`}
                                selectedResponse={responses[question]}
                                question={question}
                                options={options}
                                onChange={(answer) => onChange(question, answer)}
                                oddRow={i%2===1}
                                isInvalid={isInvalid}
                            />
                        ];
                    }).filter(Boolean) ?? [])
                ].filter(Boolean)
            }
        </View>
    );
}

const styles = StyleSheet.create({
    question: {
        fontSize: 17,
        fontStyle: 'italic',
        minWidth: 50,
    },

    // Grid container and rows
    radioGrid: {
        // rowGap: 20,
        // backgroundColor: '#d3d3d3',
        borderWidth: 1,
        borderColor: 'darkgrey',
        borderRadius: 5,
        padding: 2
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        columnGap: 3,
    },
    likertRow: {
        // padding: 5,
        paddingVertical: 10,
        // borderRadius: 5,
    },
    gridItem: {
        flex: 1,
    },
    // options
    optionsTextContainer: {
        paddingVertical: 5,
        // marginHorizontal: 15,
    },
    oddRow: {
        // backgroundColor: '#b0c4dd',
    },
    evenRow: {
        backgroundColor: 'lightgrey',
    },
    optionsText: {
        textAlign: 'center',
        // fontSize: 16,
        fontWeight: "500",
    },

    // Secondary labels
    secondaryLabelContainer: {
        alignItems: 'center',
    },
    secondaryLabel: {
        width: 70,
    },

    // Radio buttons
    radioButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
