import Locals from "./Locals";
import { Configuration, OpenAIApi } from "openai";

class OpenAI {
    public client: OpenAIApi;

    constructor() {
        this.client = this.getClient();
    }

    private getClient(): OpenAIApi {
        const config = new Configuration({
            organization: "org-A5utPi7A9fMwtCont6tOOpJC",
            apiKey: Locals.config().OPEN_AI_API_KEY,
        });
        return new OpenAIApi(config);
    }
}

export default OpenAI;