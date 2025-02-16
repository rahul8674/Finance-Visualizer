// components/TransactionList.tsx
import React from 'react';
import { Transaction } from '../model/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id?.toString()}>
              <td className="border p-2">${tx.amount}</td>
              <td className="border p-2">{new Date(tx.date).toLocaleDateString()}</td>
              <td className="border p-2">{tx.description}</td>
              <td className="border p-2">{tx.category}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-green-500 text-white p-1 rounded"
                  onClick={() => onEdit(tx)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-1 rounded"
                  onClick={() => onDelete(tx._id!?.toString())}
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

export default TransactionList;
