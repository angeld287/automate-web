import { TranslateResult } from "./response/TranslateResult";
import { ITranslateItem } from "./Utils";

export interface ITranslateService {

    perform(text: string, from: string, to: string): Promise<TranslateResult>;

    performNf(text: string, from: string, to: string): Promise<TranslateResult>;

    translateMultipleTexts(texts: Array<ITranslateItem>, from: string, to: string): Promise<TranslateResult>;

    translateMultipleTextsNf(texts: Array<ITranslateItem>, from: string, to: string): Promise<TranslateResult>;

}