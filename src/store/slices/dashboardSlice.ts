import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Upload {
  id: string;
  filename: string;
  uploadedAt: string;
  fileSize: number;
  rows: number;
  columns: string[];
  chartsGenerated: number;
  status: 'processing' | 'completed' | 'failed';
}

interface DashboardState {
  uploads: Upload[];
  totalUploads: number;
  totalCharts: number;
  storageUsed: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  uploads: [
    {
      id: '1',
      filename: 'sales_data_2024.xlsx',
      uploadedAt: '2024-01-15T10:30:00Z',
      fileSize: 245760,
      rows: 1500,
      columns: ['Date', 'Product', 'Sales', 'Revenue', 'Region'],
      chartsGenerated: 3,
      status: 'completed'
    },
    {
      id: '2',
      filename: 'customer_analytics.xlsx',
      uploadedAt: '2024-01-14T15:45:00Z',
      fileSize: 189440,
      rows: 850,
      columns: ['Customer ID', 'Age', 'Gender', 'Purchase Amount', 'Category'],
      chartsGenerated: 2,
      status: 'completed'
    }
  ],
  totalUploads: 2,
  totalCharts: 5,
  storageUsed: 435200,
  isLoading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return initialState;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addUpload: (state, action) => {
      state.uploads.unshift(action.payload);
      state.totalUploads += 1;
    },
    updateUploadStatus: (state, action) => {
      const upload = state.uploads.find(u => u.id === action.payload.id);
      if (upload) {
        upload.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      });
  },
});

export const { addUpload, updateUploadStatus } = dashboardSlice.actions;
export default dashboardSlice.reducer;