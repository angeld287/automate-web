import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { IArticle, SubTitleContent } from '../../interfaces/models/Article';

export interface ArticleState {
  article: IArticle;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ArticleState = {
  article: {
    title: "",
    translatedTitle: "",
    subtitiles: [],
    category: "",
  },
  status: 'idle',
};

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    addSubtitles: (state, action: PayloadAction<Array<SubTitleContent>>) => {
      state.article.subtitiles = action.payload
    },
  }
});

export const { addSubtitles } = articleSlice.actions;

export const selectArticle = (state: RootState) => state.article.article;

export default articleSlice.reducer;
