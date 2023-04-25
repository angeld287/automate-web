export default interface Media {
    date?: string;
    date_gmt?: string;
    guid?: string;
    id?: string;
    link?: string;
    modified?: string;
    modified_gmt?: string;
    slug?: string;
    status?: string;
    type?: string;
    permalink_template?: string;
    generated_slug?: string;
    title: string;
    author?: string;
    comment_status?: string;
    ping_status?: string;
    meta?: string;
    template?: string;
    alt_text?: string;
    caption?: string;
    description?: string;
    media_type?: string;
    mime_type?: string;
    media_details?: string;
    post?: string;
    source_url: string;
    missing_image_sizes?: string;
}

export interface DbMedia extends Media{
    wpId: string;
    subtitleId?: number;
    articleId?: number;
    deleted?: boolean;
    orderNumber?: string;
}

export interface GoogleMedia {
    link: string;
    thumbnailLink: string;
}