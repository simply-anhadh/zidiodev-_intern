import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart3, LineChart, PieChart, ScatterChart as Scatter, Box } from 'lucide-react';
import { RootState } from '../../store';
import { generateChart } from '../../store/slices/chartSlice';
import { AppDispatch } from '../../store';
import ChartDisplay from './ChartDisplay';

const ChartGenerator: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'2d-bar' | '2d-line' | '2d-pie' | '2d-scatter' | '3d-column'>('2d-bar');
  const [selectedXAxis, setSelectedXAxis] = useState('');
  const [selectedYAxis, setSelectedYAxis] = useState('');
  const [chartTitle, setChartTitle] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const { availableColumns, isGenerating, currentChart } = useSelector((state: RootState) => state.chart);

  const chartTypes = [
    { id: '2d-bar', name: '2D Bar Chart', icon: BarChart3, description: 'Compare values across categories' },
    { id: '2d-line', name: '2D Line Chart', icon: LineChart, description: 'Show trends over time' },
    { id: '2d-pie', name: '2D Pie Chart', icon: PieChart, description: 'Show proportions of a whole' },
    { id: '2d-scatter', name: '2D Scatter Plot', icon: Scatter, description: 'Show correlation between variables' },
    { id: '3d-column', name: '3D Column Chart', icon: Box, description: 'Interactive 3D visualization' },
  ];

  const handleGenerateChart = async () => {
    if (!selectedXAxis || !selectedYAxis || !chartTitle) return;

    // Mock data generation - in real app, this would process actual Excel data
    const mockData = Array.from({ length: 20 }, (_, i) => ({
      [selectedXAxis]: `Item ${i + 1}`,
      [selectedYAxis]: Math.floor(Math.random() * 100) + 10,
    }));

    await dispatch(generateChart({
      type: selectedType,
      title: chartTitle,
      xAxis: selectedXAxis,
      yAxis: selectedYAxis,
      uploadId: 'mock-upload-id',
      data: mockData,
    }));
  };

  if (availableColumns.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-600">Upload an Excel file to start generating charts</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Chart Generator</h2>
        
        {/* Chart Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Chart Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {chartTypes.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedType(type.id as any)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <type.icon className={`h-6 w-6 mb-2 ${
                  selectedType === type.id ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <h3 className="font-medium text-sm text-gray-900">{type.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{type.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chart Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chart Title</label>
            <input
              type="text"
              value={chartTitle}
              onChange={(e) => setChartTitle(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter chart title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">X-Axis</label>
            <select
              value={selectedXAxis}
              onChange={(e) => setSelectedXAxis(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select X-Axis</option>
              {availableColumns.map((column) => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Y-Axis</label>
            <select
              value={selectedYAxis}
              onChange={(e) => setSelectedYAxis(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select Y-Axis</option>
              {availableColumns.map((column) => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateChart}
          disabled={!selectedXAxis || !selectedYAxis || !chartTitle || isGenerating}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? 'Generating Chart...' : 'Generate Chart'}
        </button>
      </motion.div>

      {/* Chart Display */}
      {currentChart && <ChartDisplay chart={currentChart} />}
    </div>
  );
};

export default ChartGenerator;