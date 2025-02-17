// components/BudgetList.tsx
import React from "react";
import { Budget } from "../model/budget";

interface BudgetListProps {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

const BudgetList: React.FC<BudgetListProps> = ({ budgets, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Category</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Month</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((budget) => (
            <tr key={budget._id?.toString()}>
              <td className="border p-2">{budget.category}</td>
              <td className="border p-2">${budget.amount}</td>
              <td className="border p-2">{budget.month}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-green-500 text-white p-1 rounded"
                  onClick={() => onEdit(budget)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-1 rounded"
                  onClick={() => onDelete(budget._id!?.toString())}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetList;
