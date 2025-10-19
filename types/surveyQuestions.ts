export type SurveyQuestionType =
    'number' |
    'text' |
    'multiline' |
    'time' |
    'lengthOfTime' |
    'radio' |
    'likertGrid';

export type SurveyDataType = string | number | boolean | Date | null | Record<string, string>;

export interface BasicSurveyQuestion {
    question: string;
    type: SurveyQuestionType;
    required?: boolean;
    response: SurveyDataType;
}

interface TextQuestion extends BasicSurveyQuestion {
    type: 'number' | 'text' | 'multiline';
    placeholder?: string;
    response: string
}

export interface TimeQuestion extends BasicSurveyQuestion {
    type: 'time' | 'lengthOfTime';
    min?: string;
    max?: string;
    response: Date
}

export interface RadioQuestion extends BasicSurveyQuestion {
    type: 'radio';
    options: string[];
    response: string
}

export interface LikertGridQuestion extends BasicSurveyQuestion {
    type: 'likertGrid';
    name: string;
    options: string[];
    statements: string[];
    response: Record<string, string>;
}

export type SingleInputQuestion = TextQuestion | TimeQuestion | RadioQuestion;

export type SurveyQuestion = SingleInputQuestion | LikertGridQuestion;
