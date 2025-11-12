import { createSlice } from '@reduxjs/toolkit'
import type { Paint } from '../../modules/PaintsTypes'

interface PaintsState {
  paints: Paint[]
  loading: boolean
  error: string | null
}

const initialState: PaintsState = {
  paints: [],
  loading: false,
  error: null
}

const paintsSlice = createSlice({
  name: 'paints',
  initialState,
  reducers: {
    setPaints: (state, action) => {
      state.paints = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setPaints, setLoading, setError } = paintsSlice.actions
export default paintsSlice.reducer