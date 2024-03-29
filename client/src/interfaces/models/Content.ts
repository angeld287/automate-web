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
    type?: 'paragraph' | 'introduction' | 'conclusion' | 'subtitle';
}