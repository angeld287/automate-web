import IChannelMessagesService from "../../../interfaces/IChannelMessagesService";
import { Channel as IChannel } from "../../../interfaces/models/Crypto/Channel";
import { Message as IMessage } from "../../../interfaces/models/Crypto/Message";
import Database from "../../../providers/Database";

export class channelMessagesService implements IChannelMessagesService {
    async createChannel(channel: IChannel): Promise<IChannel> {
        try {
            const createChannel = {
                name: 'create-new-channel',
                text: 'INSERT INTO public.sites(name, domain, created_by, selected) VALUES ($1, $2, $3, $4) RETURNING name, domain, created_by, selected, wp_user, wp_user_pass;',
                values: [],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, createChannel);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _channel: IChannel = {
                id: result.rows[0].id,
            }
            
            return _channel;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateChannel(channel: IChannel): Promise<IChannel | false> {
        try {
            const updateChannel = {
                name: 'update-channel',
                text: 'UPDATE public.sites SET name=$1, domain=$2, selected=$3, wp_user=$4, wp_user_pass=$5 WHERE id = $6 RETURNING name, domain, created_by, selected, id, wp_user, wp_user_pass',
                values: [],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, updateChannel);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _channel: IChannel = {
                id: result.rows[0].id,
            }
            
            return _channel;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createMessage(message: IMessage): Promise<IMessage> {
        try {
            const createChannel = {
                name: 'create-new-meesage',
                text: 'INSERT INTO public.sites(name, domain, created_by, selected) VALUES ($1, $2, $3, $4) RETURNING name, domain, created_by, selected, wp_user, wp_user_pass;',
                values: [],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, createChannel);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _message: IMessage = {
                id: result.rows[0].id,
            }
            
            return _message;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateMessage(message: IMessage): Promise<IMessage | false> {
        try {
            const updateMessage = {
                name: 'update-message',
                text: 'UPDATE public.sites SET name=$1, domain=$2, selected=$3, wp_user=$4, wp_user_pass=$5 WHERE id = $6 RETURNING name, domain, created_by, selected, id, wp_user, wp_user_pass',
                values: [],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, updateMessage);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _message: IMessage = {
                id: result.rows[0].id,
            }
            
            return _message;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }
}