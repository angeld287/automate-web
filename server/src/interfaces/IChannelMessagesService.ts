import { Channel as IChannel } from "./models/Crypto/Channel";
import { Message as IMessage } from "./models/Crypto/Message";

export default interface IChannelMessagesService {
    
    createChannel(channel: IChannel): Promise<IChannel>;

    updateChannel(channel: IChannel): Promise<IChannel | false>;

    createMessage(message: IMessage): Promise<IMessage>;

    updateMessage(message: IMessage): Promise<IMessage | false>;
}