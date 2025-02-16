// src/app/page.tsx
"use client";
import { useState, useEffect } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import ExpensesChart from "../components/ExpensesChart";
import CategoryChart from "../components/CategoryChart";
import Dashboard from "../components/Dashboard";
import { Transaction } from "../model/transaction";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  // Fetch transactions from API
  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const addTransaction = async (txData: {
    amount: number;
    date: string;
    description: string;
  }) => {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(txData),
    });
    if (res.ok) {
      fetchTransactions();
    } else {
      alert("Error adding transaction");
    }
  };

  const updateTransaction = async (
    id: string,
    txData: { amount: number; date: string; description: string }
  ) => {
    const res = await fetch(`/api/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(txData),
    });

    if (res.ok) {
      setEditingTransaction(null);
      fetchTransactions();
    } else {
      alert("Error updating transaction");
    }
  };

  const deleteTransaction = async (id: string) => {
    const res = await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchTransactions();
    } else {
      alert("Error deleting transaction");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Personal Finance Visualizer
      </h1>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column (Dashboard & Transaction Form) */}
        <div className="space-y-6">
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
            <Dashboard transactions={transactions} />
          </div>

          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-2">
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <TransactionForm
              onSubmit={(txData) => {
                if (editingTransaction?._id) {
                  updateTransaction(editingTransaction._id.toString(), txData);
                } else {
                  addTransaction(txData);
                }
              }}
              initialData={
                editingTransaction
                  ? {
                      amount: editingTransaction.amount,
                      date: editingTransaction.date,
                      description: editingTransaction.description,
                      category: editingTransaction.category,
                    }
                  : undefined
              }
            />
          </div>
        </div>

        {/* Right Column (Transaction List) */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Transactions</h2>
          <TransactionList
            transactions={transactions}
            onEdit={(tx) => setEditingTransaction(tx)}
            onDelete={deleteTransaction}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Monthly Expenses Chart */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Monthly Expenses</h2>
          <ExpensesChart transactions={transactions} />
        </div>

        {/* Category-wise Breakdown Chart */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-2">
            Category-wise Breakdown
          </h2>
          <CategoryChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
