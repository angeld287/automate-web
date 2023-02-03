import { TranslateResult } from "./response/TranslateResult";

export interface ITranslateService {

    perform(text: string, from: string, to: string): Promise<TranslateResult>;

    performNf(text: string, from: string, to: string): Promise<TranslateResult>;

}