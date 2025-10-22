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
    'select';

export type SurveyDataType = string | number | boolean | Date | null | Record<string, string>;

export interface DisplayCondition {
    key: string
    value: SurveyDataType
}

export interface BasicSurveyQuestion {
    question: string;
    type: SurveyQuestionType;
    required?: boolean;
    key: string;
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

export interface SelectQuestion extends BasicSurveyQuestion {
    type: 'radio' | 'select';
    options: string[];
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
}

export interface LikertGridQuestion extends BasicSurveyQuestion {
    type: 'likertGrid';
    name: string;
    options: string[];
    statements: string[];
}

export type SingleInputQuestion = TextQuestion | TimeQuestion | SelectQuestion | CheckboxQuestion | SliderQuestion;

export type SurveyQuestion = SingleInputQuestion | LikertGridQuestion;
