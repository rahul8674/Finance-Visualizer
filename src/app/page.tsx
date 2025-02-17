// src/app/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";
import ExpensesChart from "../components/ExpensesChart";
import CategoryChart from "../components/CategoryChart";
import Dashboard from "../components/Dashboard";
import BudgetForm from "../components/BudgetForm";
import BudgetList from "../components/BudgetList";
import BudgetVsActualChart from "../components/BudgetVsActualChart";
import { Transaction } from "../model/transaction";
import { Budget } from "../model/budget";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Fetch all data initially
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, budgetsRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/budgets"),
        ]);
        setTransactions(await transactionsRes.json());
        setBudgets(await budgetsRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      setTransactions(await res.json());
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleFetchBudgets = async () => {
    try {
      const res = await fetch("/api/budgets");
      setBudgets(await res.json());
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const handleAddTransaction = useCallback(async (txData: { amount: number; date: string; description: string }) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txData),
      });
      if (res.ok) handleFetchTransactions();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  }, []);

  const handleUpdateTransaction = useCallback(async (id: string, txData: { amount: number; date: string; description: string }) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txData),
      });
      if (res.ok) {
        setEditingTransaction(null);
        handleFetchTransactions();
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  }, []);

  const handleDeleteTransaction = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) handleFetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  }, []);

  const handleAddBudget = useCallback(async (budgetData: { category: string; amount: number; month: string }) => {
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgetData),
      });
      if (res.ok) handleFetchBudgets();
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  }, []);

  const handleUpdateBudget = useCallback(async (id: string, budgetData: { category: string; amount: number; month: string }) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgetData),
      });
      if (res.ok) {
        setEditingBudget(null);
        handleFetchBudgets();
      }
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  }, []);

  const handleDeleteBudget = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
      if (res.ok) handleFetchBudgets();
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Personal Finance Visualizer</h1>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dashboard & Transaction Form */}
        <div className="space-y-6">
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
            <Dashboard transactions={transactions} />
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{editingTransaction ? "Edit Transaction" : "Add Transaction"}</h2>
            <TransactionForm
              onSubmit={(txData) => {
                editingTransaction?._id
                  ? handleUpdateTransaction(editingTransaction._id.toString(), txData)
                  : handleAddTransaction(txData);
              }}
              initialData={editingTransaction || undefined}
            />
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white p-4 shadow rounded-lg overflow-auto">
          <h2 className="text-xl font-semibold mb-2">Transactions</h2>
          <TransactionList transactions={transactions} onEdit={setEditingTransaction} onDelete={handleDeleteTransaction} />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 shadow rounded-lg"><ExpensesChart transactions={transactions} /></div>
        <div className="bg-white p-4 shadow rounded-lg"><CategoryChart transactions={transactions} /></div>
      </div>

      {/* Budget Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <BudgetForm
            onSubmit={(budgetData) => {
              editingBudget?._id
                ? handleUpdateBudget(editingBudget._id.toString(), budgetData)
                : handleAddBudget(budgetData);
            }}
            initialData={editingBudget || undefined}
          />
        </div>
        <div className="bg-white p-4 shadow rounded-lg"><BudgetList budgets={budgets} onEdit={setEditingBudget} onDelete={handleDeleteBudget} /></div>
      </div>

      {/* Budget vs Actual */}
      <div className="bg-white p-4 shadow rounded-lg mt-6"><BudgetVsActualChart transactions={transactions} budgets={budgets} /></div>
    </div>
  );
}
