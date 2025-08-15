import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import FileUpload from '../components/Upload/FileUpload';
import ChartGenerator from '../components/Charts/ChartGenerator';

const Upload: React.FC = () => {
  const [fileProcessed, setFileProcessed] = useState(false);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const handleFileProcessed = (data: any[], cols: string[]) => {
    setProcessedData(data);
    setColumns(cols);
    setFileProcessed(true);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload & Analyze</h1>
          <p className="text-gray-600 mt-1">
            Upload your Excel files and generate beautiful charts and visualizations.
          </p>
        </div>

        <FileUpload onFileProcessed={handleFileProcessed} />

        {fileProcessed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ChartGenerator />
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Upload;