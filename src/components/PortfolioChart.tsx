'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { usePortfolioStore } from '@/lib/store';
import { CATEGORY_COLORS, getCategoryForSymbol } from '@/lib/constants';
import { formatNumber } from '@/lib/api';

ChartJS.register(ArcElement, Tooltip, Legend);

export function PortfolioChart() {
  const { getPortfolioData } = usePortfolioStore();
  const portfolioData = getPortfolioData();

  // Group by category
  const categoryData = portfolioData.reduce((acc, position) => {
    const category = getCategoryForSymbol(position.symbol);
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += position.value;
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.keys(categoryData);
  const values = Object.values(categoryData);
  const colors = categories.map(category => CATEGORY_COLORS[category] || '#94a3b8');

  const data = {
    labels: categories,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: colors.map(color => color + '80'),
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#1a1b1e',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${formatNumber(value)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
  };

  return (
    <div className="card-gradient rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Portfolio Allocation</h3>
      <div className="h-80">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
} 