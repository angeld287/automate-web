import IContent from "./models/Content";

export default interface ITextAnalyticsServices {

    getExtractiveSummarization(contents: Array<IContent>): Promise<any>

}