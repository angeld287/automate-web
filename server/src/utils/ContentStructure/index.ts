import { INewArticle } from '../../interfaces/Content/Article';

const createContent = (article: INewArticle) => {
    //\n
    //Post Principal Image
    //\n\n\n\n
    //Space Block
    //\n\n\n\n
    //Introduction
    //\n\n\n\n
    //Table Content
    //\n
    //Subtitle
    //\n\n\n\n
    //Subtitle Image (if have)
    //\n\n\n\n
    //Paragraph
    //\n\n\n\n
    //Conclusion Paragraph
    //\n\n\n\n
    //goodbyes and thanks
}

const createSubtitle = (subtitle: string) => {
    return `<h2><span class=\"ez-toc-section\" id=\"${subtitle.replace(" ", "-")}\"></span>${subtitle}<span class=\"ez-toc-section-end\"></span></h2>`
}

const createParagraph = (paragraph: string) => {
    return `<p>${paragraph}</p>`
}

const createTable = (postUrl: string, subtitles: Array<string>) => {
    const firstDiv = `\n<div class="ez-toc-title-container">\n<p class="ez-toc-title">Tabla de Contenido</p>\n<span class="ez-toc-title-toggle"><a href="#" class="ez-toc-pull-right ez-toc-btn ez-toc-btn-xs ez-toc-btn-default ez-toc-toggle" style="display: none;"><label for="item" aria-label="Tabla de contenidos"><i class="ez-toc-glyphicon ez-toc-icon-toggle"></i></label><input type="checkbox" id="item"></a></span></div>\n`
    return `<div id="ez-toc-container" class="ez-toc-v2_0_34 counter-hierarchy ez-toc-counter ez-toc-grey ez-toc-container-direction">${firstDiv}${createTableList(postUrl, subtitles)}</div>`
}

const createTableList = (postUrl: string, subtitles: Array<string>) => {
    subtitles.map(subtitle => `<li class='ez-toc-page-1 ez-toc-heading-level-2'><a class="ez-toc-link ez-toc-heading-1" href="${postUrl}#${subtitle.replace(" ", "-")}" title="${subtitle}">${subtitle}</a></li>`)
    return `<nav><ul class='ez-toc-list ez-toc-list-level-1'>${subtitles.join('')}</ul></nav>`
}

const createImageConteiner = (imageUrl: string, subtitle: string) => {
    return `<div class="wp-block-image"><figure class="aligncenter size-full">${createImage(imageUrl, subtitle)}<figcaption>${subtitle}</figcaption></figure></div>`
}

const createImage = (imageUrl: string, subtitle: string) => {
    return `<img loading="lazy" width="590" height="350" src="${imageUrl}" alt="${subtitle}" class="wp-image-442" srcset="${imageUrl} 590w, ${imageUrl.substr(0, imageUrl.lastIndexOf('.')) }-300x178.webp 300w" sizes="(max-width: 590px) 100vw, 590px" />`
}

const createSpacer = () => {
    return `<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>`
}