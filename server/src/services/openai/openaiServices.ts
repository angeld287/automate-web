import IOpenaiServices from "../../interfaces/IOpenaiServices";
import OpenAI from "../../providers/OpenAI";
import { ImagesResponse, CreateChatCompletionResponse } from "openai"

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
    
    async createNewChat(text: string): Promise<CreateChatCompletionResponse> {
        try {
            const openai = new OpenAI();
            const response = await openai.client.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: text}],
              });
        
            return response.data;

        } catch (error) {
            throw new Error(error.message);
        }
    }
}