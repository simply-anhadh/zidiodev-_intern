import React from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Calendar, Database, TrendingUp, MoreVertical } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const UploadHistory: React.FC = () => {
  const { uploads } = useSelector((state: RootState) => state.dashboard);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Upload History</h3>
        <p className="text-sm text-gray-600 mt-1">Recent Excel file uploads and analysis</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {uploads.map((upload, index) => (
          <motion.div
            key={upload.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {upload.filename}
                  </h4>
                  
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(upload.uploadedAt)}
                    </div>
                    <div className="flex items-center">
                      <Database className="h-4 w-4 mr-1" />
                      {upload.rows} rows
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {upload.chartsGenerated} charts
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {upload.columns.slice(0, 3).map((column) => (
                      <span
                        key={column}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {column}
                      </span>
                    ))}
                    {upload.columns.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                        +{upload.columns.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>
                  {upload.status}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              File size: {formatFileSize(upload.fileSize)}
            </div>
          </motion.div>
        ))}
      </div>
      
      {uploads.length === 0 && (
        <div className="p-6 text-center">
          <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No uploads yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by uploading your first Excel file.</p>
        </div>
      )}
    </div>
  );
};

export default UploadHistory;