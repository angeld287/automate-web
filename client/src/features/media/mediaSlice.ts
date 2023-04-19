import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import Media, { DbMedia, GoogleMedia } from '../../interfaces/models/Media';
import { getBearer } from '../autenticate/authenticateAPI';
import { addMediaToWordpress, addMediaToWordpressOpenAI, searchImages, updateMediaData } from './mediaAPI';

export interface MediaState {
  media: DbMedia;
  googleResults: Array<GoogleMedia>;
  status: 'idle' | 'loading' | 'failed';
  gstatus: 'idle' | 'loading' | 'failed';
  uStatus: 'idle' | 'loading' | 'failed';
  gindex?: string;
}

const initialState: MediaState = {
  media: {
    wpId: '0'
  },
  googleResults: [],
  status: 'idle',
  gstatus: 'idle',
  uStatus: 'idle',
};

export const createMedia = createAsyncThunk(
  'media/create',
  async ({title, imageAddress, type, relatedId}: {title: string, imageAddress: string, type: string, relatedId: number}) => {
    const token = getBearer()
    const response = await addMediaToWordpress(imageAddress, title, type, relatedId, token);
    await updateMediaData({
      alt_text: title,
      title: title,
      caption: title,
      description: title,
      id: response.data.response.wpId
    }, token);
    return response.data.response;
  }
);

export const createMediaOpenAI = createAsyncThunk(
  'media/createOpenAI',
  async ({title, type, relatedId}: {title: string, type: string, relatedId: number}) => {
    const token = getBearer()
    const response = await addMediaToWordpressOpenAI(title, type, relatedId, token);
    await updateMediaData({
      alt_text: title,
      title: title,
      caption: title,
      description: title,
      id: response.data.response.wpId
    }, token);
    return response.data.response;
  }
);

export const updateMedia = createAsyncThunk(
  'media/update',
  async ({id, title}:{id: string, title: string}) => {
    const bearer = getBearer()
    const response = await updateMediaData({
        alt_text: title,
        title: title,
        caption: title,
        description: title,
        id
      }, bearer);
    return response;
  }
);

export const searchGoogleImages = createAsyncThunk(
  'media/searchImage',
  async ({keyword, index}:{keyword: string, index?: string}) => {
    const result = await searchImages(keyword, index);
    return result.data;
  }
);

export const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    clearGoogleResults: (state) => {
      state.googleResults = []
      state.gindex = undefined;
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
      })
      .addCase(createMediaOpenAI.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createMediaOpenAI.fulfilled, (state, action) => {
        state.status = 'idle';
        state.media = {...action.payload}
      })
      .addCase(createMediaOpenAI.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(updateMedia.pending, (state) => {
        state.uStatus = 'loading';
      })
      .addCase(updateMedia.fulfilled, (state, action) => {
        state.uStatus = 'idle';
        state.media = {...action.payload}
      })
      .addCase(updateMedia.rejected, (state) => {
        state.uStatus = 'failed';
      })
      .addCase(searchGoogleImages.pending, (state) => {
        state.gstatus = 'loading';
      })
      .addCase(searchGoogleImages.fulfilled, (state, action) => {
        state.gstatus = 'idle';
        state.googleResults = state.gindex ? [...state.googleResults, ...action.payload.response] : action.payload.response
        state.gindex = action.payload.page
      })
      .addCase(searchGoogleImages.rejected, (state) => {
        state.gstatus = 'failed';
      });
  },
});

export const { clearGoogleResults } = mediaSlice.actions;

export const selectMedia = (state: RootState) => state.media;

export default mediaSlice.reducer;
