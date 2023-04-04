import IOpenaiServices from "../../interfaces/IOpenaiServices";
import OpenAI from "../../providers/OpenAI";
import { ImagesResponse } from "openai"

export default class openaiServices implements IOpenaiServices {

    async createNewImage(text: string): Promise<ImagesResponse> {
        try {
            const openai = new OpenAI();
            const response = await openai.client.createImage({
                prompt: text,
                n: 1,
                size: "1024x1024",
              });
        
            return response.data;

        } catch (error) {
            throw new Error(error.message);
        }
    }
}