import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function LineChart({ labels, values, label = 'Dataset' }) {
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label,
        data: values,
        borderColor: 'rgb(99, 102, 241)', // Indigo 500
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4, // Smooth curve
        pointBackgroundColor: 'rgb(79, 70, 229)', // Indigo 600
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 0,
        max: 10,
        grid: {
          color: 'rgba(226, 232, 240, 0.5)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: { family: "'Inter', sans-serif" },
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          font: { family: "'Inter', sans-serif" },
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}
