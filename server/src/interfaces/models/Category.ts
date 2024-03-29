export default interface Category {
    id?: number;
    count?: number;
    description?: string;
    link?: string;
    name: string;
    slug?: string;
    taxonomy?: string;
    parent?: number;
    meta?: any;
    wpId?: number;
    siteId: number;
}