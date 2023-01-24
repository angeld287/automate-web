import { SubTitleContent } from "../../interfaces/models/Article";

export default interface ISearchKeywordStepper{
    subtitles: Array<SubTitleContent>;
    onNext: Function;
}