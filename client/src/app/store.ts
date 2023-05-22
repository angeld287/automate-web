import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import mediaReducer from '../features/media/mediaSlice';
import articleReducer from '../features/article/articleSlice';
import articlesReducer from '../features/articles/articlesSlice';
import subtitleReducer from '../features/subtitle/subtitleSlice';
import userSessionReducer from '../features/userSession/userSessionSlice';
import userRegisterReducer from '../features/userRegister/userRegisterSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import keywordSearchJobReducer from '../features/keywordSearchJob/keywordSearchJobSlice';
import keywordsReducer from '../features/keywords/keywordSlice';
import configurationsReducer from '../features/configurations/configurationsSlice';

const authMiddleware = (store: any) => (next: any) => (action: any) => {
  if(action.type === "userSession/login/fulfilled"){
    localStorage.setItem('wp-token', action.payload.data.session.wpToken.body.token);
  }else if(action.type === "userSession/logout/fulfilled"){
    localStorage.setItem('wp-token', '');
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    media: mediaReducer,
    article: articleReducer,
    articles: articlesReducer,
    subtitle: subtitleReducer,
    userSession: userSessionReducer,
    userRegister: userRegisterReducer,
    categories: categoriesReducer,
    keywordSearchJob: keywordSearchJobReducer,
    keywords: keywordsReducer,
    configurations: configurationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }).concat(authMiddleware),

});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
