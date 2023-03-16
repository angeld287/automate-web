import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import IKeyword from '../../interfaces/models/Keyword';
import { addRemoveKeywordToArticle, getKeywordsByArticleId, setMainKeyword } from './keywordAPI';

export interface keywordsState {
  keywords: Array<IKeyword>;
  getAllStatus: 'idle' | 'loading' | 'failed';
  relateStatus: 'idle' | 'loading' | 'failed';
  isMainStatus: 'idle' | 'loading' | 'failed';
}

const initialState: keywordsState = {
  keywords: [],
  getAllStatus: 'idle',
  relateStatus: 'idle',
  isMainStatus: 'idle',
};

export const addRemoveKeywordFromArticle = createAsyncThunk(
  'keywords/addRemoveKeywordFromArticle',
  async ({id, articleId, orderNumber}: {id: string, articleId: string | null, orderNumber: string | null}) => {
    try {    
      const result = await addRemoveKeywordToArticle(id, articleId, orderNumber);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const setKeywordAsMain = createAsyncThunk(
  'keywords/setMainKeyword',
  async ({id, isMain}: {id: string, isMain: boolean}) => {
    try {    
      const result = await setMainKeyword(id, isMain);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const getAllKeywords = createAsyncThunk(
  'keywords/getAllbyArticleId',
  async (articleId: number) => {
    try {    
      const result = await getKeywordsByArticleId(articleId);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const keywordsSlice = createSlice({
  name: 'keywords',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRemoveKeywordFromArticle.pending, (state) => {
        state.relateStatus = 'loading';
      })
      .addCase(addRemoveKeywordFromArticle.fulfilled, (state, action: PayloadAction<IKeyword>) => {
        state.relateStatus = 'idle';
        if(action.payload.articleId){
          state.keywords = [...state.keywords.filter(keyword => keyword.id !== action.payload.id), action.payload].sort((kwA, kwB) => !kwA.orderNumber || !kwB.orderNumber ? 1 : (kwA.orderNumber < kwB.orderNumber ? -1 : 1));
        }else{
          state.keywords = state.keywords.filter(keyword => keyword.id !== action.payload.id);
        }
      })
      .addCase(addRemoveKeywordFromArticle.rejected, (state) => {
        state.relateStatus = 'failed';
      })
      .addCase(setKeywordAsMain.pending, (state) => {
        state.isMainStatus = 'loading';
      })
      .addCase(setKeywordAsMain.fulfilled, (state, action: PayloadAction<IKeyword>) => {
        state.isMainStatus = 'idle';
        state.keywords = [...state.keywords.filter(keyword => keyword.id !== action.payload.id), action.payload].sort((kwA, kwB) => !kwA.orderNumber || !kwB.orderNumber ? 1 : (kwA.orderNumber < kwB.orderNumber ? -1 : 1));
      })
      .addCase(setKeywordAsMain.rejected, (state) => {
        state.isMainStatus = 'failed';
      }).addCase(getAllKeywords.pending, (state) => {
        state.getAllStatus = 'loading';
      })
      .addCase(getAllKeywords.fulfilled, (state, action: PayloadAction<Array<IKeyword>>) => {
        state.getAllStatus = 'idle';
        state.keywords = action.payload;
      })
      .addCase(getAllKeywords.rejected, (state) => {
        state.getAllStatus = 'failed';
      });
  },
});

export const { } = keywordsSlice.actions;

export const selectKeywords = (state: RootState) => state.keywords;

export default keywordsSlice.reducer;
