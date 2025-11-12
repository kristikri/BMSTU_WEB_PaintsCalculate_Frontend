import { configureStore } from '@reduxjs/toolkit'
import paintsReducer from './slices/paintsSlice'
import searchReducer from './slices/searchSlice'

export const store = configureStore({
  reducer: {
    paints: paintsReducer,
    search: searchReducer,
  },
  devTools: true 
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch