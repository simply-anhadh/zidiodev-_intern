import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import ChartDisplay from '../components/Charts/ChartDisplay';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

const Analytics: React.FC = () => {
  const { charts } = useSelector((state: RootState) => state.chart);
  const { uploads } = useSelector((state: RootState) => state.dashboard);

  const totalDataPoints = uploads.reduce((acc, upload) => acc + upload.rows, 0);
  const totalCharts = charts.length;
  const avgChartsPerUpload = uploads.length > 0 ? (totalCharts / uploads.length).toFixed(1) : '0';

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive view of your data analysis and visualization history.
          </p>
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Charts</p>
                <p className="text-2xl font-bold text-gray-900">{totalCharts}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Data Points</p>
                <p className="text-2xl font-bold text-gray-900">{totalDataPoints.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <PieChart className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Charts/Upload</p>
                <p className="text-2xl font-bold text-gray-900">{avgChartsPerUpload}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Files</p>
                <p className="text-2xl font-bold text-gray-900">{uploads.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Gallery */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Generated Charts</h2>
          
          {charts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
            >
              <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Charts Generated Yet</h3>
              <p className="text-gray-600 mb-6">
                Upload an Excel file and create your first chart to see it here.
              </p>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Get Started
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {charts.map((chart, index) => (
                <motion.div
                  key={chart.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ChartDisplay chart={chart} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Usage Insights */}
        {uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Most Used Columns</h4>
                <div className="space-y-2">
                  {['Sales', 'Revenue', 'Date', 'Product', 'Region'].map((column, index) => (
                    <div key={column} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{column}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${100 - index * 15}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{100 - index * 15}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Chart Type Distribution</h4>
                <div className="space-y-2">
                  {[
                    { type: 'Bar Charts', percentage: 40 },
                    { type: 'Line Charts', percentage: 30 },
                    { type: 'Pie Charts', percentage: 20 },
                    { type: '3D Charts', percentage: 10 },
                  ].map((item) => (
                    <div key={item.type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.type}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;