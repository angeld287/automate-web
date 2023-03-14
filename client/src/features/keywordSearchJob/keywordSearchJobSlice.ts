import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import IKeyword, { IKeywordSearchJob } from '../../interfaces/models/Keyword';
import { addRemoveKeywordToArticle, getAllSearchJobs, getSearchJob, selectPotentialKeyword, setMainKeyword } from './keywordSearchJobAPI';

export interface keywordSearchJobState {
  keywordSearchJob: IKeywordSearchJob;
  status: 'idle' | 'loading' | 'failed';
  AllJobs: Array<IKeywordSearchJob>;
  getAllStatus: 'idle' | 'loading' | 'failed';
  selectStatus: 'idle' | `loading` | 'failed';
  relateStatus: 'idle' | 'loading' | 'failed';
  isMainStatus: 'idle' | 'loading' | 'failed';
}

const initialState: keywordSearchJobState = {
  keywordSearchJob: {
    id: 0,
    createdBy: ''
  },
  status: 'idle',
  getAllStatus: 'idle',
  selectStatus: 'idle',
  relateStatus: 'idle',
  isMainStatus: 'idle',
  AllJobs: []
};

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

export const addRemoveKeywordFromArticle = createAsyncThunk(
  'keywordSearchJob/addRemoveKeywordFromArticle',
  async ({id, articleId}: {id: string, articleId: string | null}) => {
    try {    
      const result = await addRemoveKeywordToArticle(id, articleId);
      return result.data.response;
    } catch (error) {
      console.log(error) 
    }
  }
);

export const setKeywordAsMain = createAsyncThunk(
  'keywordSearchJob/setMainKeyword',
  async ({id, isMain}: {id: string, isMain: boolean}) => {
    try {    
      const result = await setMainKeyword(id, isMain);
      return result.data.response;
    } catch (error) {
      console.log(error) 
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
        state.AllJobs = action.payload;
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
          state.keywordSearchJob.keywords = [...state.keywordSearchJob.keywords.filter(keyword => keyword.id !== action.payload.id), action.payload].sort((kwA, kwB) => kwA.similarity < kwB.similarity ? -1 : (kwA.similarity > kwB.similarity ? 1 : kwA.name < kwB.name ? -1 : 1));;
      })
      .addCase(selectKeyword.rejected, (state) => {
        state.selectStatus = 'failed';
      })
      .addCase(addRemoveKeywordFromArticle.pending, (state) => {
        state.relateStatus = 'loading';
      })
      .addCase(addRemoveKeywordFromArticle.fulfilled, (state, action: PayloadAction<IKeyword>) => {
        state.relateStatus = 'idle';
        if(state.keywordSearchJob.keywords)
          state.keywordSearchJob.keywords = [...state.keywordSearchJob.keywords.filter(keyword => keyword.id !== action.payload.id), action.payload].sort((kwA, kwB) => kwA.similarity < kwB.similarity ? -1 : (kwA.similarity > kwB.similarity ? 1 : kwA.name < kwB.name ? -1 : 1));;
      })
      .addCase(addRemoveKeywordFromArticle.rejected, (state) => {
        state.relateStatus = 'failed';
      })
      .addCase(setKeywordAsMain.pending, (state) => {
        state.isMainStatus = 'loading';
      })
      .addCase(setKeywordAsMain.fulfilled, (state, action: PayloadAction<IKeyword>) => {
        state.isMainStatus = 'idle';
        if(state.keywordSearchJob.keywords)
          state.keywordSearchJob.keywords = [...state.keywordSearchJob.keywords.filter(keyword => keyword.id !== action.payload.id), action.payload].sort((kwA, kwB) => kwA.similarity < kwB.similarity ? -1 : (kwA.similarity > kwB.similarity ? 1 : kwA.name < kwB.name ? -1 : 1));;
      })
      .addCase(setKeywordAsMain.rejected, (state) => {
        state.isMainStatus = 'failed';
      });
  },
});

export const { } = keywordSearchJobSlice.actions;

export const selectKeywordSearchJob = (state: RootState) => state.keywordSearchJob;

export default keywordSearchJobSlice.reducer;
