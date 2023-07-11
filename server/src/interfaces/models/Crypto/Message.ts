export interface Message {
    id?: number;
    externalId: number;
    type: 'open_signal' | 'take_profit' | 'close_position' | null;
    date: string;
    dateUnixtime: number;
    actor: string;
    actorId: string;
    _from: string;
    fromId: string;
    title: string;
    telegramChannelId: number;
    action?: string;
    text?: string;
    textEntities?: string;
    edited?: boolean;
    editedUnixtime?: string;
    replyToMessageId?: string;
    messageId?: string;
    photo?: string;
    width?: number;
    height?: number;
    pair?: string;
}

export interface IMessageText {
    type: 'hashtag' | 'plain' | 'phone';
    text: string;
}