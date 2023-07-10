import { Channel as IChannel } from "./models/Crypto/Channel";
import { Message as IMessage } from "./models/Crypto/Message";

export default interface IChannelMessagesService {
    
    createChannel(channel: IChannel, userId: number): Promise<IChannel>;

    updateChannel(channel: IChannel): Promise<IChannel | false>;

    createMessage(message: IMessage): Promise<IMessage>;

    updateMessage(message: IMessage): Promise<IMessage | false>;

    getChannelByExternalId(externalId: number): Promise<IChannel | false>;

    getMessageByExternalId(externalId: number): Promise<IMessage | false>;
}