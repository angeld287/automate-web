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
      throw new Error('Error in ArticleState at getKeywordsContent')
    }
  }
);

export const translateKeywords = createAsyncThunk(
  'article/translate',
  async (article: IArticle) => {
    try {
      const result = await getTranslatedKeywords(article);
      return result.data.article;
    } catch (error) {
      throw new Error('Error in ArticleState at translateKeywords')
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
      throw new Error('Error in ArticleState at getKeywordContent')
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
      throw new Error('Error in ArticleState at getArticleByInternalId')
    }
  }
);

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    setArticleInititalState: (state) => {
      state.article = initialState.article
    },
    addSubtitles: (state, action: PayloadAction<Array<SubTitleContent>>) => {
      state.article.subtitles = action.payload
    },
    updateSubtitle: (state, action: PayloadAction<SubTitleContent>) => {
      const _subtitles = [...state.article.subtitles];
      _subtitles[_subtitles.findIndex(subtitle => action.payload.id === subtitle.id)] = action.payload
      state.article.subtitles = _subtitles
    },
    addTitle: (state, action: PayloadAction<string>) => {
      state.article.title = action.payload
    },
    addCategory: (state, action: PayloadAction<string>) => {
      state.article.category = action.payload
    },
    setKewordsTranslated: (state, action: PayloadAction<boolean>) => {
      state.kewordsTranslated = action.payload
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
        const subs = [...action.payload.article.subtitles];
        state.article = action.payload.article;
        state.article.subtitles = subs.sort((subA, subB) => (subA.orderNumber < subB.orderNumber ? -1 : 1))
      })
      .addCase(getArticleByInternalId.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(translateKeywords.pending, (state) => {
        state.statusTk = 'loading';
      })
      .addCase(translateKeywords.fulfilled, (state, action: PayloadAction<IArticle>) => {
        state.statusTk = 'idle';
        state.article = action.payload
        state.kewordsTranslated = true;
      })
      .addCase(translateKeywords.rejected, (state) => {
        state.statusTk = 'failed';
      });
  },
});

export const { updateSubtitle, setKewordsTranslated, addCategory, addTitle, addSubtitles, setArticleInititalState } = articleSlice.actions;

export const selectArticle = (state: RootState) => state.article;

export default articleSlice.reducer;
