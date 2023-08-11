import IChannelMessagesService from "../../../interfaces/IChannelMessagesService";
import { Channel as IChannel } from "../../../interfaces/models/Crypto/Channel";
import { Message as IMessage, IMessageText } from "../../../interfaces/models/Crypto/Message";
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

    async getAllChannels(): Promise<Array<IChannel>> {
        const getQuery = {
            name: 'get-all-channels',
            text:  `SELECT id, external_id, name, type, created_by, created_at, deleted, deleted_by, deleted_at FROM public.telegram_channel;`,
            values: []
        };

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return []
            
            const contents: Array<IChannel> = [];

            result.rows.forEach(row => {
                contents.push({
                    id: row.id,
                    externalId: row.external_id,
                    name: row.name,
                    type: row.type,
                })
            });

            return contents;
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
                text: 'INSERT INTO public.messages(external_id, type, date, date_unixtime, actor, actor_id, _from, from_id, title, telegram_channel_id, reply_to_message_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, external_id, type, date, date_unixtime, actor, actor_id, _from, from_id, title, telegram_channel_id, profit, entry, pair, target;',
                values: [message.externalId, message.type, message.date, message.dateUnixtime, message.actor, message.actorId, message._from, message.fromId, message.title, message.telegramChannelId, message.replyToMessageId],
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
                pair: result.rows[0].pair,
                profit: result.rows[0].profit,
                entry: result.rows[0].entry,
                target: result.rows[0].target,
                replyToMessageId: result.rows[0].reply_to_message_id,
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
                text: 'UPDATE public.messages SET type=$2, date=$3, date_unixtime=$4, actor=$5, actor_id=$6, _from=$7, from_id=$8, title=$9, telegram_channel_id=$10, profit=$11, entry=$12, pair=$13, target=$14 WHERE id = $1 RETURNING id, external_id, type, date, date_unixtime, actor, actor_id, _from, from_id, title, telegram_channel_id, profit, entry, pair, target, reply_to_message_id;',
                values: [message.id, message.type, message.date, message.dateUnixtime, message.actor, message.actorId, message._from, message.fromId, message.title, message.telegramChannelId, message.profit, message.entry, message.pair, message.target],
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
                pair: result.rows[0].pair,
                profit: result.rows[0].profit,
                entry: result.rows[0].entry,
                target: result.rows[0].target,
                replyToMessageId: result.rows[0].reply_to_message_id,
            }
            
            return _message;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getMessageByExternalId(externalId: number): Promise<IMessage | false> {
        const getQuery = {
            name: 'get-message-by-external-id',
            text:  `SELECT id, external_id, type, date, date_unixtime, actor, actor_id, _from, from_id, title, telegram_channel_id, profit, entry, pair, target, reply_to_message_id FROM public.messages where external_id = $1;`,
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
                pair: result.rows[0].pair,
                profit: result.rows[0].profit,
                entry: result.rows[0].entry,
                target: result.rows[0].target,
                replyToMessageId: result.rows[0].reply_to_message_id,
            }

            return contents;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getMessageByExternalIdAndChannelID(externalId: number, channelId: string): Promise<IMessage | false> {
        const getQuery = {
            name: 'get-message-by-external-id-and-channel-id',
            text:  `SELECT id, external_id, type, date, date_unixtime, actor, actor_id, _from, from_id, title, telegram_channel_id, profit, entry, pair, target, reply_to_message_id FROM public.messages where external_id = $1 and from_id = $2;`,
            values: [externalId, channelId]
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
                pair: result.rows[0].pair,
                profit: result.rows[0].profit,
                entry: result.rows[0].entry,
                target: result.rows[0].target,
                replyToMessageId: result.rows[0].reply_to_message_id,
            }

            return contents;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllMessagesByChannelID(channelId: string): Promise<Array<IMessage>> {
        const getQuery = {
            name: 'get-all-messages-by-channel-id',
            text:  `SELECT id, external_id, type, date, date_unixtime, actor, actor_id, _from, from_id, title, telegram_channel_id, profit, entry, pair, target, reply_to_message_id FROM public.messages where from_id = $1;`,
            values: [channelId]
        };

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return []
            
            const contents: Array<IMessage> = [];

            result.rows.forEach(row => {
                contents.push({
                    id: row.id,
                    externalId: row.external_id,
                    type: row.type?.trim(),
                    date: row.date,
                    dateUnixtime: row.date_unixtime,
                    actor: row.actor,
                    actorId: row.actor_id,
                    _from: row._from?.trim(),
                    fromId: row.from_id?.trim(),
                    title: row.title,
                    telegramChannelId: row.telegram_channel_id,
                    pair: row.pair?.trim(),
                    profit: row.profit,
                    entry: row.entry?.trim(),
                    target: row.target,
                    replyToMessageId: row.reply_to_message_id,
                })
            });

            return contents;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllMessagesByChannelIDAndCoin(channelId: string, coin: string): Promise<Array<IMessage>> {
        const getQuery = {
            name: 'get-all-messages-by-channel-id-and-coin',
            text:  `SELECT id, external_id, type, date, date_unixtime, actor, actor_id, _from, from_id, title, telegram_channel_id, profit, entry, pair, target, reply_to_message_id FROM public.messages where from_id = $1 and pair = $2 order by date asc;`,
            values: [channelId, coin]
        };

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return []
            
            const contents: Array<IMessage> = [];

            result.rows.forEach(row => {
                contents.push({
                    id: row.id,
                    externalId: row.external_id,
                    type: row.type?.trim(),
                    date: row.date,
                    dateUnixtime: row.date_unixtime,
                    actor: row.actor,
                    actorId: row.actor_id,
                    _from: row._from?.trim(),
                    fromId: row.from_id?.trim(),
                    title: row.title,
                    telegramChannelId: row.telegram_channel_id,
                    pair: row.pair?.trim(),
                    profit: row.profit,
                    entry: row.entry?.trim(),
                    target: row.target,
                    replyToMessageId: row.reply_to_message_id,
                })
            });

            return contents;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addMessageProps(textEntities: Array<IMessageText>, message: IMessage){
        try {
            const hashtag = textEntities.find(text => text.type === 'hashtag')
            const openSignal = textEntities.find(text => text.text.includes('Pair:'));
           
            if(hashtag){
                const profitLine = textEntities.find(text => text.text.includes('Profit:'))
                const allEntry = textEntities.find(text => text.text.includes('All entry targets'))
                const canceled = textEntities.find(text => text.text.includes('Cancelled ❌'))

                message.pair = hashtag.text.slice(-4) !== "USDT" ? `${hashtag.text.replace("#", '')}USDT` : hashtag.text.replace("#", '');
                if(textEntities.find(text => text.text.includes('Fully close your previous')) ||  textEntities.find(text => text.text.includes('Closed due to opposite direction signal '))){
                    message.type = "close_position";
                    message.entry = '0';
                }else if(profitLine){
                    message.type = "take_profit";
                    var profitRegex = new RegExp(`(Profit: (.*?) Target)|(\\nProfit: (.*?)%)`);
                    var targetRegex = new RegExp(`(Target (.*?)\\n)|(target (.*?) ✅\\n)`);
    
                    const profitMatch = profitLine.text.match(profitRegex);
                    const targetMatch = profitLine.text.match(targetRegex);
    
                    message.profit = profitMatch[2] ? parseInt(profitMatch[2].slice(-1) === '%' ? profitMatch[2].replace('%', '') : profitMatch[2]) : parseInt(profitMatch[4]);
                    message.target = targetMatch ? targetMatch[2] ? parseInt(targetMatch[2]) : parseInt(targetMatch[4]) : null;

                    
                }else if(allEntry){
                    message.type = "open_position";
                    message.target = 0

                }else if(canceled){
                    message.type = "canceled";
                    
                }else{}

            }else if(openSignal) {    
                var pairRegex = new RegExp(`Pair: (.*?)\\n`)
                var entryRegex = new RegExp(`(Entry: (.*?)\\n)`)
    
                const entryMatch = openSignal.text.match(entryRegex);
    
                message.type = "open_signal";
                message.pair = openSignal.text.match(pairRegex)[1].slice(-4) !== "USDT" ? `${openSignal.text.match(pairRegex)[1]}USDT` : openSignal.text.match(pairRegex)[1];
    
                if(entryMatch){
                    message.entry = entryMatch[2];
                }else{
                    const entryMatch2 = openSignal.text.match(new RegExp(`Entry: (.*)`));
    
                    const entryFirstPart = entryMatch2[1];
                    const entryNextIndex = textEntities.findIndex(text => text.text === openSignal.text) + 1;
                    message.entry = `${entryFirstPart}${textEntities[entryNextIndex].text}`;
                } 
            }else{
                message.textEntities = textEntities;
                //console.log(message)
            }
    
           await this.updateMessage(message);    
        } catch (error) {
            message.textEntities = textEntities;
            //console.log(error, message)
        }
        
    }
}