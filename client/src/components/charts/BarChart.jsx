import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ labels, values, label = "Data", data }) => {
  const chartData = data || {
    labels: labels || [],
    datasets: [
      {
        label,
        data: values || [],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        hoverBackgroundColor: 'rgba(99, 102, 241, 1)',
        borderRadius: 6,
        borderWidth: 0,
      },
    ],
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  const tooltipBg = isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const tooltipTitle = isDark ? '#fff' : '#0f172a';
  const tooltipBody = isDark ? '#e2e8f0' : '#475569';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTitle,
        bodyColor: tooltipBody,
        padding: 12,
        cornerRadius: 8,
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
          drawBorder: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11
          }
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: textColor,
          font: {
            size: 11
          }
        },
      },
    },
  };

  return (
    <div className="relative h-64 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
