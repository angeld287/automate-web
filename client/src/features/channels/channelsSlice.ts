import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Channel as IChannel } from '../../interfaces/models/Crypto/Channel';
import { ICoinReport, ICoinTrade, Message as IMessage, ITargets } from '../../interfaces/models/Crypto/Message';
import { getAllChannels, getAllMessagesByChannelId, getAllMessagesByChannelIdAndCoin } from './channelsAPI';
import { CRYPTOS_COINS } from '../../utils/constants';

export interface ChannelState {
  channels: Array<IChannel>;
  messages: Array<IMessage>;
  selectedChannel: IChannel;
  getAllMessagesState: 'idle' | 'loading' | 'failed';
  getCoinMessagesState: 'idle' | 'loading' | 'failed';
  coinsReport: Array<ICoinReport>;
  coinTrades: Array<ICoinTrade>;
  targetsReport?: ITargets;
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
  getCoinMessagesState: 'idle',
  coinsReport: [],
  coinTrades: [],
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

export const getAllCoinChannelMessages = createAsyncThunk(
  'channel/getCoinMessages',
  async ({channelId, coin}:{channelId: string, coin: string}) => {
    try {    
      const result = await getAllMessagesByChannelIdAndCoin(channelId, coin);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const getNumberOfTargets = createAsyncThunk(
  'channel/getNumberOfTargets',
  async ({channelId, coin}:{channelId: string, coin: string}) => {
    try {    
      const result = await getAllMessagesByChannelIdAndCoin(channelId, coin);
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
    },
    generateCoinTradesResults: (state, action: PayloadAction<string>) => {
      const coinMessages = state.messages.filter(message => message.pair === action.payload);
      var profit = 0;
      const coinTrades: Array<ICoinTrade> = coinMessages.map(
        (message) => {
          
          if(message.type === 'canceled' || message.type === 'open_position' || message.type === 'open_signal'){ profit = 0 }else if(message.type === 'close_position'){ profit = -1 }else{ profit +=1; }

          return {
            month: (new Date(message.dateUnixtime)).getMonth().toString(),
            coin: message.pair?.replace('USDT', ''),
            type: message.type,
            amount: profit,
          }
        }
      );

      state.coinTrades = coinTrades;
    },
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
      .addCase(getAllCoinChannelMessages.pending, (state) => {
        state.getCoinMessagesState = 'loading';
      })
      .addCase(getAllCoinChannelMessages.fulfilled, (state, action) => {
        if(action.payload.length > 0){
          var profit = 0;
          const coinMessages = action.payload;
          const coinTrades: Array<ICoinTrade> = coinMessages
          //.sort((a:IMessage, b:IMessage) => b.dateUnixtime - a.dateUnixtime ? 1 : -1)
          .map(
            (message: IMessage) => {
              if(!(message.type === 'canceled') && !(message.type === 'open_position')){

                if(message.type === 'open_signal'){ 
                  profit = 0 
                }else if(message.type === 'close_position'){ 
                  profit = -1 
                }else if(message.type === 'take_profit'){ 
                  profit +=1; 
                }

                return {
                  month: new Date(message.dateUnixtime*1000).toLocaleDateString('en-us', { year:"2-digit", month:"short", day:"numeric"}),
                  coin: message.pair?.replace('USDT', ''),
                  type: message.type,
                  amount: profit,
                }
              }else{
                return {
                  month: new Date().toLocaleDateString('en-us', { year:"2-digit", month:"short", day:"numeric"}),
                  coin: 'BTC',
                  type: 'take_profit',
                  amount: 3,
                }
              }
            }
          );

          state.coinTrades = coinTrades
          state.messages = action.payload;
          state.getCoinMessagesState = 'idle';
        }
      })
      .addCase(getAllCoinChannelMessages.rejected, (state) => {
        state.getCoinMessagesState = 'failed';
      })
      .addCase(getNumberOfTargets.fulfilled, (state, action) => {
        if(action.payload.length > 0){
          const coinMessages: Array<IMessage> = action.payload;
          const targets: ITargets = {
            t1: coinMessages.filter(message => message.target === 1).length,
            t2: coinMessages.filter(message => message.target === 2).length,
            t3: coinMessages.filter(message => message.target === 3).length,
            t4: coinMessages.filter(message => message.target === 4).length,
            t5: coinMessages.filter(message => message.target === 5).length,
            t6: coinMessages.filter(message => message.target === 6).length,
          }
     
          state.targetsReport = targets;
        }
      });
  },
});

export const { generateCoinsReport, generateCoinTradesResults } = channelSlice.actions;

export const selectChannel = (state: RootState) => state.channels;

export default channelSlice.reducer;
