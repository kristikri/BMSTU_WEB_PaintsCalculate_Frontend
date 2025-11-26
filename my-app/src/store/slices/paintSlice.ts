import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Paint } from '../../modules/PaintsTypes'
import { api } from '../../api'

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

export const fetchPaints = createAsyncThunk(
  'paints/fetchPiants',
  async (searchTitle: string | undefined, { rejectWithValue }) => {
    try {
      const response = await api.paints.paintsList({ 
        title: searchTitle
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка загрузки красок');
    }
  }
);

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
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaints.fulfilled, (state, action) => {
        state.loading = false;
        state.paints = action.payload as Paint[];
      })
      .addCase(fetchPaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  }
})

export const { setPaints, setLoading, setError } = paintsSlice.actions
export default paintsSlice.reducer