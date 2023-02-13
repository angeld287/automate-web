import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import Media, { DbMedia } from '../../interfaces/models/Media';
import { getBearer } from '../autenticate/authenticateAPI';
import { addMediaToWordpress, updateMediaData } from './mediaAPI';

export interface MediaState {
  media: DbMedia;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: MediaState = {
  media: {
    wpId: '0'
  },
  status: 'idle',
};

export const createMedia = createAsyncThunk(
  'media/create',
  async ({title, imageAddress, type, relatedId}: {title: string, imageAddress: string, type: string, relatedId: number}) => {
    const token = getBearer()
    const response = await addMediaToWordpress(imageAddress, title, type, relatedId, token);
    return response.data.response;
  }
);

export const updateMedia = createAsyncThunk(
  'media/update',
  async (media: Media) => {
    const bearer = getBearer()
    const response = await updateMediaData(media, bearer);
    return response.body;
  }
);

export const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    increment: (state) => {
      
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMedia.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createMedia.fulfilled, (state, action) => {
        state.status = 'idle';
        state.media = {...action.payload}
      })
      .addCase(createMedia.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { increment } = mediaSlice.actions;

export const selectMedia = (state: RootState) => state.media;

export default mediaSlice.reducer;
