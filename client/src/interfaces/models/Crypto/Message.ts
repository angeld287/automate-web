export interface Message {
    id?: number;
    externalId: number;
    type: 'open_signal' | 'take_profit' | 'close_position' | 'open_position' | 'canceled' | null;
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
    textEntities?: Array<any>;
    edited?: boolean;
    editedUnixtime?: string;
    replyToMessageId?: string;
    messageId?: string;
    photo?: string;
    width?: number;
    height?: number;
    pair?: string;
    profit?: number;
    entry?: string;
    target?: number;
}

export interface IMessageText {
    type: 'hashtag' | 'plain' | 'phone';
    text: string;
}

export interface ICoinReport {
    name: string;
    messagesQuantity?: number;
    openSignalQuantity?: number;
    openSignalFrecuency?: number;
    takeProfitQuantity?: number;
    closePositionQuantity?: number;
    openPositionQuantity?: number;
    canceledQuantity?: number;
    nullQuantityQuantity?: number;
}

export interface ICoinTrade {
    month: string;
    coin?: string;
    type: "open_signal" | "take_profit" | "close_position" | "open_position" | "canceled" | null;
    amount: number
}

export interface ITargets {
    t1: number;
    t2: number;
    t3: number;
    t4: number;
    t5: number;
    t6: number;
}