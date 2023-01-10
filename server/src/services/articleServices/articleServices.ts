import { IArticleService } from "../../interfaces/IArticleService";
import Content from "../../interfaces/models/Content";
import Database from "../../providers/Database";

export class articleService implements IArticleService {

    async createContent(content: Content): Promise<Content> {
        try {
            const createContent = {
                name: 'create-new-content',
                text: 'INSERT INTO public.contents(content, selected, content_language) VALUES ($1, $2, $3) RETURNING id, content, selected, content_language',
                values: [content.content, content.selected, content.contentLanguage],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, createContent);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _content: Content = {
                id: result.rows[0].id,
                content: result.rows[0].content,
                selected: result.rows[0].selected,
                contentLanguage: result.rows[0].content_language,
            }
            
            return _content;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }
}