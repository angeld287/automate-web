/**
 * Manage all the databases methods for articles, contents and subtitles.
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import { IArticleService } from '../../../interfaces/IArticleService';
import IContent from '../../../interfaces/models/Content';
import { IRequest, IResponse } from '../../../interfaces/vendors';

import Log from '../../../middlewares/Log';
import ExpressValidator from '../../../providers/ExpressValidation';
import { articleService } from '../../../services/articleServices/articleServices';


class Article {
    public static async createContent(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            let _articleService: IArticleService = new articleService();
            
            const _content = req.body.content;
            const selected = req.body.selected;
            const contentLanguage = req.body.contentLanguage;
            

            let content: IContent = {
                content: _content,
                selected,
                contentLanguage
            };

            content = await _articleService.createContent(content);

            return new SuccessResponse('Success', {
                success: true,
                response: content,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Create Content - Article Controller Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
     }
}

export default Article