import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

interface RequestPaint {
  ID?: number;
  Area?: number;
  Layers?: number;
  PaintID?: number;
  Quantity?: number;
  RequestID?: number;
  paint_title?: string;
  paint_photo?: string;
  hiding_power?: number;
}


interface CalculateCart {
  id?: number;
  paints_count?: number;
  paints?: RequestPaint[];
  status?: string;
  creator_login?: string;
  date_create?: string;
  date_calculate?: string;
}

interface CalculateDetail {
  request: {
    ID: number;
    Status: string;
    DateCreate: string | null;
    DateForm: string | null;
    DateFinish: string | null;
    creator_login: string;
    moderator_login: string | null;
    min_layers: number;
  };
  requestPaints: RequestPaint[];
}


interface CalculateState {
  calculate_id?: number;
  paints_count: number;
  loading: boolean;
  calculateCart: CalculateCart | null;
  error: string | null;
  calculateDetail: CalculateDetail | null;
  saveLoading: {
    date: boolean;
    paints: { [key: number]: boolean };
  };
}

const initialState: CalculateState = {
  calculate_id: undefined,
  paints_count: 0,
  loading: false,
  calculateCart: null,
  calculateDetail: null,
  error: null,
  saveLoading: {
    date: false,
    paints: {}
  }
};

// Получить корзину расчета
export const getCalculateCart = createAsyncThunk(
  'calculate/getCalculateCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.requests.paintsCalculateList();
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { paints_count: 0, paints: [] };
      }
      return rejectWithValue(error.response?.data?.description || 'Ошибка загрузки корзины');
    }
  }
);

// Добавить краску в расчет
export const addToCalculate = createAsyncThunk(
  'calculate/addToCalculate',
  async (paintId : number, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.paint.addToCreate(paintId, {
        area: 1,
        layers: 1
      });
      dispatch(getCalculateCart());
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        dispatch(getCalculateCart());
        return { message: 'already_added' };
      }
      return rejectWithValue(error.response?.data?.description || 'Ошибка добавления краски в расчет');
    }
  }
);

// Удалить краску из расчета
export const removeFromCalculate = createAsyncThunk(
  'calculate/removeFromCalculate',
  async ({ paintId, calculateId }: { paintId: number; calculateId: number }, { rejectWithValue }) => {
    try {
      const response = await api.requestPaints.requestPaintsDelete(calculateId, paintId);
      return { paintId, calculateId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка удаления краски из расчета');
    }
  }
);

// Получить детали расчета
export const getCalculateDetail = createAsyncThunk(
  'calculate/getCalculateDetail',
  async (calculateId: number, { rejectWithValue }) => {
    try {
      const response = await api.requests.requestsDetail(calculateId);

      return {
        request: response.data.request,
        requestPaints: response.data.requestPaints,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.description || 'Ошибка загрузки расчета'
      );
    }
  }
);


// Удалить расчет
export const deleteCalculate = createAsyncThunk(
  'calculate/deleteCalculate',
  async (calculateId: number, { rejectWithValue }) => {
    try {
      const response = await api.requests.deletePaintRequestDelete(calculateId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка удаления расчета');
    }
  }
);

// Обновить минимальное количество слоёв
export const updateCalculateLayers = createAsyncThunk(
  'calculate/updateCalculateLayers',
  async ({ calculateId, min_layers }: { calculateId: number; min_layers: number }, { rejectWithValue }) => {
    try {
      const response = await api.requests.changePaintRequestUpdate(calculateId, {
        min_layers: min_layers
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка обновления даты расчета');
    }
  }
);

// Обновить параметры краски в расчете (площадь, слои)
export const updatePaintParams = createAsyncThunk(
  'calculate/updatePaintParams',
  async ({ 
    paintId, 
    calculateId, 
    area, 
    layers 
  }: { 
    paintId: number; 
    calculateId: number; 
    area: number;
    layers: number;
  }, { rejectWithValue }) => {
    try {
      const response = await api.requestPaints.requestPaintsUpdate(
        calculateId, 
        paintId, 
        { 
          area: area,
          layers: layers
        }
      );
      return { paintId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка обновления параметров');
    }
  }
);

// Сформировать расчет
export const formCalculate = createAsyncThunk(
  'calculate/formCalculate',
  async (calculateId: number, { rejectWithValue }) => {
    try {
      const response = await api.requests.formPaintRequestUpdate(calculateId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка подтверждения расчета');
    }
  }
);

const calculateSlice = createSlice({
  name: 'calculate',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCalculate: (state) => {
      state.calculateCart = null;
      state.paints_count = 0;
      state.calculate_id = undefined;
    },
    removePaintOptimistic: (state, action) => {
      const paintId = action.payload;
      if (state.calculateDetail) {
        const paints = state.calculateDetail.requestPaints  || [];
        const updatedPaints = paints.filter(paint => paint.PaintID !== paintId);
        
        if (state.calculateDetail.requestPaints) {
          state.calculateDetail.requestPaints = updatedPaints;
        }
        if (state.calculateDetail.requestPaints) {
          state.calculateDetail.requestPaints = updatedPaints;
        }
        state.calculateDetail.requestPaints.length = updatedPaints.length;
      }
    },
    revertPaintRemoval: (state) => {
      if (state.calculateDetail?.request.ID) {
        // Можно добавить логику для восстановления состояния
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // getCalculateCart
      .addCase(getCalculateCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCalculateCart.fulfilled, (state, action) => {
        state.loading = false;
        state.calculateCart = action.payload;
        state.paints_count = action.payload.paints_count || 0;
        state.calculate_id = action.payload.id;
      })
      .addCase(getCalculateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.calculateCart = null;
        state.paints_count = 0;
        state.calculate_id = undefined;
      })
      
      // getCalculateDetail
      .addCase(getCalculateDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.calculateDetail = null;
      })
     .addCase(getCalculateDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.calculateDetail = action.payload;
      })
      .addCase(getCalculateDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.calculateDetail = null;
      })
      
      // deleteCalculate
      .addCase(deleteCalculate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCalculate.fulfilled, (state) => {
        state.loading = false;
        state.calculateDetail = null;
        state.calculateCart = null;
        state.paints_count = 0;
        state.calculate_id = undefined;
      })
      .addCase(deleteCalculate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // updateCalculateLayers
      .addCase(updateCalculateLayers.pending, (state) => {
        state.saveLoading.date = true;
        state.error = null;
      })
      .addCase(updateCalculateLayers.fulfilled, (state, action) => {
        state.saveLoading.date = false;
        if (state.calculateDetail) {
          state.calculateDetail.request.min_layers = action.meta.arg.min_layers;
        }
      })
      .addCase(updateCalculateLayers.rejected, (state, action) => {
        state.saveLoading.date = false;
        state.error = action.payload as string;
      })
      
      // updatePaintParams
      .addCase(updatePaintParams.pending, (state, action) => {
        const { paintId } = action.meta.arg;
        state.saveLoading.paints[paintId] = true;
        state.error = null;
      })
      .addCase(updatePaintParams.fulfilled, (state, action) => {
        const { paintId } = action.meta.arg;
        state.saveLoading.paints[paintId] = false;
        
        if (state.calculateDetail) {
          const paints = state.calculateDetail.requestPaints || [];
          const updatedPaints = paints.map(paint => 
            paint.PaintID === paintId 
              ? { 
                  ...paint, 
                  Area: action.meta.arg.area,
                  Layers: action.meta.arg.layers
                }
              : paint
          );
          
          if (state.calculateDetail.requestPaints) {
            state.calculateDetail.requestPaints = updatedPaints;
          }
          if (state.calculateDetail.requestPaints) {
            state.calculateDetail.requestPaints = updatedPaints;
          }
        }
      })
      .addCase(updatePaintParams.rejected, (state, action) => {
        const { paintId } = action.meta.arg;
        state.saveLoading.paints[paintId] = false;
        state.error = action.payload as string;
      })
      
      // removeFromCalculate
      .addCase(removeFromCalculate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCalculate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFromCalculate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // formCalculate
      .addCase(formCalculate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(formCalculate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(formCalculate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCalculate, removePaintOptimistic, revertPaintRemoval } = calculateSlice.actions;
export default calculateSlice.reducer;