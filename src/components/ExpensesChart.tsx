// components/ExpensesChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '../model/transaction';

interface ExpensesChartProps {
  transactions: Transaction[];
}

const ExpensesChart: React.FC<ExpensesChartProps> = ({ transactions }) => {
  // Group transactions by month
  const dataMap: { [key: string]: number } = {};
  transactions.forEach((tx) => {
    const month = new Date(tx.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    dataMap[month] = (dataMap[month] || 0) + tx.amount;
  });

  const chartData = Object.keys(dataMap).map((month) => ({
    month,
    total: dataMap[month],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="total" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpensesChart;
