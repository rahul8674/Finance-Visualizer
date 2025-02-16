// components/TransactionForm.tsx
import React, { useState, useEffect } from "react";

interface TransactionFormProps {
  onSubmit: (data: { amount: number; date: string; description: string; category: string }) => void;
  initialData?: { amount: number; date: string; description: string; category: string };
}

const categories = ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Other"];

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, initialData }) => {
  const [amount, setAmount] = useState<number>(initialData?.amount || 0);
  const [date, setDate] = useState<string>(initialData?.date || "");
  const [description, setDescription] = useState<string>(initialData?.description || "");
  const [category, setCategory] = useState<string>(initialData?.category || categories[0]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount);
      setDate(initialData.date);
      setDescription(initialData.description);
      setCategory(initialData.category);
    } else {
      setAmount(0);
      setDate("");
      setDescription("");
      setCategory(categories[0]);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !date || !description || !category) {
      setError("Please fill in all fields correctly.");
      return;
    }

    setError("");
    onSubmit({ amount, date, description, category });

    if (!initialData) {
      setAmount(0);
      setDate("");
      setDescription("");
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
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        {initialData ? "Update Transaction" : "Add Transaction"}
      </button>
    </form>
  );
};

export default TransactionForm;
