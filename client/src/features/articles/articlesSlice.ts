import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import IPagination from '../../interfaces/IPagination';
import { IArticle } from '../../interfaces/models/Article';
import { removeDuplicate } from '../../utils/functions';
import { getAIResearchedArticlesFromDb, getAllArticlesByCategory, getArticlesFromDb, getPlanningArticlesFromDb, getWpCreatedArticlesFromDb } from './articlesAPI';

export interface ArticlesState {
  articles: Array<IArticle>;
  planningArticles: Array<IArticle>;
  AIArticles: Array<IArticle>;
  WPArticles: Array<IArticle>;
  CategoryArticles: Array<IArticle>;
  status: 'idle' | 'loading' | 'failed';
  statusPA: 'idle' | 'loading' | 'failed';
  statusAI: 'idle' | 'loading' | 'failed';
  page: number;
  size: number;
  hasMore: boolean;
}

const initialState: ArticlesState = {
  articles: [],
  planningArticles: [],
  AIArticles: [],
  WPArticles: [],
  CategoryArticles: [],
  status: 'idle',
  statusPA: 'idle',
  statusAI: 'idle',
  page: 0,
  size: 200,
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

export const getArticlesByCategory = createAsyncThunk(
  'articles/getArticlesByCategory',
  async (category: string) => {
    try {    
      const result = await getAllArticlesByCategory(category);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const getPlanningArticles = createAsyncThunk(
  'articles/getPlanninglist',
  async (jobId: number) => {
    try {    
      const result = await getPlanningArticlesFromDb(jobId);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const getAIResearchedArticles = createAsyncThunk(
  'articles/getAIResearched',
  async () => {
    try {    
      const result = await getAIResearchedArticlesFromDb();
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const getWpCreatedArticles = createAsyncThunk(
  'articles/getCreated',
  async () => {
    try {    
      const result = await getWpCreatedArticlesFromDb();
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
          state.articles = removeDuplicate([...state.articles, ...action.payload.articles], 'id');//.sort((a, b) => (Number(new Date(a.createAt)) - Number(new Date(b.createAt))))
        }else{
          state.hasMore = false;
        }
      })
      .addCase(getArticles.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(getPlanningArticles.pending, (state) => {
        state.statusPA = 'loading';
      })
      .addCase(getPlanningArticles.fulfilled, (state, action: PayloadAction<Array<IArticle> | false>) => {
        state.statusPA = 'idle';
        state.planningArticles = action.payload !== false ? action.payload.sort((a, b) => a.category && b.category ? b.category > a.category ? -1 : 1 : 1) : [];
      })
      .addCase(getPlanningArticles.rejected, (state) => {
        state.statusPA = 'failed';
      })
      .addCase(getAIResearchedArticles.pending, (state) => {
        state.statusAI = 'loading';
      })
      .addCase(getAIResearchedArticles.fulfilled, (state, action: PayloadAction<Array<IArticle> | false>) => {
        state.statusAI = 'idle';
        state.AIArticles = action.payload !== false ? action.payload.sort((a, b) => a.category && b.category ? b.category > a.category ? -1 : 1 : 1) : [];
      })
      .addCase(getAIResearchedArticles.rejected, (state) => {
        state.statusAI = 'failed';
      })
      .addCase(getWpCreatedArticles.fulfilled, (state, action: PayloadAction<Array<IArticle> | false>) => {
        state.WPArticles = action.payload !== false ? action.payload.sort((a, b) => a.category && b.category ? b.category > a.category ? -1 : 1 : 1) : [];
      })
      .addCase(getArticlesByCategory.fulfilled, (state, action: PayloadAction<Array<IArticle> | false>) => {
        state.CategoryArticles = action.payload !== false ? action.payload.sort((a, b) => a.sysState && b.sysState ? b.sysState > a.sysState ? -1 : 1 : 1) : [];
      });
  },
});

export const { resetArticlesList } = articlesSlice.actions;

export const selectArticles = (state: RootState) => state.articles;

export default articlesSlice.reducer;
