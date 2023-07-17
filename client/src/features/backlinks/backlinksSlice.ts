import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { StartDofollowSearchJob } from './backlinksAPI';
import IBacklink from '../../interfaces/models/IBacklink';

export interface BacklinksState {
  backlinks: Array<IBacklink>;
  getBKLState: 'idle' | 'loading' | 'failed';
}

const initialState: BacklinksState = {
  backlinks: [],
  getBKLState: 'idle',
};

export const startBacklinksSearch = createAsyncThunk(
  'backlinks/startBacklinksSearch',
  async (query: string) => {
    try {    
      const result = await StartDofollowSearchJob(query);
      return result.data.response;
    } catch (error) {
      console.log(error)
    }
  }
);

export const backlinkSlice = createSlice({
  name: 'backlinks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startBacklinksSearch.pending, (state) => {
        state.getBKLState = 'loading';
      })
      .addCase(startBacklinksSearch.fulfilled, (state, action) => {
        state.getBKLState = 'idle';
      })
      .addCase(startBacklinksSearch.rejected, (state) => {
        state.getBKLState = 'failed';
      })
  },
});

export const { } = backlinkSlice.actions;

export const selectChannel = (state: RootState) => state.channels;

export default backlinkSlice.reducer;
