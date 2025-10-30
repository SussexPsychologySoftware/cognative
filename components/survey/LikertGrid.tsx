import { View, Pressable, Text, StyleSheet } from 'react-native';
import { globalStyles } from "@/styles/appStyles";
import Radio from "@/components/inputParts/Radio";
import Labels from "@/components/inputParts/Labels";

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
                    oddRow ? styles.oddRow : styles.evenRow,
                ]}>
                    {question}
                </Text>
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
        oneWordPerLine,
        headerRepeatInterval=0,
        invalidStatements
    }:
    {
        responses: Record<string, string>, // Just this grid's responses: { statement0: 'answer', statement1: 'answer' }
        questions: string[], // The statements
        options: string[], // Likert scale options
        onChange: (statementKey: string, answer: string) => void,
        headerRepeatInterval?: number,
        oneWordPerLine?: boolean,
        invalidStatements?: Set<string>
    }) {
    return (
        <View style={styles.radioGrid}>
            {
                questions.map((question, i) => {
                        return [
                            (i === 0 || (headerRepeatInterval > 0 && i % headerRepeatInterval === 0)) && (
                                <Labels
                                    key={`options-${i}`}
                                    labels={options}
                                    oneWordPerLine={oneWordPerLine}
                                    prependEmptyMinWidth={questions.length ? 55 : 0} // Empty question with same min width
                                />
                            ),
                            <LikertQuestionRow
                                key={`question-${i}`}
                                selectedResponse={responses[question]}
                                question={question}
                                options={options}
                                onChange={(answer) => onChange(question, answer)}
                                oddRow={i%2===1}
                                isInvalid={invalidStatements?.has(question)}
                            />
                        ];
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    question: {
        fontSize: 17,
        fontStyle: 'italic',
        minWidth: 50,
        paddingLeft: 5,
    },

    // Grid container and rows
    radioGrid: {
        // rowGap: 20,
        // backgroundColor: '#d3d3d3',
        borderWidth: 1,
        borderColor: 'darkgrey',
        borderRadius: 5,
        // padding: 2
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
    optionsText: {
        textAlign: 'center',
        // fontSize: 16,
        fontWeight: "500",
    },
    oddRow: {
        // backgroundColor: '#b0c4dd',
    },
    evenRow: {
        backgroundColor: 'lightgrey',
        color: 'black',
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
