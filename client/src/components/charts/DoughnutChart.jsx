import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { useTheme } from '../../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ data }) => {
  const { theme } = useTheme();
  
  if (!data) return null;

  const chartData = data.datasets ? data : {
    labels: data.labels || [],
    datasets: [
      {
        data: data.values || [],
        backgroundColor: data.colors || [
          'rgba(59, 130, 246, 0.8)', // blue-500
          'rgba(139, 92, 246, 0.8)', // violet-500
          'rgba(16, 185, 129, 0.8)', // emerald-500
          'rgba(245, 158, 11, 0.8)', // amber-500
          'rgba(239, 68, 68, 0.8)',  // red-500
        ],
        borderColor: data.borderColors || [
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const isDark = theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const tooltipBg = isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const tooltipTitle = isDark ? '#fff' : '#0f172a';
  const tooltipBody = isDark ? '#e2e8f0' : '#475569';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTitle,
        bodyColor: tooltipBody,
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
  };

  return (
    <div className="relative h-64 w-full flex items-center justify-center">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;
