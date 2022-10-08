import { TranslateResult } from "./response/TranslateResult";

export interface ITranslateService {

    perform(text: string, to: string): Promise<TranslateResult>;

}