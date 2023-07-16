import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { removeDuplicate } from '../../utils/functions';
import { Channel as IChannel } from '../../interfaces/models/Crypto/Channel';
import { ICoinReport, Message as IMessage } from '../../interfaces/models/Crypto/Message';
import { getAllChannels, getAllMessagesByChannelId } from './channelsAPI';
import { CRYPTOS_COINS } from '../../utils/constants';

export interface ChannelState {
  channels: Array<IChannel>;
  messages: Array<IMessage>;
  selectedChannel: IChannel;
  getAllMessagesState: 'idle' | 'loading' | 'failed';
  coinsReport: Array<ICoinReport>;
}

const initialState: ChannelState = {
  channels: [],
  messages: [],
  selectedChannel: {
    externalId: 0,
    name: "",
    type: "",
  },
  getAllMessagesState: 'idle',
  coinsReport: []
};

export const getChannelList = createAsyncThunk(
  'channel/getAIResearched',
  async () => {
    try {    
      const result = await getAllChannels();
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const getAllChannelMessages = createAsyncThunk(
  'channel/getCreated',
  async (channelId: string) => {
    try {    
      const result = await getAllMessagesByChannelId(channelId);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    generateCoinsReport: (state) => {
      const coins: Array<ICoinReport> = [];
      CRYPTOS_COINS.forEach(coin => {
        const openSignals = state.messages.filter(message => message.type === 'open_signal' && message.pair === coin);
        const coinReport: ICoinReport = {
          name: coin,
          canceledQuantity: state.messages.filter(message => message.type === "canceled" && message.pair === coin).length,
          closePositionQuantity: state.messages.filter(message => message.type === 'close_position' && message.pair === coin).length,
          nullQuantityQuantity: state.messages.filter(message => message.type === null && message.pair === coin).length,
          openPositionQuantity: state.messages.filter(message => message.type === 'open_position' && message.pair === coin).length,
          openSignalQuantity: openSignals.length,
          takeProfitQuantity: state.messages.filter(message => message.type === 'take_profit' && message.pair === coin).length,
          messagesQuantity: state.messages.filter(message => message.pair === coin).length,
        }
        if(coinReport.messagesQuantity && coinReport.messagesQuantity > 0) coins.push(coinReport)
      });
      state.coinsReport = coins.sort((coinA, coinB) => coinA.openSignalQuantity && coinB.openSignalQuantity ? coinB.openSignalQuantity - coinA.openSignalQuantity : 0)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllChannelMessages.pending, (state) => {
        state.getAllMessagesState = 'loading';
      })
      .addCase(getAllChannelMessages.fulfilled, (state, action) => {
        state.getAllMessagesState = 'idle';
        if(action.payload.length > 0){
          state.messages = action.payload;
        }
      })
      .addCase(getAllChannelMessages.rejected, (state) => {
        state.getAllMessagesState = 'failed';
      })
  },
});

export const { generateCoinsReport } = channelSlice.actions;

export const selectChannel = (state: RootState) => state.channels;

export default channelSlice.reducer;
