import IChannelMessagesService from "../../../interfaces/IChannelMessagesService";
import { Channel as IChannel } from "../../../interfaces/models/Crypto/Channel";
import { Message as IMessage } from "../../../interfaces/models/Crypto/Message";
import Database from "../../../providers/Database";

export class channelMessagesService implements IChannelMessagesService {
    async createChannel(channel: IChannel, userId: number): Promise<IChannel> {
        try {
            const createChannel = {
                name: 'create-new-channel',
                text: 'INSERT INTO public.telegram_channel(external_id, name, type, created_by) VALUES ($1, $2, $3, $4);',
                values: [channel.externalId, channel.name, channel.type, userId],
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
                externalId: result.rows[0].external_id,
                name: result.rows[0].name,
                type: result.rows[0].type,
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
                externalId: result.rows[0].external_id,
                name: result.rows[0].name,
                type: result.rows[0].type,
            }
            
            return _channel;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getChannelByExternalId(externalId: number): Promise<IChannel | false> {
        const getQuery = {
            name: 'get-channel-by-external-id',
            text:  `SELECT id, external_id, name, type, created_by, created_at, deleted, deleted_by, deleted_at FROM public.telegram_channel where external_id = $1;`,
            values: [externalId]
        };

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return false
            
            const contents: IChannel = {
                id: result.rows[0].id,
                externalId: result.rows[0].external_id,
                name: result.rows[0].name,
                type: result.rows[0].type,
            }

            return contents;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async createMessage(message: IMessage): Promise<IMessage> {
        try {
            const createChannel = {
                name: 'create-new-meesage',
                text: 'INSERT INTO public.messages(external_id, type, date, date_unixtime, actor, actor_id, _from, from_id, title, telegram_channel_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, external_id, type, date, date_unixtime, actor, actor_id, _from, from_id, title, telegram_channel_id;',
                values: [message.externalId, message.type, message.date, message.dateUnixtime, message.actor, message.actorId, message._from, message.fromId, message.title, message.telegramChannelId],
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
                externalId: result.rows[0].external_id,
                type: result.rows[0].type,
                date: result.rows[0].date,
                dateUnixtime: result.rows[0].date_unixtime,
                actor: result.rows[0].actor,
                actorId: result.rows[0].actor_id,
                _from: result.rows[0]._from,
                fromId: result.rows[0].from_id,
                title: result.rows[0].title,
                telegramChannelId: result.rows[0].telegram_channel_id,
                //text: result.rows[0].title,
                //textEntities: result.rows[0].title
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
                text: 'UPDATE public.messages SET type=$2, date=$3, date_unixtime=$4, actor=$5, actor_id=$6, _from=$7, from_id=$8, title=$9 WHERE id = $1 RETURNING id, external_id, type, date, date_unixtime, actor, actor_id, _from, from_id, title, telegram_channel_id;',
                values: [message.id, message.type, message.date, message.dateUnixtime, message.actor, message.actorId, message._from, message.fromId, message.title],
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
                externalId: result.rows[0].external_id,
                type: result.rows[0].type,
                date: result.rows[0].date,
                dateUnixtime: result.rows[0].date_unixtime,
                actor: result.rows[0].actor,
                actorId: result.rows[0].actor_id,
                _from: result.rows[0]._from,
                fromId: result.rows[0].from_id,
                title: result.rows[0].title,
                telegramChannelId: result.rows[0].telegram_channel_id,
            }
            
            return _message;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getMessageByExternalId(externalId: number): Promise<IMessage | false> {
        const getQuery = {
            name: 'get-message-by-external-id',
            text:  `SELECT id, external_id, type, date, date_unixtime, actor, actor_id, _from, from_id, title, telegram_channel_id FROM public.messages where external_id = $1;`,
            values: [externalId]
        };

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return false
            
            const contents: IMessage = {
                id: result.rows[0].id,
                externalId: result.rows[0].external_id,
                type: result.rows[0].type,
                date: result.rows[0].date,
                dateUnixtime: result.rows[0].date_unixtime,
                actor: result.rows[0].actor,
                actorId: result.rows[0].actor_id,
                _from: result.rows[0]._from,
                fromId: result.rows[0].from_id,
                title: result.rows[0].title,
                telegramChannelId: result.rows[0].telegram_channel_id,
            }

            return contents;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}