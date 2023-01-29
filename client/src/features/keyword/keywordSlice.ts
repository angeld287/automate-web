import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { SubTitleContent } from '../../interfaces/models/Article';
import IContent from '../../interfaces/models/Content';
import { createContent, searchKeywordContent, searchSubtitle } from './keywordAPI';

export interface KeywordState {
  subtitle: SubTitleContent;
  status: 'idle' | 'loading' | 'failed';
  getStatus: 'idle' | 'loading' | 'failed';
  createUpdateStatus: 'idle' | 'loading' | 'failed';
  finalParagraphs: Array<IContent>;
}

const initialState: KeywordState = {
  subtitle: {
    id: 0,
    name: ""
  },
  finalParagraphs: [],
  status: 'idle',
  getStatus: 'loading',
  createUpdateStatus: 'idle',
};

export const getKeywordContent = createAsyncThunk(
  'keyword/search',
  async (subtitle: SubTitleContent) => {
    try {    
      const result = await searchKeywordContent(subtitle);
      return result.data.subtitle;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const getKeywordById = createAsyncThunk(
  'keyword/get',
  async (subtitle: SubTitleContent) => {
    try {    
      const result = await searchSubtitle(subtitle);
      return result.data.response.subtitle;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const crateKeywordContent = createAsyncThunk(
  'keyword/createContent',
  async (contents: Array<IContent>) => {
    try {    
      const result = await createContent(contents);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const keywordSlice = createSlice({
  name: 'keyword',
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
      .addCase(getKeywordById.pending, (state) => {
        state.getStatus = 'loading';
      })
      .addCase(getKeywordById.fulfilled, (state, action: PayloadAction<SubTitleContent>) => {
        state.getStatus = 'idle';
        state.subtitle = action.payload;
      })
      .addCase(getKeywordById.rejected, (state) => {
        state.getStatus = 'failed';
      })
      .addCase(crateKeywordContent.pending, (state) => {
        state.createUpdateStatus = 'loading';
      })
      .addCase(crateKeywordContent.fulfilled, (state, action: PayloadAction<Array<IContent>>) => {
        const { subtitle } = state;
        const { content } = subtitle;
        const existingContent = content ? content : []
        state.createUpdateStatus = 'idle';
        state.subtitle.content = [...existingContent, ...action.payload];
      })
      .addCase(crateKeywordContent.rejected, (state) => {
        state.createUpdateStatus = 'failed';
      });
  },
});

export const { setInitialState, setFinalParagraphs } = keywordSlice.actions;

export const selectKeyword = (state: RootState) => state.keyword;

export default keywordSlice.reducer;
