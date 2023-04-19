import { ISearchService } from "../../interfaces/ISearchService";
import IKeyword from "../../interfaces/models/Keyword";
import { GoogleMedia } from "../../interfaces/models/Media";
import Paragraph, { SeekerScenario } from "../../interfaces/models/Paragraph";
import { IResultsAndSuggestions, IKeywordPotential } from "../../interfaces/response/ISearchKeyword";
import Locals from "../../providers/Locals";
import { axios, replacePlusForSpace, replaceSpaceForPlus } from "../../utils";
var request = require('request');

export class searchService implements ISearchService {
    async perform(index: string, keyword: string): Promise<Array<any>> {
        try {

            const response = await axios({ url: `${Locals.config().SEARCH_ENGINE_URL}&num=${Locals.config().GOOGLE_RESULTS_QUANTITY}&start=${index}&q=${encodeURIComponent(keyword)}` })
            let paragraphsQuantity = 0;
            const paragraphs: Array<Paragraph> = [];
            if (!response.success) {
                return response;
            }

            const resultsList = response.body.items;

            for (let index = 0; index < resultsList.length; index++) {
                const searchResult = resultsList[index];
                if (paragraphsQuantity <= Locals.config().NUMBER_OF_PARAGRAPHS_ALLOWED) {
                    const snippet = searchResult.snippet;
                    const pageSource = await searchService.requestPageSource(searchResult.link);
                    if (pageSource.success) {
                        const snippedParagraphs = await searchService.getParagraph(snippet, pageSource.response, searchResult.link, keyword);
                        paragraphs.push(...snippedParagraphs)
                        paragraphsQuantity++
                    }
                }
            }

            //await Promise.all(response.body.items.map(async (searchResult, index) => {}));
            //console.log(paragraphs.filter(para => para.scenario.foundInCase === 4))
            //console.log(paragraphs.filter(para => para.scenario.foundInCase !== 4))

            return paragraphs;
        } catch (error) {
            throw new Error("Error in search service: " + JSON.stringify(error));
        }
    }

    async searchImages(index: string, keyword: string): Promise<Array<GoogleMedia>> {
        try {

            const response = await axios({ url: `${Locals.config().SEARCH_ENGINE_URL}&num=${Locals.config().GOOGLE_RESULTS_QUANTITY}&start=${index}&q=${encodeURIComponent(keyword)}&searchType=image` })
            if (!response.success) {
                return response;
            }

            return response.body.items.map((item): GoogleMedia => ({link: item.link, thumbnailLink: item.image.thumbnailLink}));
        } catch (error) {
            throw new Error("Error in search service: " + JSON.stringify(error));
        }
    }

    async getResultsAndSuggestions(keyword: string): Promise<IResultsAndSuggestions>{
        try {
            const searchResponse = await axios({ url: `${Locals.config().SEARCH_ENGINE_URL}&num=${Locals.config().GOOGLE_RESULTS_QUANTITY}&start=1&q=${encodeURIComponent(keyword)}` })
            const googleSearchHtmlPage = await searchService.requestPageSource(`https://www.google.com/search?q=${replaceSpaceForPlus(keyword)}`);

            const regrexGetRelatedSearch = new RegExp(/search\?ie=UTF-8&amp;q=(.*?)&amp;sa=/g);
            let relatedSearchKeywords: Array<string> = googleSearchHtmlPage.response.match(regrexGetRelatedSearch);

            if(relatedSearchKeywords !== null){
                relatedSearchKeywords = relatedSearchKeywords.map(keyword => replacePlusForSpace(decodeURI(keyword.replace(/search\?ie=UTF-8&amp;q=/g, '').replace(/&amp;sa=/g, ''))))
            }
   
            return {
                searchResult: searchResponse.body.items,
                relatedSearch: relatedSearchKeywords !== null ? relatedSearchKeywords.map((keyword): IKeyword => ({name: keyword})) : []
            };
        } catch (error) {
            console.log(error);
            throw new Error("Error in getResultsAndSuggestions service.");
        }
    }

    async checkKeywordPotential(): Promise<IKeywordPotential>{
        try {
            
            return {}
        } catch (error) {
            console.log(error);
            throw new Error("Error in checkKeywordPotential service.");
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

    static async getParagraph(snippet: string, pageSource: string, link: string, keyword: string): Promise<Array<Paragraph>> {
        try {

            const paragraphs: Array<Paragraph> = []
            let regexWithSniped = null;
            let regrexLeft = "(<p(.{0,200})>|<p(.{0,200})>\n|<li>|<li>\n).*?(";
            let regrexRight = ").*?(<\/p>|\n<\/p>|<\/li>|\n<\/li>)";

            const minWordsInSnipped = Locals.config().MIN_WORDS_IN_SNIPPED;
            const minWordsInSnippedMessage = `The minimum of words in the snipped is less than required - Required: ${minWordsInSnipped + 1} - Snipped words count:`;

            let specialCondition: boolean = true;

            let snippetMatchResults = [];
            const getSnippedTextRegexs = [/([^\.]+),([^\.]+)/g, /([^\.]+)(.|,)([^\.]+)/g];
            const removeHtmlTagsRegexs = [
                /(?:<style.+?>.+?<\/style>|<script.+?>.+?<\/script>|<(?:!|\/?[a-zA-Z]+).*?\/?>)/g,
                /(?:\s*\S+\s*{[^}]*})+/g,
                /ath.*?<\/svg/g,
                /ath.*?\/path/g,
                /<meta name="description" content="/g
            ];

            getSnippedTextRegexs.forEach(optimalTextRegex => {
                snippetMatchResults = snippet.match(optimalTextRegex);
                if (optimalTextRegex != null) {
                    return false;
                }
            });

            await Promise.all(snippetMatchResults.map(async (matchResult: string) => {
                let paragraphMatchResults = null

                let paragraph: Paragraph = {
                    link,
                    paragraph: "",
                    wordCount: 0,
                    keyword,
                    scenario: {
                        foundInCase: 99,
                        found: false,
                        regularExpressionUsed: "",
                        whyNotFound: ""
                    }
                }

                if (matchResult.split(/\s+/).length > minWordsInSnipped) {
                    let cleanedSnipped = matchResult.trim();

                    let attempts = 0
                    let oneAttempt = 0

                    while (paragraphMatchResults === null) {
                        try {
                            regexWithSniped = new RegExp(`${regrexLeft}${cleanedSnipped}${regrexRight}`);
                            paragraph.scenario = { ...paragraph.scenario, foundInCase: attempts, regularExpressionUsed: regexWithSniped } as SeekerScenario
                        } catch (error) {
                            paragraph.scenario = { ...paragraph.scenario, regularExpressionUsed: regexWithSniped, found: false, whyNotFound: JSON.stringify(error) } as SeekerScenario
                            break;
                        }

                        paragraphMatchResults = pageSource.match(regexWithSniped);

                        if (specialCondition && paragraphMatchResults === null) {
                            const snippetLength = cleanedSnipped.length

                            switch (attempts) {
                                case 0:
                                    cleanedSnipped = cleanedSnipped.substring(1, snippetLength - 1);
                                    specialCondition = cleanedSnipped.split(/\s+/).length > (minWordsInSnipped + 1);

                                    if (!specialCondition)
                                        paragraph.scenario = { ...paragraph.scenario, whyNotFound: `${minWordsInSnippedMessage} ${cleanedSnipped.split(/\s+/).length}` } as SeekerScenario

                                    break;

                                case 1:
                                    cleanedSnipped = cleanedSnipped.substring(0, snippetLength - 1);
                                    specialCondition = cleanedSnipped.split(/\s+/).length > (minWordsInSnipped + 1);

                                    if (!specialCondition)
                                        paragraph.scenario = { ...paragraph.scenario, whyNotFound: `${minWordsInSnippedMessage} ${cleanedSnipped.split(/\s+/).length}` } as SeekerScenario

                                    break;

                                case 2:
                                    cleanedSnipped = cleanedSnipped.substring(1, snippetLength);
                                    specialCondition = cleanedSnipped.split(/\s+/).length > (minWordsInSnipped + 1);

                                    if (!specialCondition)
                                        paragraph.scenario = { ...paragraph.scenario, whyNotFound: `${minWordsInSnippedMessage} ${cleanedSnipped.split(/\s+/).length}` } as SeekerScenario

                                    break;

                                case 3:
                                    regrexLeft = '(<meta).*?(';
                                    regrexRight = ').*?(")';
                                    specialCondition = oneAttempt < 1
                                    oneAttempt++

                                    if (oneAttempt > 1)
                                        paragraph.scenario = { ...paragraph.scenario, whyNotFound: `Was not found in the meta description.` } as SeekerScenario

                                    break;

                                case 4:
                                    specialCondition = false
                                    paragraph.scenario = { ...paragraph.scenario, whyNotFound: `Was not found in case 4.` } as SeekerScenario
                                    break;

                                default:
                                    break;
                            }

                        } else {

                            if (paragraphMatchResults != null) {

                                let htmlParagraph: string = paragraphMatchResults[0];
                                let cleanedParagraph: string = ""
                                let splitParagraphs: Array<string> = []
                                let itsMached: boolean = false

                                const regrexGetParagraph = [
                                    `((\. [A-Z][^.]+)(${cleanedSnipped}).*\.)`, // match snipped that is inside a paragraph
                                    `((${cleanedSnipped}).*\.)` // match snipped that is at beginning of paragraph
                                ];

                                if (htmlParagraph.includes("<meta")) {
                                    htmlParagraph = htmlParagraph.replace(removeHtmlTagsRegexs[4], "").replace(`"`, "")
                                } else {
                                    cleanedParagraph = htmlParagraph.replace(removeHtmlTagsRegexs[0], " ")
                                }

                                await Promise.all(regrexGetParagraph.map(async (regrex: any) => {
                                    const isMatch = cleanedParagraph.match(regrex);
                                    if (isMatch !== null && !itsMached) {
                                        const wordCount = isMatch[0]?.split(/\s+/).length;
                                        paragraph = {
                                            ...paragraph,
                                            paragraph: isMatch[0],
                                            wordCount,
                                            scenario: {
                                                ...paragraph.scenario,
                                                found: true,
                                                whyNotFound: ""
                                            }
                                        };
                                        itsMached = true
                                    }
                                }))

                                break;

                            } else {
                                attempts++;
                                if (attempts === 1 || attempts === 2 || attempts === 3 || attempts === 4) {
                                    cleanedSnipped = matchResult.trim();
                                    specialCondition = true;
                                } else {
                                    paragraph.scenario = { ...paragraph.scenario, found: false } as SeekerScenario
                                    break;
                                }
                            }
                        }
                    }

                }

                if (paragraph.paragraph.split(/\s+/).length > Locals.config().MIN_WORDS_IN_PARAGRAPH && paragraph.paragraph.length < Locals.config().MAX_PARAGRAPH_LENGTH)
                    paragraphs.push(paragraph);

            }));

            return paragraphs
        } catch (error) {
            throw new Error("Error in getParagraph: " + error);
        }
    }
}