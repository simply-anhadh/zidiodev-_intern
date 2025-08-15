import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { Download, Share2, MoreHorizontal } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ThreeJSChart from './ThreeJSChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDisplayProps {
  chart: {
    id: string;
    type: '2d-bar' | '2d-line' | '2d-pie' | '2d-scatter' | '3d-column';
    title: string;
    xAxis: string;
    yAxis: string;
    data: any[];
    createdAt: string;
  };
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({ chart }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: chart.title,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: chart.type !== '2d-pie' ? {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: chart.yAxis,
        },
      },
      x: {
        title: {
          display: true,
          text: chart.xAxis,
        },
      },
    } : {},
  };

  const chartData = {
    labels: chart.data.map(item => item[chart.xAxis]),
    datasets: [
      {
        label: chart.yAxis,
        data: chart.data.map(item => item[chart.yAxis]),
        backgroundColor: chart.type === '2d-pie' 
          ? [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 205, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)',
              'rgba(255, 159, 64, 0.8)',
            ]
          : 'rgba(54, 162, 235, 0.8)',
        borderColor: chart.type === '2d-pie'
          ? [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 205, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ]
          : 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: `${chart.xAxis} vs ${chart.yAxis}`,
        data: chart.data.map(item => ({
          x: item[chart.xAxis],
          y: item[chart.yAxis],
        })),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  const exportToPNG = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = `${chart.title.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const exportToPDF = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${chart.title.replace(/\s+/g, '_')}.pdf`);
    }
  };

  const renderChart = () => {
    if (chart.type === '3d-column') {
      return <ThreeJSChart data={chart.data} xAxis={chart.xAxis} yAxis={chart.yAxis} />;
    }

    switch (chart.type) {
      case '2d-bar':
        return <Bar data={chartData} options={chartOptions} />;
      case '2d-line':
        return <Line data={chartData} options={chartOptions} />;
      case '2d-pie':
        return <Pie data={chartData} options={chartOptions} />;
      case '2d-scatter':
        return <Scatter data={scatterData} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{chart.title}</h3>
          <p className="text-sm text-gray-500">
            Created on {new Date(chart.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={exportToPNG}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            PNG
          </button>
          <button
            onClick={exportToPDF}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            PDF
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div ref={chartRef} className="w-full h-96">
        {renderChart()}
      </div>
    </motion.div>
  );
};

export default ChartDisplay;