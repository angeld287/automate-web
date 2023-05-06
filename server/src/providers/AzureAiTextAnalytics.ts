//import { TextAnalysisClient, AzureKeyCredential } from "@azure/ai-text-analytics";
import Locals from "./Locals";
//import Log from '../middlewares/Log';

class AzureAiTextAnalytics {
    public analysis: any;//TextAnalysisClient;

    constructor() {
        this.analysis = this.createClient();
    }

    private createClient(): any { //TextAnalysisClient
            return false;//new TextAnalysisClient(Locals.config().AZURE_TEXT_ANALYTICS_API, new AzureKeyCredential(Locals.config().AZURE_TEXT_ANALYTICS_KEY));
    }
}

export default AzureAiTextAnalytics;