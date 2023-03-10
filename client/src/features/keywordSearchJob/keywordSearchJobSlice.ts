import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { IKeywordSearchJob } from '../../interfaces/models/Keyword';
import { getAllSearchJobs, getSearchJob } from './keywordSearchJobAPI';

export interface keywordSearchJobState {
  keywordSearchJob: IKeywordSearchJob;
  status: 'idle' | 'loading' | 'failed';
  AllJobs: Array<IKeywordSearchJob>;
  getAllStatus: 'idle' | 'loading' | 'failed';
}

const initialState: keywordSearchJobState = {
  keywordSearchJob: {
    id: 0,
    createdBy: ''
  },
  status: 'idle',
  getAllStatus: 'idle',
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
      });
  },
});

export const { } = keywordSearchJobSlice.actions;

export const selectKeywordSearchJob = (state: RootState) => state.keywordSearchJob;

export default keywordSearchJobSlice.reducer;
