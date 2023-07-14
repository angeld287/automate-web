import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { removeDuplicate } from '../../utils/functions';
import { Channel as IChannel } from '../../interfaces/models/Crypto/Channel';
import { Message as IMessage } from '../../interfaces/models/Crypto/Message';
import { getAllChannels, getAllMessagesByChannelId } from './channelsAPI';

export interface ChannelState {
  channels: Array<IChannel>;
  messages: Array<IMessage>;
  selectedChannel: IChannel;
  getAllMessagesState: 'idle' | 'loading' | 'failed';
}

const initialState: ChannelState = {
  channels: [],
  messages: [],
  selectedChannel: {
    externalId: 0,
    name: "",
    type: "",
  },
  getAllMessagesState: 'idle'
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
  reducers: {},
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

export const { } = channelSlice.actions;

export const selectArticles = (state: RootState) => state.articles;

export default channelSlice.reducer;
