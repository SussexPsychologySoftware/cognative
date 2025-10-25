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
    'likertSingle';

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
    labels?: string[];
}

export interface LikertGridQuestion extends BasicSurveyQuestion {
    type: 'likertGrid';
    name: string;
    options: string[];
    statements: string[];
}

export interface LikertSingleQuestion extends BasicSurveyQuestion {
    type: 'likertSingle';
    options: string[];
    labels: string[];
}

export type SingleInputQuestion = TextQuestion | TimeQuestion | SelectQuestion | CheckboxQuestion | SliderQuestion | RadioQuestion | LikertSingleQuestion;

export type SurveyQuestion = SingleInputQuestion | LikertGridQuestion;
