import { INewArticle, SubTitleContent } from '../../interfaces/Content/Article';
import IContent from '../../interfaces/models/Content';
import Locals from '../../providers/Locals';

const createContent = (article: INewArticle): string => {
    const postUrl = `https://${Locals.config().WP_DOMAIN}/${article.category.trim()}/${article.title.trim().toLowerCase().replace(' ', '-')}/`
    //\n
    //Post Principal Image
    const space = createSpacer();
    const mainImage: string = createMainImage(article.title.trim(), article.image.source_url.trim());
    //\n\n\n\n
    //Space Block
    //\n\n\n\n
    //Introduction
    const intro: string = createParagraph(article.contents.filter(content => content.type && content.type.trim() === 'introduction'))
    //\n\n\n\n
    //Table Content
    //const contentTable = createTable(postUrl, article.subtitles);
    //\n

    const body: string = article.subtitles.sort((a, b) => a.orderNumber < b.orderNumber ? -1 : 1).map(subtitleObj => {
        //Subtitle
        const subtitle: string = createSubtitle(subtitleObj.name.trim())
        //\n\n\n\n
        //Subtitle Image (if have)
        const image: string = subtitleObj.image ? `${createMainImage(subtitleObj.image.title.trim(),  subtitleObj.image.source_url.trim())}\n\n\n\n` : "";
        //\n\n\n\n
        //Paragraph
        const paragraph: string = createParagraph(subtitleObj.content.filter(content => content.selected))
        //\n\n\n\n

        return `${space}${subtitle}\n\n\n\n${image}${paragraph}\n\n\n\n`
    }).join('');

    //Conclusion Paragraph
    const conclusion: string = createParagraph(article.contents.filter(content => content.type && content.type.trim() === 'conclusion'))
    //\n\n\n\n
    //goodbyes and thanks
    return `\n${mainImage}\n\n\n\n${space}\n\n\n\n${intro}\n\n\n\n${body}${space}\n\n\n\n${conclusion}`;
}

const createSubtitle = (subtitle: string): string => {
    return `<h2><span class=\"ez-toc-section\" id=\"${subtitle.replace(" ", "-")}\"></span>${subtitle}<span class=\"ez-toc-section-end\"></span></h2>`
}

const createParagraph = (paragraphs: Array<IContent>): string => {
    return paragraphs.sort((a, b) => !a.orderNumber || !b.orderNumber ? 1 : a.orderNumber < b.orderNumber ? -1 : 1).map(paragraph => `<p>${paragraph.content}</p>`).join('\n\n\n\n');
}

const createTable = (postUrl: string, subtitles: Array<SubTitleContent>): string => {
    const tableContentBtn = `<div class= \"ez-toc-title-container\">\n<p class= \"ez-toc-title\">Tabla de Contenido</p>\n<span class= \"ez-toc-title-toggle\"><a href= \"#\" class= \"ez-toc-pull-right ez-toc-btn ez-toc-btn-xs ez-toc-btn-default ez-toc-toggle\" area-label= \"ez-toc-toggle-icon-1\"><label for= \"item-63f003134e086\" aria-label= \"Tabla de contenidos\"><span style= \"display: flex;align-items: center;width: 35px;height: 30px;justify-content: center;direction:ltr;\"><svg style= \"fill: #999;color:#999\" xmlns= \"http://www.w3.org/2000/svg\" class= \"list-377408\" width= \"20px\" height= \"20px\" viewBox= \"0 0 24 24\" fill= \"none\"><path d= \"M6 6H4v2h2V6zm14 0H8v2h12V6zM4 11h2v2H4v-2zm16 0H8v2h12v-2zM4 16h2v2H4v-2zm16 0H8v2h12v-2z\" fill= \"currentColor\"></path></svg><svg style= \"fill: #999;color:#999\" class= \"arrow-unsorted-368013\" xmlns= \"http://www.w3.org/2000/svg\" width= \"10px\" height= \"10px\" viewBox= \"0 0 24 24\" version= \"1.2\" baseProfile= \"tiny\"><path d= \"M18.2 9.3l-6.2-6.3-6.2 6.3c-.2.2-.3.4-.3.7s.1.5.3.7c.2.2.4.3.7.3h11c.3 0 .5-.1.7-.3.2-.2.3-.5.3-.7s-.1-.5-.3-.7zM5.8 14.7l6.2 6.3 6.2-6.3c.2-.2.3-.5.3-.7s-.1-.5-.3-.7c-.2-.2-.4-.3-.7-.3h-11c-.3 0-.5.1-.7.3-.2.2-.3.5-.3.7s.1.5.3.7z\" /></svg></span></label><input type= \"checkbox\" id= \"item-63f003134e086\"></a></span></div>`;
    const subtitlesList = `<nav><ul class='ez-toc-list ez-toc-list-level-1 eztoc-visibility-hide-by-default'>${
        subtitles.map(subtitle => `<li class='ez-toc-page-1 ez-toc-heading-level-2'><a class= \"ez-toc-link ez-toc-heading-1\" href= \"${postUrl}#${subtitle.name.replace(' ', '-')}\" title= \"${subtitle.name}\">${subtitle.name}</a></li>`).join('')
    }</ul></nav>`
    return `<div id= \"ez-toc-container\" class= \"ez-toc-v2_0_40 counter-hierarchy ez-toc-counter ez-toc-grey ez-toc-container-direction\">\n${tableContentBtn}\n${subtitlesList}</div>\n`
}

const createImageConteiner = (imageUrl: string, subtitle: string) => {
    return `<div class=\"wp-block-image\"><figure class=\"aligncenter size-large\"><img loading=\"lazy\" width=\"1024\" height=\"576\" src=\"${imageUrl}\" alt=\"${subtitle}\" class=\"wp-image-449\" srcset=\"${imageUrl.replace('.webp', '')}-1024x576.webp 1024w, ${imageUrl.replace('.webp', '')}-300x169.webp 300w, ${imageUrl.replace('.webp', '')}-768x432.webp 768w, ${imageUrl} 1280w\" sizes=\"(max-width: 1024px) 100vw, 1024px\" /><figcaption>${subtitle}</figcaption></figure></div>`
}

const createSpacer = (): string => {
    return `<div style=\"height:100px\" aria-hidden=\"true\" class=\"wp-block-spacer\"></div>`
}

const createMainImage = (title: string, image: string): string => {
    return `<div class=\"wp-block-image\"><figure class=\"aligncenter size-full\"><img loading=\"lazy\" width=\"590\" height=\"350\" src=\"${image}\" alt=\"${title}\" class=\"wp-image-442\" srcset=\"${image} 590w, ${image.replace('.webp', '')}-300x178.webp 300w\" sizes=\"(max-width: 590px) 100vw, 590px\" /><figcaption>${title}</figcaption></figure></div>`
}



export default createContent;