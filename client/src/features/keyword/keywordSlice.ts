import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { SubTitleContent } from '../../interfaces/models/Article';
import { searchKeywordContent } from './keywordAPI';

export interface KeywordState {
  subtitle: SubTitleContent;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: KeywordState = {
  subtitle: {
    id: 0,
    name: ""
  },
  status: 'idle',
};

export const getKeywordContent = createAsyncThunk(
  'keyword/search',
  async (subtitle: SubTitleContent) => {
    try {    
      const result = await searchKeywordContent(subtitle);
      return result;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const keywordSlice = createSlice({
  name: 'keyword',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getKeywordContent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getKeywordContent.fulfilled, (state, action: PayloadAction<SubTitleContent>) => {
        state.status = 'idle';
        state.subtitle = action.payload
      })
      .addCase(getKeywordContent.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const {} = keywordSlice.actions;

export const selectKeyword = (state: RootState) => state.keyword;

export default keywordSlice.reducer;
