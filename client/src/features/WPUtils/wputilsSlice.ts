import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import ICategory from '../../interfaces/models/Category';
import { getCategories } from './wputilsAPI';

export interface WPUtilsState {
  categories: Array<ICategory>;
  statusc: 'idle' | 'loading' | 'failed';
}

const initialState: WPUtilsState = {
  categories: [],
  statusc: 'loading',
};

export const getCategoryList = createAsyncThunk(
  'wputils/getCategories',
  async () => {
    try {
      const response = await getCategories();
      return response.data.response;
    } catch (error) {
      return new Error('Error in WPUtilsState at getCategoryList.')
    }
  }
);

export const wputilsSlice = createSlice({
  name: 'wputils',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategoryList.pending, (state) => {
        state.statusc = 'loading';
      })
      .addCase(getCategoryList.fulfilled, (state, action) => {
        state.statusc = 'idle';
        state.categories = action.payload
      })
      .addCase(getCategoryList.rejected, (state) => {
        state.statusc = 'failed';
      });
  },
});

//export const { } = wputilsSlice.actions;

export const selectWputils = (state: RootState) => state.wputils;

export default wputilsSlice.reducer;
