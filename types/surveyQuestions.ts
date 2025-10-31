import {NullableStringRecord} from "@/types/trackExperimentState";

// TODO: rename these from survey QUESTION to COMPONENT - many are display only or tasks in themselves at this point
export type SurveyQuestionType =
    'number' |
    'text' |
    'multiline' |
    'time' |
    'lengthOfTime' |
    'radio' |
    'likertGrid' |
    'checkbox' |
    'slider' |
    'select' |
    'likertSingle' |
    'audio';

export type SurveyDataType = string | number | boolean | null | NullableStringRecord;

export interface DisplayCondition {
    key: string
    value: SurveyDataType
}

export interface BasicSurveyQuestion {
    key: string;
    question: string;

    type: SurveyQuestionType;
    required?: boolean;
    default?: SurveyDataType;
    conditions?: DisplayCondition[];
}

interface TextQuestion extends BasicSurveyQuestion {
    type: 'number' | 'text' | 'multiline';
    placeholder?: string;
}

export interface TimeQuestion extends BasicSurveyQuestion {
    type: 'time' | 'lengthOfTime';
    min?: string;
    max?: string;
}

export interface RadioQuestion extends BasicSurveyQuestion {
    type: 'radio';
    options: string[];
}

export interface SelectQuestion extends BasicSurveyQuestion {
    type: 'select';
    options: Record<string, string[]>;
    multiple?: boolean;
}

export interface CheckboxQuestion extends BasicSurveyQuestion {
    type: 'checkbox';
    label: string;
}

export interface SliderQuestion extends BasicSurveyQuestion {
    type: 'slider';
    min?: number;
    max?: number;
    step?: number;
    showValue?: boolean;
    labels?: string[];
    units?: string;
}

export interface LikertGridQuestion extends BasicSurveyQuestion {
    type: 'likertGrid';
    name?: string; // TODO: not sure I've actually used this anywhere?
    options: string[];
    statements: string[];
}

export interface LikertSingleQuestion extends BasicSurveyQuestion {
    type: 'likertSingle';
    options: string[];
    labels?: string[];
    oneWordPerLine?: boolean;
}

// TODO: maybe audio should be a question actually? allows for storing if listened to, requiring that, etc.
export interface Audio extends BasicSurveyQuestion {
    type: 'audio';
    filepath: string;
    instructions?: string|string[];
    containerStyle?: object;
    textStyle?: object;
}

// DISPLAY TYPES ******
type SurveyDisplayType = 'paragraph' | 'picture' | 'video'

interface BasicSurveyDisplay {
    type: SurveyDisplayType;
}

export interface ParagraphDisplay extends BasicSurveyDisplay {
    type: SurveyDisplayType;
    text: string|string[];
    title?: string;
    containerStyle?: object;
    textStyle?: object;
}

type SurveyDisplayOnly = ParagraphDisplay; // Add picture
export type SingleInputQuestion = TextQuestion | TimeQuestion | SelectQuestion | CheckboxQuestion |
    SliderQuestion | RadioQuestion | LikertSingleQuestion ;
export type SurveyQuestion = SingleInputQuestion | LikertGridQuestion;
export type SurveyComponent = SurveyQuestion | SurveyDisplayOnly;
