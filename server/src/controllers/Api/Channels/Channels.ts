/**
 * Get the html body of a web page
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import IChannelMessagesService from '../../../interfaces/IChannelMessagesService';
import { IRequest, IResponse } from '../../../interfaces/vendors';
import Log from '../../../middlewares/Log';
import { channelMessagesService } from '../../../services/crypto/signals/channelMessagesService';

class Channels {
    public static async getAllChannelMessages(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(!req.query.channelId){
                return new BadRequestResponse('Error', {
                    error: "Param channelId is required."
                }).send(res);
            }

            const channelService: IChannelMessagesService = new channelMessagesService();

            const result = await channelService.getAllMessagesByChannelID(req.query.channelId.toString());

            return new SuccessResponse('Success', {
                success: true,
                response: result,
                error: null
            }).send(res);
        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Page Source Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async getAllCoinChannelMessages(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(!req.query.channelId || !req.query.coin){
                return new BadRequestResponse('Error', {
                    error: "Params channelId and coin are required."
                }).send(res);
            }

            const channelService: IChannelMessagesService = new channelMessagesService();

            const result = await channelService.getAllMessagesByChannelIDAndCoin(req.query.channelId.toString(), req.query.coin.toString());

            return new SuccessResponse('Success', {
                success: true,
                response: result,
                error: null
            }).send(res);
        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Page Source Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async getAllChannels(req: IRequest, res: IResponse): Promise<any> {
        try {

            const channelService: IChannelMessagesService = new channelMessagesService();

            const result = await channelService.getAllChannels();

            return new SuccessResponse('Success', {
                success: true,
                response: result,
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

export default Channels;