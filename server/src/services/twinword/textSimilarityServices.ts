import ITextSimilarityServices from "../../interfaces/ITextSimilarityServices";
import ISimilarityResponse from "../../interfaces/response/ISimilarityResponse";
import Locals from "../../providers/Locals";
import { fetch } from "../../utils";

export default class textSimilarityServices implements ITextSimilarityServices {

    async checkSimilarity(text1: string, text2: string): Promise<ISimilarityResponse> {
        const result = await fetch(`${Locals.config().TWINWORD_API_ENDPOINT}?text1=${text1}&text2=${text2}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Host': 'api.twinword.com',
                'X-Twaip-Key': Locals.config().TWINWORD_API_KEY,
            }
        });
        return result.body;
    }
}