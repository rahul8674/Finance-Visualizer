// components/BudgetVsActualChart.tsx
import React from "react";
import { Budget } from "../model/budget";
import { Transaction } from "../model/transaction";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

// Registering necessary chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface BudgetVsActualChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const BudgetVsActualChart: React.FC<BudgetVsActualChartProps> = ({ transactions, budgets }) => {
  // Group transactions by category (Actual Expenses)
  const categoryBreakdown = transactions.reduce<{ [key: string]: number }>((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  // Budget vs Actual data
  const budgetVsActual = budgets.map((budget) => {
    const actual = categoryBreakdown[budget.category] || 0;
    return {
      category: budget.category,
      budget: budget.amount,
      actual,
      difference: budget.amount - actual,
    };
  });

  // Chart Data for Budget vs Actual
  const chartData = {
    labels: budgetVsActual.map((item) => item.category),
    datasets: [
      {
        label: "Budget",
        data: budgetVsActual.map((item) => item.budget),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Actual",
        data: budgetVsActual.map((item) => item.actual),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
      <Chart type="bar" data={chartData} options={{ responsive: true }} />
  );
};

export default BudgetVsActualChart;