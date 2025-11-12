import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
  searchTitle: string
  searchHistory: string[]
}

const initialState: SearchState = {
  searchTitle: '',
  searchHistory: []
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTitle: (state, action: PayloadAction<string>) => {
      state.searchTitle = action.payload
    },
    addToHistory: (state, action: PayloadAction<string>) => {
      if (action.payload && !state.searchHistory.includes(action.payload)) {
        state.searchHistory.push(action.payload)
      }
    },
    clearSearch: (state) => {
      state.searchTitle = ''
    }
  }
})

export const { setSearchTitle, addToHistory, clearSearch } = searchSlice.actions
export default searchSlice.reducer