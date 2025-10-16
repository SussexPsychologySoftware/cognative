export type SurveyQuestionType =
    'number' |
    'text' |
    'multiline' |
    'time' |
    'lengthOfTime' |
    'radio' |
    'likertGrid';

export type SurveyDataType = string | number | boolean | Date | null;

export interface BasicSurveyQuestion {
    question: string;
    type: SurveyQuestionType;
    required?: boolean;
    default?: any; // or SurveyDataType but gets annoying including it everywhere
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

export interface LikertGridQuestion {
    type: 'likertGrid';
    name: string;
    options: string[];
    questions: string[];
}

export type SingleInputQuestion = TextQuestion | TimeQuestion | RadioQuestion;

export type SurveyQuestion = SingleInputQuestion | LikertGridQuestion;
