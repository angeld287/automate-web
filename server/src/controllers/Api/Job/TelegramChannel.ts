/**
 * Get the html body of a web page
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import IChannelMessagesService from '../../../interfaces/IChannelMessagesService';
import { IFileSourceService } from '../../../interfaces/IFileSourceService';
import { IRequest, IResponse } from '../../../interfaces/vendors';
import Log from '../../../middlewares/Log';
import ExpressValidator from '../../../providers/ExpressValidation';
import Locals from '../../../providers/Locals';
import { channelMessagesService } from '../../../services/crypto/signals/channelMessagesService';
import { FileSourceService } from '../../../services/source/fileSourceService';

class TelegramChannel {
    public static async refreshMessages(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new SuccessResponse('Success', {
                    errors: errors.array()
                }).send(res);
            }

            const fileSource: IFileSourceService = new FileSourceService();
            const channelService: IChannelMessagesService = new channelMessagesService();

            const fileResult = await fileSource.getFileSource(Locals.config().TELEGRAM_CHANNEL_JSON);

            fileResult.chats.list.forEach(async channel => {
                const dbChannel = await channelService.getChannelByExternalId(channel.id);
                if(dbChannel !== false){
                    channel.messages.forEach(async message => {
                        const dbMessage = await channelService.getMessageByExternalId(message.id);
                        if(dbMessage === false){
                            await channelService.createMessage({
                                externalId: message.id,
                                type: message.type,
                                date: message.date,
                                dateUnixtime: message.date_unixtime,
                                actor: message.actor,
                                actorId: message.actor_id,
                                _from: message.from,
                                fromId: message.from_id,
                                title: message.title,
                                telegramChannelId: message.telegram_channel_id,
                            });
                        }
                    });
                }
            });

            //console.log(fileResult.chats.list)
            //console.log(fileResult.chats.list[1])
            

            return new SuccessResponse('Success', {
                success: true,
                url: req.body.url,
                response: fileResult,
                error: null
            }).send(res);
        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Page Source Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }
}

export default TelegramChannel;