import { ISearchService } from "../../interfaces/ISearchService";
import Locals from "../../providers/Locals";
import { axios, delay } from "../../utils";
var request = require('request');

export class searchService implements ISearchService {
    async perform(index: string, keyword: string): Promise<Array<any>> {
        try {

            const response = await axios({ url: `${Locals.config().SEARCH_ENGINE_URL}&num=${Locals.config().GOOGLE_RESULTS_QUANTITY}&start=${index}&q=${encodeURIComponent(keyword)}` })
            const paragraphs = [];
            if (!response.success) {
                return response;
            }

            await Promise.all(response.body.items.map(async (searchResult, index) => {

                const snippet = searchResult.snippet;
                const pageSource = await searchService.requestPageSource(searchResult.link);
                const paragraph = await searchService.getParagraph(snippet, pageSource);

                paragraphs.push(paragraph)
            }));


            return paragraphs;
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
            let posibleParagraphs = null
            if (matchResult.length > Locals.config().MIN_CHARACTERS) {
                let cleanedSnipped = matchResult.trim();

                let attempts = 0

                while (posibleParagraphs === null) {
                    try {
                        regexWithSniped = new RegExp("(<p(.{0,200})>|<p(.{0,200})>\n|<li>|<li>\n).*?(" + cleanedSnipped + ").*?(<\/p>|\n<\/p>|<\/li>|\n<\/li>)");
                    } catch (error) {
                        break;
                    }

                    posibleParagraphs = pageSource.match(regexWithSniped);

                    if (cleanedSnipped.length > (Locals.config().MIN_CHARACTERS + 1) && posibleParagraphs === null) {
                        const snippetLength = cleanedSnipped.length
                        switch (attempts) {
                            case 0:
                                cleanedSnipped = cleanedSnipped.substring(1, snippetLength - 1);
                                break;

                            case 1:
                                cleanedSnipped = cleanedSnipped.substring(0, snippetLength - 1);
                                break;

                            case 2:
                                cleanedSnipped = cleanedSnipped.substring(1, snippetLength);
                                break;

                            default:
                                break;
                        }

                    } else {

                        if (posibleParagraphs != null) {
                            await Promise.all(posibleParagraphs.map(async (paragraph: any) => {

                                removeHtmlTagsRegexs.forEach(removeTagsRegrex => {
                                    paragraph = paragraph?.replaceAll(removeTagsRegrex, "");
                                });
                                await delay(50);
                                let id = new Date().getTime();
                                const wordCount = paragraph?.split(/\s+/).length;
                                if (paragraph && paragraph !== "" && wordCount > Locals.config().MIN_WORDS_IN_PARAGRAPH && wordCount < Locals.config().MAX_WORDS_IN_PARAGRAPH) {
                                    paragraphs.push({ id, paragraph, wordCount });
                                }

                                return;
                            }));
                        } else {
                            attempts++;
                            if (attempts === 1 || attempts === 2) {
                                cleanedSnipped = matchResult.trim();
                            } else {
                                break;
                            }
                        }
                    }
                }

            }

        }));

        return paragraphs.sort((a, b) => b.wordCount - a.wordCount)[0]
    }
}