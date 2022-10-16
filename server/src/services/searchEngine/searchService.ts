import { ISearchService } from "../../interfaces/ISearchService";
import Locals from "../../providers/Locals";
import { axios, delay } from "../../utils";
var request = require('request');

export class searchService implements ISearchService {
    async perform(index: string, keyword: string): Promise<Array<any>> {
        try {
            const response = await axios({ url: `${Locals.config().searchEngineUrl}&num=1&start=${index}&q=${encodeURIComponent(keyword)}` })
            if (!response.success) {
                return response;
            }

            await Promise.all(response.body.items.map(async (searchResult, index) => {

                if (index === 0) {
                    const snippet = searchResult.snippet;
                    const htmlSnippet = searchResult.htmlSnippet;
                    const pageSource = await searchService.requestPageSource(searchResult.link);

                    const paragraph = await searchService.getParagraph(snippet, pageSource);

                    console.log(paragraph);



                }
            }));


            return response;
        } catch (error) {
            console.log(error)
        }
    }

    static async requestPageSource(url: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(body);
                } else {
                    reject(error);
                }
            });
        });
    }

    static async getParagraph(snippet: string, pageSource: string): Promise<Array<string>> {

        const paragraphs = []
        let regexWithSniped = null;
        let snippetMatchResults = [];
        const getSnippedTextRegexs = [/([^\.]+),([^\.]+)/g, /([^\.]+)(.|,)([^\.]+)/g];
        const removeHtmlTagsRegexs = [/(?:<style.+?>.+?<\/style>|<script.+?>.+?<\/script>|<(?:!|\/?[a-zA-Z]+).*?\/?>)/g, /(?:\s*\S+\s*{[^}]*})+/g];

        getSnippedTextRegexs.forEach(optimalTextRegex => {
            snippetMatchResults = snippet.match(optimalTextRegex);

            if (optimalTextRegex != null) {
                return false;
            }
        });

        await Promise.all(snippetMatchResults.map(async (matchResult: string) => {
            let posibleParagraph = null
            if (matchResult.length > 14) {
                let cleanedMatchResult = matchResult.trim();
                let attempts = 0

                while (posibleParagraph === null) {
                    try {
                        regexWithSniped = new RegExp("(<p(.{0,200})>|<p(.{0,200})>\n|<li>|<li>\n).*?(" + cleanedMatchResult + ").*?(<\/p>|\n<\/p>|<\/li>|\n<\/li>)");
                    } catch (error) {
                        break;
                    }

                    posibleParagraph = pageSource.match(regexWithSniped);

                    if (cleanedMatchResult.length > 15 && posibleParagraph === null) {
                        const snippetLength = cleanedMatchResult.length
                        switch (attempts) {
                            case 0:
                                cleanedMatchResult = cleanedMatchResult.substring(1, snippetLength - 1);
                                break;

                            case 1:
                                cleanedMatchResult = cleanedMatchResult.substring(0, snippetLength - 1);
                                break;

                            case 2:
                                cleanedMatchResult = cleanedMatchResult.substring(1, snippetLength);
                                break;

                            default:
                                break;
                        }

                    } else {

                        if (posibleParagraph != null) {
                            await Promise.all(posibleParagraph.map(async (paragraph: any) => {

                                removeHtmlTagsRegexs.forEach(removeTagsRegrex => {
                                    paragraph = paragraph?.replaceAll(removeTagsRegrex, "");
                                });
                                await delay(50);
                                let ts = new Date().getTime();
                                paragraphs.push({ id: ts, text: paragraph });
                                return
                            }));
                        }
                    }
                }

            }
        }));

        return paragraphs
    }
}