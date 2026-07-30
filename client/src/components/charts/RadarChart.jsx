import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RadarChart({ labels, data, label = 'Dataset', backgroundColor, borderColor }) {
  const chartData = {
    labels: labels || [],
    datasets: [
      {
        label: label,
        data: data || [],
        backgroundColor: backgroundColor || 'rgba(59, 130, 246, 0.2)', // Blue
        borderColor: borderColor || 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: borderColor || 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: borderColor || 'rgba(59, 130, 246, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#64748b',
        },
        ticks: {
          display: false,
          min: 0,
          max: 100, // Assuming 100 is max for percentage or normalize
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: "'Inter', sans-serif" },
        bodyFont: { family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return <Radar data={chartData} options={options} />;
}
