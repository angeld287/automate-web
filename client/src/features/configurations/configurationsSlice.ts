import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { addSite, getSites } from './configurationsAPI';
import { getBearer } from '../autenticate/authenticateAPI';
import ISite from '../../interfaces/models/ISite';

export interface ConfigurationsState {
  sites: Array<ISite>;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ConfigurationsState = {
  sites: [],
  status: 'idle',
};

export const getSiteList = createAsyncThunk(
  'configurations/getSites',
  async () => {
    try {
      const response = await getSites();
      return response.data.response;
    } catch (error) {
      return new Error('Error in ConfigurationsState at getSiteList.')
    }
  }
);

export const createSite = createAsyncThunk(
  'configurations/addSite',
  async (site: ISite) => {
    try {
      const token = await getBearer()
      const response = await addSite(site, token);
      return response.data.response;
    } catch (error) {
      return new Error('Error in ConfigurationsState at createSite.')
    }
  }
);

export const configurationsSlice = createSlice({
  name: 'configurations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSiteList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSiteList.fulfilled, (state, action) => {
        state.status = 'idle';
        state.sites = action.payload.sort((a: ISite, b: ISite) => b.name > a.name ? -1 : 1);
      })
      .addCase(getSiteList.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(createSite.fulfilled, (state, action) => {
        state.sites = [...state.sites, action.payload].sort((a: ISite, b: ISite) => b.name > a.name ? -1 : 1);
      });
  },
});

//export const { } = sitesSlice.actions;

export const selectSitesUtils = (state: RootState) => state.configurations;
export default configurationsSlice.reducer;
