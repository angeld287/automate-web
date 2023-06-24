import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { DbMedia, GoogleMedia } from '../../interfaces/models/Media';
import { getBearer } from '../autenticate/authenticateAPI';
import { addMediaToWordpress, addMediaToWordpressOpenAI, deleteImages, getImages, searchImages, updateMediaData } from './mediaAPI';

export interface MediaState {
  media: DbMedia;
  imagesList: Array<DbMedia>;
  googleResults: Array<GoogleMedia>;
  status: 'idle' | 'loading' | 'failed';
  gstatus: 'idle' | 'loading' | 'failed';
  uStatus: 'idle' | 'loading' | 'failed';
  gindex?: string;
  cmError: boolean;
  cmErrorMessage: string;
}

const initialState: MediaState = {
  media: {
    wpId: '0'
  },
  imagesList: [],
  googleResults: [],
  status: 'idle',
  gstatus: 'idle',
  uStatus: 'idle',
  cmError: false,
  cmErrorMessage: '',
};

export const createMedia = createAsyncThunk(
  'media/create',
  async ({title, imageAddress, relatedId, orderNumber, type}: {title: string, imageAddress: string, relatedId: number, orderNumber: string, type?: string}) => {
    const token = getBearer()
    const response = await addMediaToWordpress(imageAddress, title, relatedId, orderNumber, token, type);

    if(response.data.response){
      await updateMediaData({
        alt_text: title,
        title: title,
        caption: title,
        description: title,
        id: response.data.response.wpId
      }, token);
    }

    return response.data;
  }
);

export const createMediaOpenAI = createAsyncThunk(
  'media/createOpenAI',
  async ({title, relatedId, type}: {title: string, relatedId: number, type?: string}) => {
    const token = getBearer()
    const response = await addMediaToWordpressOpenAI(title, relatedId, token, type);

    if(response.data.response){
      await updateMediaData({
        alt_text: title,
        title: title,
        caption: title,
        description: title,
        id: response.data.response.wpId
      }, token);
    }

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
    return result;
  }
);

export const deleteWpImage = createAsyncThunk(
  'media/deleteImage',
  async (id: string) => {
    const result = await deleteImages(id);
    return result.data;
  }
);

export const getImagesList = createAsyncThunk(
  'media/getImages',
  async (siteId: number) => {
    const result = await getImages(siteId);
    return result;
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
    clearMedia: (state) => {
      state.media = {
        wpId: '0'
      }
    },
    clearMediaError: (state) => {
      state.cmError = false;
      state.cmErrorMessage = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMedia.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createMedia.fulfilled, (state, action) => {
        state.status = 'idle';

        if(action.payload.response){
          state.media = {...action.payload.response}
        }else if(action.payload.error){
          state.cmError = true;
          state.cmErrorMessage = action.payload.error;
        }else if(action.payload.errors){
          state.cmError = true;
          state.cmErrorMessage = action.payload.errors[0].message;
        }
        
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
        state.googleResults = action.payload.message === 'Success' ? (state.gindex ? [...state.googleResults, ...action.payload.data.response] : action.payload.data.response) : state.googleResults
        state.gindex = action.payload.data.page
      })
      .addCase(searchGoogleImages.rejected, (state) => {
        state.gstatus = 'failed';
      })
      .addCase(getImagesList.fulfilled, (state, action) => {
        state.imagesList = action.payload.message === 'Success' ? action.payload.data.response : []
      });
  },
});

export const { clearGoogleResults, clearMedia, clearMediaError } = mediaSlice.actions;

export const selectMedia = (state: RootState) => state.media;

export default mediaSlice.reducer;
