import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import IKeyword, { IKeywordSearchJob } from '../../interfaces/models/Keyword';
import { getBearer } from '../autenticate/authenticateAPI';
import { createArticleFromKeyword, createKeyword, updateKeywordCategory } from '../keywords/keywordAPI';
import { deleteKeywordSearchJob, getAllSearchJobs, getSearchJob, selectPotentialKeyword, startNewJob } from './keywordSearchJobAPI';

export interface keywordSearchJobState {
  keywordSearchJob: IKeywordSearchJob;
  status: 'idle' | 'loading' | 'failed';
  AllJobs: Array<IKeywordSearchJob>;
  getAllStatus: 'idle' | 'loading' | 'failed';
  selectStatus: 'idle' | `loading` | 'failed';
  AICreateStatus: 'idle' | 'loading' | 'failed';
}

const initialState: keywordSearchJobState = {
  keywordSearchJob: {
    id: 0,
    createdBy: ''
  },
  status: 'idle',
  getAllStatus: 'idle',
  selectStatus: 'idle',
  AllJobs: [],
  AICreateStatus: 'idle',
};

export const startKeywordsSearchJob = createAsyncThunk(
  'keywordSearchJob/start',
  async ({longTailKeyword, mainKeywords}: {longTailKeyword: string, mainKeywords: Array<string>}) => {
    try {    
      const result = await startNewJob(longTailKeyword, mainKeywords);
      return result.data.jobDetails;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const getAllJobs = createAsyncThunk(
  'keywordSearchJob/getAll',
  async () => {
    try {    
      const result = await getAllSearchJobs();
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const getSearchJobDetails = createAsyncThunk(
  'keywordSearchJob/getDetails',
  async (id: number) => {
    try {    
      const result = await getSearchJob(id);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const selectKeyword = createAsyncThunk(
  'keywordSearchJob/selectKeyword',
  async ({id, selected}: {id: number, selected: boolean}) => {
    try {    
      const result = await selectPotentialKeyword(id, selected);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const deleteJob = createAsyncThunk(
  'keywordSearchJob/deleteJob',
  async (id: number) => {
    try {    
      const result = await deleteKeywordSearchJob(id);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const setKeywordCategory = createAsyncThunk(
  'keywords/updateCategory',
  async ({id, category}: {id: string, category: string}) => {
    try {    
      const result = await updateKeywordCategory(id, category);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const openAICreateArticle = createAsyncThunk(
  'keywords/createArticleOpenAI',
  async ({text, keywordId, jobId, category}: {text: string, keywordId: number, jobId: number, category: string}) => {
    try {
      const token = getBearer();
      const result = await createArticleFromKeyword(text, keywordId, jobId, category, token);
      return result.data.keyword;
    } catch (error) {
      throw new Error('Error in ArticleState at openAICreateArticle')
    }
  }
);

export const createKeywordManually = createAsyncThunk(
  'keywords/createKeywordManually',
  async ({name, jobId}: {name: string, jobId: string}) => {
    try {
      const result = await createKeyword(name, jobId);
      return result.data.response;
    } catch (error) {
      throw new Error('Error in ArticleState at createKeywordManually')
    }
  }
);

export const keywordSearchJobSlice = createSlice({
  name: 'keywordSearchJob',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllJobs.fulfilled, (state, action: PayloadAction<Array<IKeywordSearchJob>>) => {
        state.status = 'idle';
        state.AllJobs = action.payload.sort((a,b) => {
          const createAtA: any = a.createdAt ? new Date(a.createdAt) : 0;
          const createAtB: any = b.createdAt ? new Date(b.createdAt) : 0;
          return (a.createdAt && b.createdAt) ? createAtB - createAtA : 1
        });
      })
      .addCase(startKeywordsSearchJob.fulfilled, (state, action: PayloadAction<IKeywordSearchJob>) => {
        state.AllJobs = [...state.AllJobs, action.payload].sort((a,b) => {
          const createAtA: any = a.createdAt ? new Date(a.createdAt) : 0;
          const createAtB: any = b.createdAt ? new Date(b.createdAt) : 0;
          return (a.createdAt && b.createdAt) ? createAtB - createAtA : 1
        });
      })
      .addCase(getAllJobs.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(getSearchJobDetails.pending, (state) => {
        state.getAllStatus = 'loading';
      })
      .addCase(getSearchJobDetails.fulfilled, (state, action: PayloadAction<IKeywordSearchJob>) => {
        state.getAllStatus = 'idle';
        state.keywordSearchJob = action.payload;
      })
      .addCase(getSearchJobDetails.rejected, (state) => {
        state.getAllStatus = 'failed';
      })
      .addCase(selectKeyword.pending, (state) => {
        state.selectStatus = 'loading';
      })
      .addCase(selectKeyword.fulfilled, (state, action: PayloadAction<IKeyword>) => {
        state.selectStatus = 'idle';
        if(state.keywordSearchJob.keywords)
          state.keywordSearchJob.keywords = [...state.keywordSearchJob.keywords.filter(keyword => keyword.id !== action.payload.id), action.payload].sort((kwA, kwB) => kwA.similarity < kwB.similarity ? -1 : (kwA.similarity > kwB.similarity ? 1 : kwA.name < kwB.name ? -1 : 1)); 
      })
      .addCase(createKeywordManually.fulfilled, (state, action: PayloadAction<IKeyword>) => {
        if(state.keywordSearchJob.keywords)
          state.keywordSearchJob.keywords = [...state.keywordSearchJob.keywords, action.payload].sort((kwA, kwB) => kwA.similarity < kwB.similarity ? -1 : (kwA.similarity > kwB.similarity ? 1 : kwA.name < kwB.name ? -1 : 1)); 
      })
      .addCase(selectKeyword.rejected, (state) => {
        state.selectStatus = 'failed';
      })
      .addCase(setKeywordCategory.fulfilled, (state, action: PayloadAction<IKeyword>) => {
        if(state.keywordSearchJob.keywords)
          state.keywordSearchJob.keywords = [...state.keywordSearchJob.keywords.filter(keyword => keyword.id !== action.payload.id), action.payload].sort((kwA, kwB) => kwA.similarity < kwB.similarity ? -1 : (kwA.similarity > kwB.similarity ? 1 : kwA.name < kwB.name ? -1 : 1)); 
      })
      .addCase(openAICreateArticle.pending, (state) => {
        state.AICreateStatus = 'loading';
      })
      .addCase(openAICreateArticle.fulfilled, (state, action: PayloadAction<IKeyword>) => {
        state.AICreateStatus = 'idle';
        if(state.keywordSearchJob.keywords)
          state.keywordSearchJob.keywords = [...state.keywordSearchJob.keywords.filter(keyword => keyword.id !== action.payload.id), action.payload].sort((kwA, kwB) => kwA.similarity < kwB.similarity ? -1 : (kwA.similarity > kwB.similarity ? 1 : kwA.name < kwB.name ? -1 : 1)); 
      })
      .addCase(openAICreateArticle.rejected, (state) => {
        state.AICreateStatus = 'failed';
      });
  },
});

export const { } = keywordSearchJobSlice.actions;

export const selectKeywordSearchJob = (state: RootState) => state.keywordSearchJob;

export default keywordSearchJobSlice.reducer;
