import {NullableStringRecord} from "@/types/trackExperimentState";

// -*#*-*#*- SURVEY COMPONENTS -*#*-*#*-
export type SurveyDisplayType = 'paragraph' | 'picture' | 'video'
export const displayOnlyTypes = ['paragraph', 'picture', 'video'];

export type SurveyInputType =
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

export interface DisplayCondition {
    key: string
    value: SurveyDataType
}

export interface SurveyComponentBase {
    key: string; // The unique identifier
    type: SurveyInputType | SurveyDisplayType; // The discriminator
    conditions?: DisplayCondition[];
}

// -*#*- SURVEY QUESTIONS -*#*-
export type SurveyDataType = string | number | boolean | null | NullableStringRecord;

export interface SurveyInputBase extends SurveyComponentBase {
    type: SurveyInputType;
    question: string; // The prompt/label for the input
    required?: boolean;
    default?: SurveyDataType;
}

export interface TextQuestion extends SurveyInputBase {
    type: 'number' | 'text' | 'multiline';
    placeholder?: string;
}

export interface TimeQuestion extends SurveyInputBase {
    type: 'time' | 'lengthOfTime';
    min?: string;
    max?: string;
}

export interface RadioQuestion extends SurveyInputBase {
    type: 'radio';
    options: string[];
}

export interface SelectQuestion extends SurveyInputBase {
    type: 'select';
    options: Record<string, string[]>;
    multiple?: boolean;
}

export interface CheckboxQuestion extends SurveyInputBase {
    type: 'checkbox';
    label: string;
}

export interface SliderQuestion extends SurveyInputBase {
    type: 'slider';
    min?: number;
    max?: number;
    step?: number;
    showValue?: boolean;
    labels?: string[];
    units?: string;
}

export interface LikertGridQuestion extends SurveyInputBase {
    type: 'likertGrid';
    name?: string; // TODO: not sure I've actually used this anywhere?
    options: string[];
    statements: string[];
}

export interface LikertSingleQuestion extends SurveyInputBase {
    type: 'likertSingle';
    options: string[];
    labels?: string[];
    oneWordPerLine?: boolean;
}

export interface Audio extends SurveyInputBase {
    type: 'audio';
    file: number;
    instructions?: string|string[];
    resetOnPause?: boolean;
    volume?: number;
    containerStyle?: object;
    textStyle?: object;
}

// -*#*- SURVEY DISPLAY ONLY -*#*-
export interface SurveyDisplayBase extends SurveyComponentBase {
    type: SurveyDisplayType;
}

export interface ParagraphDisplay extends SurveyDisplayBase {
    type: 'paragraph';
    text: string|string[];
    title?: string; // This is used instead of 'question'
    containerStyle?: object;
    textStyle?: object;
}

type SurveyDisplayOnly = ParagraphDisplay; // Add picture

export type SingleInputQuestion = TextQuestion | TimeQuestion | SelectQuestion | CheckboxQuestion |
    SliderQuestion | RadioQuestion | LikertSingleQuestion | Audio;
export type SurveyQuestion = SingleInputQuestion | LikertGridQuestion;
export type SurveyComponent = SurveyQuestion | SurveyDisplayOnly;
