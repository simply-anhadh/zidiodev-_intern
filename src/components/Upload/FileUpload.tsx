import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addUpload, updateUploadStatus } from '../../store/slices/dashboardSlice';
import { setAvailableColumns } from '../../store/slices/chartSlice';

interface FileUploadProps {
  onFileProcessed?: (data: any[], columns: string[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const dispatch = useDispatch();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processExcelFile = async (file: File) => {
    // Mock Excel processing - in real app, use SheetJS/xlsx
    setUploading(true);
    
    const uploadId = Date.now().toString();
    const newUpload = {
      id: uploadId,
      filename: file.name,
      uploadedAt: new Date().toISOString(),
      fileSize: file.size,
      rows: 0,
      columns: [] as string[],
      chartsGenerated: 0,
      status: 'processing' as const
    };
    
    dispatch(addUpload(newUpload));

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data - in real app, this would come from SheetJS parsing
      const mockColumns = ['Date', 'Product', 'Sales', 'Revenue', 'Region', 'Category'];
      const mockData = Array.from({ length: 100 }, (_, i) => ({
        Date: `2024-01-${String(i % 30 + 1).padStart(2, '0')}`,
        Product: `Product ${String.fromCharCode(65 + (i % 5))}`,
        Sales: Math.floor(Math.random() * 1000) + 100,
        Revenue: Math.floor(Math.random() * 50000) + 10000,
        Region: ['North', 'South', 'East', 'West'][i % 4],
        Category: ['Electronics', 'Clothing', 'Books', 'Home'][i % 4]
      }));
      
      const updatedUpload = {
        ...newUpload,
        rows: mockData.length,
        columns: mockColumns,
        status: 'completed' as const
      };
      
      dispatch(updateUploadStatus({ id: uploadId, status: 'completed' }));
      dispatch(setAvailableColumns(mockColumns));
      
      setUploadStatus('success');
      setUploading(false);
      
      if (onFileProcessed) {
        onFileProcessed(mockData, mockColumns);
      }
      
    } catch (error) {
      dispatch(updateUploadStatus({ id: uploadId, status: 'failed' }));
      setUploadStatus('error');
      setUploading(false);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    );

    if (excelFile) {
      setUploadedFile(excelFile);
      await processExcelFile(excelFile);
    } else {
      setUploadStatus('error');
    }
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      await processExcelFile(file);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadStatus('idle');
    setUploading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Excel File</h2>
        
        {uploadStatus === 'idle' && !uploading && (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Drop your Excel file here
            </h3>
            <p className="text-gray-600 mb-4">
              or click to browse your files
            </p>
            <p className="text-sm text-gray-500">
              Supports .xlsx and .xls files up to 10MB
            </p>
          </div>
        )}

        {uploading && (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <FileSpreadsheet className="h-8 w-8 text-blue-600" />
              </motion.div>
            </motion.div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing File</h3>
            <p className="text-gray-600">Analyzing your Excel data...</p>
            <div className="mt-4 w-48 mx-auto bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
              />
            </div>
          </div>
        )}

        {uploadStatus === 'success' && uploadedFile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">File Uploaded Successfully!</h3>
            <p className="text-gray-600 mb-4">{uploadedFile.name}</p>
            <button
              onClick={resetUpload}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Upload Another File
            </button>
          </motion.div>
        )}

        {uploadStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Failed</h3>
            <p className="text-gray-600 mb-4">
              Please make sure you're uploading a valid Excel file (.xlsx or .xls)
            </p>
            <button
              onClick={resetUpload}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FileUpload;