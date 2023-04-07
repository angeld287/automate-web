export default interface Content {
    id?: number;
    orderNumber?: number;
    wordsCount?: number;
    link?: string;
    content: string;
    selected: boolean;
    contentLanguage: string;
    subtitleId?: number;
    articleId?: number;
    deleted?: boolean;
    type?: 'paragraph' | 'introduction' | 'conclusion' | 'subtitle';
}