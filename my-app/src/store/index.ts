import { configureStore } from '@reduxjs/toolkit'
import paintsReducer from './slices/paintSlice'
import searchReducer from './slices/searchSlice'
import userReducer from './slices/userSlice'
import calculateReducer from './slices/calculateSlice'

export const store = configureStore({
  reducer: {
    paints: paintsReducer,
    search: searchReducer,
    user: userReducer,
    calculate: calculateReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch