import ITextAnalyticsServices from "../../interfaces/ITextAnalyticsServices";
import { AnalyzeBatchAction } from "@azure/ai-text-analytics";
import AzureAiTextAnalytics from "../../providers/AzureAiTextAnalytics";
import IContent from "../../interfaces/models/Content";

export default class textAnalyticsServices implements ITextAnalyticsServices {

    async getExtractiveSummarization(contents: Array<IContent>): Promise<any> {
        try {
            const documents: Array<string> = contents.map(content => content.content)
            const client = new AzureAiTextAnalytics();
            const actions: Array<AnalyzeBatchAction> = [
                {
                    kind: 'ExtractiveSummarization',
                    maxSentenceCount: 2,
                }
            ];

            const poller = await client.analysis.beginAnalyzeBatch(actions, documents, "es");
            const results = await poller.pollUntilDone();

            const response = []

            for await (const actionResult of results) {
                if (actionResult.kind !== "ExtractiveSummarization") {
                  throw new Error(`Expected extractive summarization results but got: ${actionResult.kind}`);
                }
                if (actionResult.error) {
                  const { code, message } = actionResult.error;
                  throw new Error(`Unexpected error (${code}): ${message}`);
                }
                response.push(actionResult);
              }
        
            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }
}