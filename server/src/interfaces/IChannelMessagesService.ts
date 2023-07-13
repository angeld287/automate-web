import { Channel as IChannel } from "./models/Crypto/Channel";
import { Message as IMessage, IMessageText } from "./models/Crypto/Message";

export default interface IChannelMessagesService {
    
    createChannel(channel: IChannel, userId: number): Promise<IChannel>;

    updateChannel(channel: IChannel): Promise<IChannel | false>;

    getAllChannels(): Promise<Array<IChannel>>;

    createMessage(message: IMessage): Promise<IMessage>;

    updateMessage(message: IMessage): Promise<IMessage | false>;

    getChannelByExternalId(externalId: number): Promise<IChannel | false>;

    getMessageByExternalId(externalId: number): Promise<IMessage | false>;

    getMessageByExternalIdAndChannelID(externalId: number, channelId: string): Promise<IMessage | false>;

    getAllMessagesByChannelID(channelId: string): Promise<Array<IMessage>>;

    addMessageProps(textEntities: Array<IMessageText>, message: IMessage)
}