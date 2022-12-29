import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { IArticle, SubTitleContent } from '../../interfaces/models/Article';
import { searchKeywordsContent } from './articleAPI';

export interface ArticleState {
  article: IArticle;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ArticleState = {
  article: {
    title: "",
    translatedTitle: "",
    subtitiles: [],
    category: "",
  },
  status: 'idle',
};

export const getKeywordsContent = createAsyncThunk(
  'article/search',
  async (article: IArticle) => {
    try {    
      const result = await searchKeywordsContent(article);
      console.log(result)  
      return result;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    addSubtitles: (state, action: PayloadAction<Array<SubTitleContent>>) => {
      state.article.subtitiles = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getKeywordsContent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getKeywordsContent.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(getKeywordsContent.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { addSubtitles } = articleSlice.actions;

export const selectArticle = (state: RootState) => state.article.article;

export default articleSlice.reducer;
