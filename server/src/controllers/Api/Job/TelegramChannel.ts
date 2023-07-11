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
import NodeJob from '../../../providers/NodeJob';
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

            const dbMessage = await channelService.getMessageByExternalId(16415);

            if(dbMessage)
                await channelService.addMessagePair([
                    {
                     "type": "plain",
                     "text": "📩Pair: LUNA2USDT\n📈Direction: Long\n💯Leverage: Cross 20x\n\n📊Entry: 1.900623725\n❗Enter as soonest possible❗\n\n✅Target1: 1."
                    },
                    {
                     "type": "phone",
                     "text": "9366995"
                    },
                    {
                     "type": "plain",
                     "text": "\n✅Target2: 1.99366125\n✅Target3: 2.050623\n✅Target4: 2.18353375\n✅Target5: 2.27847\n✅Target6: 2."
                    },
                    {
                     "type": "phone",
                     "text": "4683425"
                    },
                    {
                     "type": "plain",
                     "text": "\n✅Target7: 🚀🚀🚀\n\n⛔Stop Loss: 0."
                    },
                    {
                     "type": "phone",
                     "text": "9493625"
                    },
                    {
                     "type": "plain",
                     "text": "\n↔️Use opposite signal as stop loss(Recommended)"
                    }
                   ], dbMessage)

            const job: NodeJob = new NodeJob();
            //job.startJob(`JOB-REFRESH-MESSAGES`, async () => {
            //    console.log('The job to update messages has STARTED!')
            //    const fileResult = await fileSource.getFileSource(Locals.config().TELEGRAM_CHANNEL_JSON);
            //    await Promise.all(fileResult.chats.list.map(async (channel) => {
            //        const dbChannel = await channelService.getChannelByExternalId(channel.id);
//
            //        
            //        if(dbChannel !== false){
            //            await Promise.all(channel.messages.map(async (message) => {
            //                const dbMessage = await channelService.getMessageByExternalId(message.id);
            //                if(dbMessage === false){
            //                    await channelService.createMessage({
            //                        externalId: message.id,
            //                        type: message.type,
            //                        date: message.date,
            //                        dateUnixtime: message.date_unixtime,
            //                        actor: message.actor,
            //                        actorId: message.actor_id,
            //                        _from: message.from,
            //                        fromId: message.from_id,
            //                        title: message.title,
            //                        telegramChannelId: dbChannel.id,
            //                    });
            //                }else{
            //                    
            //                    //await channelService.updateMessage({
            //                    //    id: dbChannel.id,
            //                    //    externalId: dbMessage.id,
            //                    //    type: dbMessage.type,
            //                    //    date: dbMessage.date,
            //                    //    dateUnixtime: dbMessage.dateUnixtime,
            //                    //    actor: dbMessage.actor,
            //                    //    actorId: dbMessage.actorId,
            //                    //    _from: dbMessage._from,
            //                    //    fromId: dbMessage.fromId,
            //                    //    title: dbMessage.title,
            //                    //    telegramChannelId: dbChannel.id,
            //                    //});
            //                }
            //            }));
            //        }
            //    }));
//
            //    console.log('The job to update messages has ENDED!')
            //})

            

            //console.log(fileResult.chats.list)
            //console.log(fileResult.chats.list[1])
            

            return new SuccessResponse('Success', {
                success: true,
                url: req.body.url,
                response: 'The job to update messages has started',
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