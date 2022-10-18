import { ISearchService } from "../../interfaces/ISearchService";
import Locals from "../../providers/Locals";
import { axios, delay } from "../../utils";
var request = require('request');

export class searchService implements ISearchService {
    async perform(index: string, keyword: string): Promise<Array<any>> {
        try {

            const response = await axios({ url: `${Locals.config().SEARCH_ENGINE_URL}&num=${Locals.config().GOOGLE_RESULTS_QUANTITY}&start=${index}&q=${encodeURIComponent(keyword)}` })
            let paragraphsQuantity = 0;
            const paragraphs = [];
            if (!response.success) {
                return response;
            }

            await Promise.all(response.body.items.map(async (searchResult, index) => {

                if (paragraphsQuantity <= Locals.config().NUMBER_OF_PARAGRAPHS_ALLOWED) {
                    const snippet = searchResult.snippet;
                    const pageSource = await searchService.requestPageSource(searchResult.link);
                    if (pageSource.success) {
                        const paragraph = await searchService.getParagraph(snippet, pageSource.response, searchResult.link);
                        paragraphs.push(paragraph)
                        paragraphsQuantity++
                    }
                }

            }));

            return paragraphs;
        } catch (error) {
            throw new Error("Error in search service: " + JSON.stringify(error));
        }
    }

    static async requestPageSource(url: string): Promise<any> {
        try {
            return new Promise(function (resolve, reject) {
                request(url, function (error, response, body) {
                    try {
                        if (error !== null) {
                            resolve({ success: false, error });
                        } else {
                            if (response.body.length < Locals.config().MIN_PAGE_SOURCE_LENGTH) {
                                resolve({ success: false, error: 'Content does not exceed the MIN_PAGE_SOURCE_LENGTH' });
                            } else {
                                resolve({ success: true, response: response.body });
                            }
                        }
                    } catch (error) {
                        reject({ success: false, error });
                    }
                });
            });
        } catch (error) {
            throw new Error("Error in requestPageSource: " + JSON.stringify(error));
        }
    }

    static async getParagraph(snippet: string, pageSource: string, link: string): Promise<Array<string>> {
        try {
            const paragraphs = []
            let regexWithSniped = null;
            let snippetMatchResults = [];
            const getSnippedTextRegexs = [/([^\.]+),([^\.]+)/g, /([^\.]+)(.|,)([^\.]+)/g];
            const removeHtmlTagsRegexs = [
                /(?:<style.+?>.+?<\/style>|<script.+?>.+?<\/script>|<(?:!|\/?[a-zA-Z]+).*?\/?>)/g,
                /(?:\s*\S+\s*{[^}]*})+/g,
                /ath.*?<\/svg/g,
                /ath.*?\/path/g
            ];

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
                                    //This is where the paragraphs are cleaned with the regular expressions of removeHtmlTagsRegexs
                                    removeHtmlTagsRegexs.forEach(removeTagsRegrex => {
                                        paragraph = paragraph?.replaceAll(removeTagsRegrex, "");
                                    });

                                    await delay(50);
                                    let id = new Date().getTime();
                                    const wordCount = paragraph?.split(/\s+/).length;

                                    if (paragraph && paragraph !== "" && wordCount > Locals.config().MIN_WORDS_IN_PARAGRAPH && wordCount < Locals.config().MAX_WORDS_IN_PARAGRAPH) {
                                        paragraphs.push({ id, paragraph, wordCount, link });
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
        } catch (error) {
            throw new Error("Error in getParagraph: " + error);
        }
    }
}