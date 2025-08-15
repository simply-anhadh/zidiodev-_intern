import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface ChartData {
  id: string;
  type: '2d-bar' | '2d-line' | '2d-pie' | '2d-scatter' | '3d-column';
  title: string;
  xAxis: string;
  yAxis: string;
  data: any[];
  createdAt: string;
  uploadId: string;
}

interface ChartState {
  charts: ChartData[];
  currentChart: ChartData | null;
  availableColumns: string[];
  isGenerating: boolean;
  error: string | null;
}

const initialState: ChartState = {
  charts: [],
  currentChart: null,
  availableColumns: [],
  isGenerating: false,
  error: null,
};

export const generateChart = createAsyncThunk(
  'chart/generate',
  async (params: {
    type: ChartData['type'];
    title: string;
    xAxis: string;
    yAxis: string;
    uploadId: string;
    data: any[];
  }) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      id: Date.now().toString(),
      ...params,
      createdAt: new Date().toISOString(),
    };
  }
);

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setAvailableColumns: (state, action) => {
      state.availableColumns = action.payload;
    },
    setCurrentChart: (state, action) => {
      state.currentChart = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateChart.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generateChart.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.charts.push(action.payload);
        state.currentChart = action.payload;
      })
      .addCase(generateChart.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.error.message || 'Failed to generate chart';
      });
  },
});

export const { setAvailableColumns, setCurrentChart, clearError } = chartSlice.actions;
export default chartSlice.reducer;