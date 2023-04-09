import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { IArticle, INewPlanningArticle, SubTitleContent } from '../../interfaces/models/Article';
import IContent from '../../interfaces/models/Content';
import ApiResponse from '../../interfaces/Responses/ApiResponse';
import { getBearer } from '../autenticate/authenticateAPI';
import { searchKeywordContent } from '../subtitle/subtitleAPI';
import { ArticleState as State} from '../../interfaces/Enums/States'
import { createArticle, createContentForArticle, createPost, editArticleState, editArticleTitle, getArticleById, getTranslatedKeywords, searchKeywordsContent } from './articleAPI';

export interface ArticleState {
  article: IArticle;
  articleState: State;
  status: 'idle' | 'loading' | 'failed';
  statusKc: 'idle' | 'loading' | 'failed';
  statusTk: 'idle' | 'loading' | 'failed';
  statusCC: 'idle' | 'loading' | 'failed';
  statusCP: 'idle' | 'loading' | 'failed';
  statusCA: 'idle' | 'loading' | 'failed';
  kewordsTranslated: boolean;
  error: string | false;
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
  articleState: State.DRAFT,
  status: 'idle',
  statusKc: 'idle',
  statusTk: 'idle',
  statusCC: 'idle',
  statusCP: 'idle',
  statusCA: 'idle',
  error: false,
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
      return result.data.response.article;
    } catch (error) {
      throw new Error('Error in ArticleState at getArticleByInternalId')
    }
  }
);

export const createArticleIntroAndConclusion = createAsyncThunk(
  'article/createContent',
  async (contents: Array<IContent>) => {
    try {    
      const result = await createContentForArticle(contents);
      return result.data.response;
    } catch (error) {
      throw new Error('Error in ArticleState at createArticleIntroAndConclusion')
    }
  }
);

export const createWpPost = createAsyncThunk(
  'article/createWpPost',
  async (article: IArticle) => {
    try {    
      const token = getBearer()
      const result = await createPost(article, token);
      return result;
    } catch (error) {
      throw new Error('Error in ArticleState at createWpPost')
    }
  }
);

export const createNewArticle = createAsyncThunk(
  'article/createNewArticle',
  async (article: INewPlanningArticle) => {
    try {    
      const token = getBearer()
      const result = await createArticle(article, token);
      return result;
    } catch (error) {
      throw new Error('Error in ArticleState at createNewArticle')
    }
  }
);

export const updateArticleTitle = createAsyncThunk(
  'article/addArticleTitle',
  async ({id, title}: {id: number, title: string}) => {
    try {    
      const result = await editArticleTitle(id, title);
      return result;
    } catch (error) {
      throw new Error('Error in ArticleState at updateArticleTitle')
    }
  }
);

export const updateArticleState = createAsyncThunk(
  'article/addArticleState',
  async ({id, state}: {id: number, state: string}) => {
    try {    
      const result = await editArticleState(id, state);
      return result;
    } catch (error) {
      throw new Error('Error in ArticleState at updateArticleState')
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
    setErrorFalse: (state) => {
      state.error = false
    }
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
      .addCase(getArticleByInternalId.fulfilled, (state, action: PayloadAction<IArticle>) => {
        state.status = 'idle';
        const subs = [...action.payload.subtitles];
        const content = action.payload.contents ? [...action.payload.contents] : [];
        state.article = action.payload;
        state.article.contents = content.sort((a, b) => (a.orderNumber && b.orderNumber) ? (a.orderNumber < b.orderNumber ? -1 : 1) : 1);
        state.article.subtitles = subs.sort((subA, subB) => (subA.orderNumber < subB.orderNumber ? -1 : 1))
        state.articleState = action.payload.wpLink ? State.CREATED_IN_WP : State.DRAFT
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
      })
      .addCase(createArticleIntroAndConclusion.pending, (state) => {
        state.statusCC = 'loading';
      })
      .addCase(createArticleIntroAndConclusion.fulfilled, (state, action: PayloadAction<Array<IContent>>) => {
        state.statusCC = 'idle';
        if(state.article.contents) state.article.contents = [...state.article.contents, ...action.payload];
      })
      .addCase(createArticleIntroAndConclusion.rejected, (state) => {
        state.statusCC = 'failed';
      })
      .addCase(createWpPost.pending, (state) => {
        state.statusCP = 'loading';
      })
      .addCase(createWpPost.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.error = action.payload.message === 'Error' ? action.payload.data.message : false;
        state.article = action.payload.message === 'Success' ? action.payload.data.article : state.article;
        state.statusCP = 'idle';
        state.articleState = action.payload.message === 'Error' ? State.DRAFT : State.CREATED_IN_WP;
      })
      .addCase(createWpPost.rejected, (state) => {
        state.statusCP = 'failed';
      })
      .addCase(createNewArticle.pending, (state) => {
        state.statusCA = 'loading';
      })
      .addCase(createNewArticle.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.error = action.payload.message === 'Error' ? action.payload.data.message : false;
        state.article = action.payload.message === 'Success' ? action.payload.data.article : state.article;
        state.statusCA = 'idle';
        state.articleState = action.payload.message === 'Error' ? State.DRAFT : State.CREATED_IN_WP;
      })
      .addCase(createNewArticle.rejected, (state) => {
        state.statusCA = 'failed';
      });
  },
});

export const { setErrorFalse, updateSubtitle, setKewordsTranslated, addCategory, addTitle, addSubtitles, setArticleInititalState } = articleSlice.actions;

export const selectArticle = (state: RootState) => state.article;

export default articleSlice.reducer;
