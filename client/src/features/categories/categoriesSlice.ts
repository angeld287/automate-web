import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import ICategory from '../../interfaces/models/Category';
import { addCategory, getCategories } from './categoriesAPI';
import { getBearer } from '../autenticate/authenticateAPI';

export interface CategoriesState {
  categories: Array<ICategory>;
  statusc: 'idle' | 'loading' | 'failed';
}

const initialState: CategoriesState = {
  categories: [],
  statusc: 'loading',
};

export const getCategoryList = createAsyncThunk(
  'categories/getCategories',
  async () => {
    try {
      const response = await getCategories();
      return response.data.response;
    } catch (error) {
      return new Error('Error in CategoriesState at getCategoryList.')
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/addCategory',
  async (category: ICategory) => {
    try {
      const token = await getBearer()
      const response = await addCategory(category, token);
      return response.data.response;
    } catch (error) {
      return new Error('Error in CategoriesState at addCategory.')
    }
  }
);

export const categoriesSlice = createSlice({
  name: 'categories',
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
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories = [...state.categories, action.payload];
      });
  },
});

//export const { } = categoriesSlice.actions;

export const selectCategoriesUtils = (state: RootState) => state.categories;
export default categoriesSlice.reducer;
