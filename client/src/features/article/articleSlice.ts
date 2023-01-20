import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { IArticle, SubTitleContent } from '../../interfaces/models/Article';
import { searchKeywordContent } from '../keyword/keywordAPI';
import { getArticleById, getTranslatedKeywords, searchKeywordsContent } from './articleAPI';

export interface ArticleState {
  article: IArticle;
  status: 'idle' | 'loading' | 'failed';
  statusKc: 'idle' | 'loading' | 'failed';
  statusTk: 'idle' | 'loading' | 'failed';
  kewordsTranslated: boolean;
}

const initialState: ArticleState = {
  article: {
    id: 0,
    internalId: 0,
    title: "",
    translatedTitle: "",
    subtitles: [],
    category: "",
    createdAt: "",
    createdBy: 0,
  },
  status: 'idle',
  statusKc: 'idle',
  statusTk: 'idle',
  kewordsTranslated: false,
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

export const translateKeywords = createAsyncThunk(
  'article/translate',
  async (article: IArticle) => {
    try {
      const result = await getTranslatedKeywords(article);
      return result.data.article.subtitles;
    } catch (error) {
      console.log(error)
    }
  }
);

export const getKeywordContent = createAsyncThunk(
  'article/keywordSearch',
  async (subtitle: SubTitleContent) => {
    try {    
      const result = await searchKeywordContent(subtitle);
      return result;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const getArticleByInternalId = createAsyncThunk(
  'article/getArticleById',
  async (internalId: number) => {
    try {    
      const result = await getArticleById(internalId);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    setInititalState: (state) => {
      state.article = initialState.article
    },
    addSubtitles: (state, action: PayloadAction<Array<SubTitleContent>>) => {
      state.article.subtitles = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getKeywordsContent.pending, (state) => {
        state.statusKc = 'loading';
      })
      .addCase(getKeywordsContent.fulfilled, (state, action) => {
        state.statusKc = 'idle';
      })
      .addCase(getKeywordsContent.rejected, (state) => {
        state.statusKc = 'failed';
      })
      .addCase(getArticleByInternalId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getArticleByInternalId.fulfilled, (state, action) => {
        state.status = 'idle';
        state.article = action.payload.article;
      })
      .addCase(getArticleByInternalId.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(translateKeywords.pending, (state) => {
        state.statusTk = 'loading';
      })
      .addCase(translateKeywords.fulfilled, (state, action: PayloadAction<Array<SubTitleContent>>) => {
        state.statusTk = 'idle';
        state.article.subtitles = action.payload
        state.kewordsTranslated = true;
      })
      .addCase(translateKeywords.rejected, (state) => {
        state.statusTk = 'failed';
      });
  },
});

export const { addSubtitles, setInititalState } = articleSlice.actions;

export const selectArticle = (state: RootState) => state.article;

export default articleSlice.reducer;
