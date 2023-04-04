import { ImagesResponse, CreateChatCompletionResponse } from "openai"

export default interface IOpenaiServices {

    createNewImage(text: string): Promise<ImagesResponse>;

    createNewChat(text: string): Promise<CreateChatCompletionResponse>
}