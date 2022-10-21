export default interface Paragraph {
    id?: string;
    paragraph: string;
    wordCount: number;
    link: string;
    keyword?: string;
    scenario: SeekerScenario
}

export interface SeekerScenario {
    foundInCase: number;
    found: boolean;
    whyNotFound: string;
    regularExpressionUsed: string;
}