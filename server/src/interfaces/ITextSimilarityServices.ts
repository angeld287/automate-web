import ISimilarityResponse from "./response/ISimilarityResponse";

export default interface ITextSimilarityServices {
    checkSimilarity(text1: string, text2: string): Promise<ISimilarityResponse>;
}