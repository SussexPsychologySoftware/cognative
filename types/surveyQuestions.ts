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

interface OverwriteParametersOptions {
    parameter: string, // a param/key from that input type's interface
    task_id: string,
    day?: number,
    response_key: string // likely just question_id you want to retrieve response from
}

export interface SurveyComponentBase {
    key: string; // The unique identifier
    type: SurveyInputType | SurveyDisplayType; // The discriminator
    conditions?: DisplayCondition[];
    overwrite_parameter_from_storage?: OverwriteParametersOptions[]
}

// -*#*- SURVEY QUESTIONS -*#*-
export type SurveyDataType = string | number | boolean | null | NullableStringRecord;

export interface SurveyInputBase extends SurveyComponentBase {
    type: SurveyInputType;
    question: string; // The prompt/label for the input
    required?: boolean;
    default?: SurveyDataType; // TODO: handle the implementation of this across input types
}

export interface TextQuestion extends SurveyInputBase {
    type: 'number' | 'text' | 'multiline';
    placeholder?: string;
    maxLength?: number;
    default?: string;
}

export interface TimeQuestion extends SurveyInputBase {
    type: 'time' | 'lengthOfTime';
    min?: string;
    max?: string;
    default?: string;
}

export interface RadioQuestion extends SurveyInputBase {
    type: 'radio';
    options: string[];
    default?: string
}

export interface SelectQuestion extends SurveyInputBase {
    type: 'select';
    options: Record<string, string[]>;
    multiple?: boolean;
    default?: string;
}

export interface CheckboxQuestion extends SurveyInputBase {
    type: 'checkbox';
    label: string;
    default?: boolean;
}

export interface SliderQuestion extends SurveyInputBase {
    type: 'slider';
    min?: number;
    max?: number;
    step?: number;
    showValue?: boolean;
    labels?: string[];
    units?: string;
    default?: number;
}

export interface LikertGridQuestion extends SurveyInputBase {
    type: 'likertGrid';
    name?: string; // TODO: not sure I've actually used this anywhere?
    options: string[];
    statements: string[];
    default?: NullableStringRecord;
}

export interface LikertSingleQuestion extends SurveyInputBase {
    type: 'likertSingle';
    options: string[];
    labels?: string[];
    oneWordPerLine?: boolean;
    default?: string;
}

export interface AudioQuestion extends SurveyInputBase {
    type: 'audio';
    file: number;
    resetOnPause?: boolean;
    volume?: number;
    volumeControls?: boolean;
    default?: boolean
}

// -*#*- SURVEY DISPLAY ONLY -*#*-
export interface SurveyDisplayBase extends SurveyComponentBase {
    type: SurveyDisplayType;
}

export interface ParagraphDisplay extends SurveyDisplayBase {
    type: 'paragraph';
    text?: string|string[];
    title?: string; // This is used instead of 'question'
    containerStyle?: object;
    textStyle?: object;
    titleStyle?: object;
}

export interface Picture extends SurveyDisplayBase {
    type: 'picture';
    file: number;
    caption?: string;
    width?: number;
    height?: number;
    imageStyle?: object;
    captionStyle?: object;
}

type SurveyDisplayOnly = ParagraphDisplay | Picture;

export type SingleInputQuestion = TextQuestion | TimeQuestion | SelectQuestion | CheckboxQuestion |
    SliderQuestion | RadioQuestion | LikertSingleQuestion | AudioQuestion;
export type SurveyQuestion = SingleInputQuestion | LikertGridQuestion;
export type SurveyComponent = SurveyQuestion | SurveyDisplayOnly;
