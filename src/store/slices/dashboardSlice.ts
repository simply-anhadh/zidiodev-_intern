import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserUploads, FirestoreUpload } from '../../lib/firestore';

interface DashboardState {
  uploads: FirestoreUpload[];
  totalUploads: number;
  totalCharts: number;
  storageUsed: number;
  activeUsers: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  uploads: [],
  totalUploads: 0,
  totalCharts: 0,
  storageUsed: 0,
  activeUsers: 0,
  isLoading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (userId: string) => {
    const uploads = await getUserUploads(userId);
    const totalCharts = uploads.reduce((sum, u) => sum + (u.chartsGenerated || 0), 0);
    const storageUsed = uploads.reduce((sum, u) => sum + (u.fileSize || 0), 0);
    return {
      uploads,
      totalUploads: uploads.length,
      totalCharts,
      storageUsed,
    };
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addUpload: (state, action: PayloadAction<FirestoreUpload>) => {
      state.uploads.unshift(action.payload);
      state.totalUploads += 1;
      state.storageUsed += action.payload.fileSize;
    },
    updateUploadStatus: (state, action: PayloadAction<{ id: string; status: FirestoreUpload['status'] }>) => {
      const upload = state.uploads.find(u => u.id === action.payload.id);
      if (upload) {
        upload.status = action.payload.status;
      }
    },
    setActiveUsers: (state, action: PayloadAction<number>) => {
      state.activeUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.uploads = action.payload.uploads;
        state.totalUploads = action.payload.totalUploads;
        state.totalCharts = action.payload.totalCharts;
        state.storageUsed = action.payload.storageUsed;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      });
  },
});

export const { addUpload, updateUploadStatus, setActiveUsers } = dashboardSlice.actions;
export default dashboardSlice.reducer;