// components/BudgetForm.tsx
import React, { useState, useEffect } from "react";

interface BudgetFormProps {
  onSubmit: (data: { category: string; amount: number; month: string }) => void;
  initialData?: { category: string; amount: number; month: string };
}

const categories = ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Other"];

const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit, initialData }) => {
  const [amount, setAmount] = useState<number>(initialData?.amount || 0);
  const [month, setMonth] = useState<string>(initialData?.month || "");
  const [category, setCategory] = useState<string>(initialData?.category || categories[0]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount);
      setMonth(initialData.month);
      setCategory(initialData.category);
    } else {
      setAmount(0);
      setMonth("");
      setCategory(categories[0]);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !month || !category) {
      setError("Please fill in all fields correctly.");
      return;
    }

    setError("");
    onSubmit({ category, amount, month });

    if (!initialData) {
      setAmount(0);
      setMonth("");
      setCategory(categories[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label>Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded p-2 w-full"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {initialData ? "Update Budget" : "Add Budget"}
      </button>
    </form>
  );
};

export default BudgetForm;
