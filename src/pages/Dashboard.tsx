import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FileSpreadsheet, BarChart3, Users, HardDrive } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import StatsCard from '../components/Dashboard/StatsCard';
import UploadHistory from '../components/Dashboard/UploadHistory';
import { RootState, AppDispatch } from '../store';
import { fetchDashboardData } from '../store/slices/dashboardSlice';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { totalUploads, totalCharts, storageUsed, isLoading } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your analytics overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Uploads"
            value={totalUploads}
            change="+12% from last month"
            changeType="increase"
            icon={FileSpreadsheet}
            iconColor="bg-blue-600"
          />
          <StatsCard
            title="Charts Generated"
            value={totalCharts}
            change="+8% from last month"
            changeType="increase"
            icon={BarChart3}
            iconColor="bg-green-600"
          />
          <StatsCard
            title="Storage Used"
            value={formatFileSize(storageUsed)}
            change="2.1 MB available"
            changeType="neutral"
            icon={HardDrive}
            iconColor="bg-orange-600"
          />
          <StatsCard
            title="Active Users"
            value="1,234"
            change="+5% from last month"
            changeType="increase"
            icon={Users}
            iconColor="bg-purple-600"
          />
        </div>

        {/* Upload History */}
        <UploadHistory />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <FileSpreadsheet className="h-8 w-8 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Upload New File</p>
                <p className="text-sm text-gray-500">Add Excel files for analysis</p>
              </div>
            </button>
            <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Create Chart</p>
                <p className="text-sm text-gray-500">Generate visualizations</p>
              </div>
            </button>
            <button className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div className="text-left">
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-500">Explore data insights</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;