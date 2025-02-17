// components/Dashboard.tsx
import React from "react";
import { Transaction } from "../model/transaction";

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  // Calculate total expenses
  const totalExpenses = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  // Group transactions by category
  const categoryBreakdown = transactions.reduce<{ [key: string]: number }>((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  // Get most recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {/* Total Expenses Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold">Total Expenses</h3>
        <p className="text-xl font-bold">${totalExpenses.toFixed(2)}</p>
      </div>

      {/* Category Breakdown Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold">Category Breakdown</h3>
        <ul>
          {Object.entries(categoryBreakdown).map(([category, amount]) => (
            <li key={category} className="flex justify-between">
              <span>{category}</span>
              <span>${amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Transactions Card */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <ul>
          {recentTransactions.map((tx) => (
            <li key={tx._id?.toString()} className="flex justify-between border-b py-1">
              <span>{tx.description}</span>
              <span>${tx.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;