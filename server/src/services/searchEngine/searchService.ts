import { ISearchService } from "../../interfaces/ISearchService";
import Paragraph, { SeekerScenario } from "../../interfaces/models/Paragraph";
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
                const ca = Locals.config().NUMBER_OF_PARAGRAPHS_ALLOWED;
                if (paragraphsQuantity <= ca) {
                    const snippet = searchResult.snippet;
                    const pageSource = await searchService.requestPageSource(searchResult.link);
                    if (pageSource.success) {
                        const paragraph = await searchService.getParagraph(snippet, pageSource.response, searchResult.link, keyword);
                        console.log(paragraph)
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

    static async getParagraph(snippet: string, pageSource: string, link: string, keyword: string): Promise<Paragraph> {
        try {
            let paragraph: Paragraph = {
                link,
                paragraph: "",
                wordCount: 0,
                keyword,
                scenario: {
                    foundInCase: 0,
                    found: false,
                    regularExpressionUsed: "",
                    whyNotFound: ""
                }
            }

            let regexWithSniped = null;
            let regrexLeft = "(<p(.{0,200})>|<p(.{0,200})>\n|<li>|<li>\n).*?(";
            let regrexRight = ").*?(<\/p>|\n<\/p>|<\/li>|\n<\/li>)";

            const minCharacters = Locals.config().MIN_CHARACTERS;
            const minCharactersMessage = `the length of the snipped is less than required - Required: ${minCharacters} - Snipped Length:`;

            let specialCondition: boolean = true;

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
                let paragraphMatchResults = null
                if (matchResult.length > minCharacters) {
                    let cleanedSnipped = matchResult.trim();

                    let attempts = 0
                    let oneAttempt = 0

                    while (paragraphMatchResults === null) {
                        try {
                            regexWithSniped = new RegExp(`${regrexLeft}${cleanedSnipped}${regrexRight}`);
                        } catch (error) {
                            paragraph.scenario = { ...paragraph.scenario, regularExpressionUsed: regexWithSniped, found: false, whyNotFound: JSON.stringify(error) } as SeekerScenario
                            break;
                        }

                        paragraphMatchResults = pageSource.match(regexWithSniped);

                        if (specialCondition && paragraphMatchResults === null) {
                            const snippetLength = cleanedSnipped.length
                            paragraph.scenario = { ...paragraph.scenario, foundInCase: attempts, regularExpressionUsed: regexWithSniped } as SeekerScenario

                            switch (attempts) {
                                case 0:
                                    cleanedSnipped = cleanedSnipped.substring(1, snippetLength - 1);
                                    specialCondition = cleanedSnipped.length > (minCharacters + 1);

                                    if (!specialCondition)
                                        paragraph.scenario = { ...paragraph.scenario, whyNotFound: `${minCharactersMessage} ${cleanedSnipped.length}` } as SeekerScenario

                                    break;

                                case 1:
                                    cleanedSnipped = cleanedSnipped.substring(0, snippetLength - 1);
                                    specialCondition = cleanedSnipped.length > (minCharacters + 1);

                                    if (!specialCondition)
                                        paragraph.scenario = { ...paragraph.scenario, whyNotFound: `${minCharactersMessage} ${cleanedSnipped.length}` } as SeekerScenario

                                    break;

                                case 2:
                                    cleanedSnipped = cleanedSnipped.substring(1, snippetLength);
                                    specialCondition = cleanedSnipped.length > (minCharacters + 1);

                                    if (!specialCondition)
                                        paragraph.scenario = { ...paragraph.scenario, whyNotFound: `${minCharactersMessage} ${cleanedSnipped.length}` } as SeekerScenario

                                    break;

                                case 3:
                                    regrexLeft = '(<meta).*?(';
                                    regrexRight = ').*?(")';
                                    specialCondition = oneAttempt < 1
                                    oneAttempt++
                                    break;

                                default:
                                    break;
                            }

                        } else {

                            if (paragraphMatchResults != null) {
                                //const regresnip = regexWithSniped
                                //const snipped = matchResult
                                //const _cleanedSnipped = cleanedSnipped
                                //const fullSnipped = snippet
                                //const k = keyword;
                                //let paragraph = "";

                                //const ps = paragraph;


                                const htmlParagraph: string = paragraphMatchResults[0];
                                let splitParagraphs: Array<string> = []

                                //htmlParagraph: es el que encontro arriba.
                                //El cual fue encontrado con la expresion regular "regexWithSniped" la cual contiene el texto "cleanedSnipped"

                                //despues de remover el html del parrafo encontrado y ceparar los textos el snipped no es encontrado en algunos casos

                                splitParagraphs = htmlParagraph.replace(removeHtmlTagsRegexs[0], "|").split("|").filter(text => text !== " " && text !== "").reverse();

                                await Promise.all(splitParagraphs.map(async (paragraphText: any) => {
                                    const isMatch = paragraphText.match(cleanedSnipped);

                                    if (isMatch !== null) {
                                        const wordCount = paragraphText?.split(/\s+/).length;
                                        paragraph = {
                                            ...paragraph,
                                            paragraph: paragraphText,
                                            wordCount,
                                            scenario: {
                                                ...paragraph.scenario,
                                                found: true,
                                                whyNotFound: ""
                                            }
                                        };
                                    }
                                }));

                                break;

                            } else {
                                attempts++;
                                if (attempts === 1 || attempts === 2 || attempts === 3) {
                                    cleanedSnipped = matchResult.trim();
                                    if (attempts > 2) {
                                        specialCondition = true;
                                    }
                                } else {
                                    paragraph.scenario = { ...paragraph.scenario, found: false } as SeekerScenario
                                    break;
                                }
                            }
                        }
                    }

                }

            }));

            return paragraph
        } catch (error) {
            throw new Error("Error in getParagraph: " + error);
        }
    }
}