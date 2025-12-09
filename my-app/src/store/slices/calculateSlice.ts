import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

interface Paint {
  id: number;
  title: string;
  description: string;
  hiding_power: number;
  photo: string;
  is_delete: boolean;
}

interface RequestPaint {
  id?: number;
  area?: number;
  layers?: number;
  paintID?: number;
  quantity?: number;
  requestID?: number;
  paint?: Paint;
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
  id: number;
  count: number;
  requestPaints?: RequestPaint[];
  paints?: RequestPaint[];
  date_calculate?: string;
  min_layers?: number;
  [key: string]: any;
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
  async ({ paintId }: { paintId: number }, { rejectWithValue, dispatch }) => {
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
      const data = response.data;
      const normalizedData: CalculateDetail = {
        id: data.id,
        count: data.count || data.paints_count || 0,
        requestPaints: data.requestPaints || data.paints || [],
        date_calculate: data.date_calculate,
        min_layers: data.min_layers,
        ...data
      };
      return normalizedData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.description || 'Ошибка загрузки расчета');
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

// Обновить дату расчета
export const updateCalculateDate = createAsyncThunk(
  'calculate/updateCalculateDate',
  async ({ calculateId, date }: { calculateId: number; date: string }, { rejectWithValue }) => {
    try {
      const response = await api.requests.changePaintRequestUpdate(calculateId, {
        dateFinish: date
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
        const paints = state.calculateDetail.requestPaints || state.calculateDetail.paints || [];
        const updatedPaints = paints.filter(paint => paint.paintID !== paintId);
        
        if (state.calculateDetail.requestPaints) {
          state.calculateDetail.requestPaints = updatedPaints;
        }
        if (state.calculateDetail.paints) {
          state.calculateDetail.paints = updatedPaints;
        }
        state.calculateDetail.count = updatedPaints.length;
      }
    },
    revertPaintRemoval: (state) => {
      if (state.calculateDetail?.id) {
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
      
      // updateCalculateDate
      .addCase(updateCalculateDate.pending, (state) => {
        state.saveLoading.date = true;
        state.error = null;
      })
      .addCase(updateCalculateDate.fulfilled, (state, action) => {
        state.saveLoading.date = false;
        if (state.calculateDetail) {
          state.calculateDetail.date_calculate = action.meta.arg.date;
        }
      })
      .addCase(updateCalculateDate.rejected, (state, action) => {
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
          const paints = state.calculateDetail.requestPaints || state.calculateDetail.paints || [];
          const updatedPaints = paints.map(paint => 
            paint.paintID === paintId 
              ? { 
                  ...paint, 
                  area: action.meta.arg.area,
                  layers: action.meta.arg.layers
                }
              : paint
          );
          
          if (state.calculateDetail.requestPaints) {
            state.calculateDetail.requestPaints = updatedPaints;
          }
          if (state.calculateDetail.paints) {
            state.calculateDetail.paints = updatedPaints;
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