import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import mediaReducer from '../features/media/mediaSlice';
import articleReducer from '../features/article/articleSlice';
import articlesReducer from '../features/articles/articlesSlice';
import keywordReducer from '../features/keyword/keywordSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    media: mediaReducer,
    article: articleReducer,
    articles: articlesReducer,
    keyword: keywordReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
