import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { SubTitleContent } from '../../interfaces/models/Article';
import IContent from '../../interfaces/models/Content';
import { createContent, searchKeywordContent, searchSubtitle } from './subtitleAPI';

export interface SubtitleState {
  subtitle: SubTitleContent;
  status: 'idle' | 'loading' | 'failed';
  getStatus: 'idle' | 'loading' | 'failed';
  createUpdateStatus: 'idle' | 'loading' | 'failed';
  finalParagraphs: Array<IContent>;
}

const initialState: SubtitleState = {
  subtitle: {
    id: 0,
    name: "",
    orderNumber: 0,
  },
  finalParagraphs: [],
  status: 'idle',
  getStatus: 'loading',
  createUpdateStatus: 'idle',
};

export const getKeywordContent = createAsyncThunk(
  'subtitle/search',
  async (subtitle: SubTitleContent) => {
    try {    
      const result = await searchKeywordContent(subtitle);
      return result.data.subtitle;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const getSubtitleById = createAsyncThunk(
  'subtitle/get',
  async (subtitle: SubTitleContent) => {
    try {    
      const result = await searchSubtitle(subtitle);
      return result.data.response.subtitle;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const crateSubtitleContent = createAsyncThunk(
  'subtitle/createContent',
  async (contents: Array<IContent>) => {
    try {    
      const result = await createContent(contents);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const subtitleSlice = createSlice({
  name: 'subtitle',
  initialState,
  reducers: {
    setInitialState: (state) => {
      state.subtitle = initialState.subtitle
    },
    setFinalParagraphs: (state, action: PayloadAction<Array<IContent>>) => {
      state.finalParagraphs = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getKeywordContent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getKeywordContent.fulfilled, (state, action: PayloadAction<SubTitleContent>) => {
        state.status = 'idle';
        state.subtitle = action.payload;
      })
      .addCase(getKeywordContent.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(getSubtitleById.pending, (state) => {
        state.getStatus = 'loading';
      })
      .addCase(getSubtitleById.fulfilled, (state, action: PayloadAction<SubTitleContent>) => {
        state.getStatus = 'idle';
        state.subtitle = action.payload;
      })
      .addCase(getSubtitleById.rejected, (state) => {
        state.getStatus = 'failed';
      })
      .addCase(crateSubtitleContent.pending, (state) => {
        state.createUpdateStatus = 'loading';
      })
      .addCase(crateSubtitleContent.fulfilled, (state, action: PayloadAction<Array<IContent>>) => {
        const { subtitle } = state;
        const { content } = subtitle;
        const existingContent = content ? content : []
        state.createUpdateStatus = 'idle';
        state.subtitle.content = [...existingContent.filter(content => !content.selected), ...action.payload];
      })
      .addCase(crateSubtitleContent.rejected, (state) => {
        state.createUpdateStatus = 'failed';
      });
  },
});

export const { setInitialState, setFinalParagraphs } = subtitleSlice.actions;

export const selectSubtitle = (state: RootState) => state.subtitle;

export default subtitleSlice.reducer;
