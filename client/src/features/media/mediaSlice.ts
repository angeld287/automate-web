import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import Media from '../../interfaces/models/Media';
import { addMediaToWordpress } from './mediaAPI';

export interface MediaState {
  media: Media;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: MediaState = {
  media: {

  },
  status: 'idle',
};

export const createMedia = createAsyncThunk(
  'media/create',
  async (media: Media) => {
    const response = await addMediaToWordpress(media, "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2VsYWNlaXRlLmRlIiwiaWF0IjoxNjY3OTE2MDYxLCJuYmYiOjE2Njc5MTYwNjEsImV4cCI6MTY2ODUyMDg2MSwiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMyJ9fX0.dCKFexqKuCyykNcTQlG7PVz-SP_qy6J8uJ5tE4tB2AI");
    console.log(response.body);
    
    return response;
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
      })
      .addCase(createMedia.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { increment } = mediaSlice.actions;

export const selectMedia = (state: RootState) => state.media.media;

export default mediaSlice.reducer;
