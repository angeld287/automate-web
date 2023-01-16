import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import IPagination from '../../interfaces/IPagination';
import { IArticle } from '../../interfaces/models/Article';
import { getArticlesFromDb } from './articlesAPI';

export interface ArticlesState {
  articles: Array<IArticle>;
  status: 'idle' | 'loading' | 'failed';
  page: number;
  size: number;
  hasMore: boolean;
}

const initialState: ArticlesState = {
  articles: [],
  status: 'idle',
  page: 0,
  size: 5,
  hasMore: true,
};

export const getArticles = createAsyncThunk(
  'articles/getlist',
  async ({page, size}: IPagination) => {
    try {    
      const result = await getArticlesFromDb(page, size);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    resetArticlesList: (state) => {
      state.articles = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getArticles.fulfilled, (state, action) => {
        state.status = 'idle';
        if(action.payload.articles !== false){
          state.page = parseInt(action.payload.page)
          state.size = parseInt(action.payload.size)
          state.articles = [...state.articles, ...action.payload.articles]
        }else{
          state.hasMore = false;
        }
      })
      .addCase(getArticles.rejected, (state) => {
        state.status = 'failed';
      })
  },
});

export const { resetArticlesList } = articlesSlice.actions;

export const selectArticles = (state: RootState) => state.articles;

export default articlesSlice.reducer;
