// src/app/api/transactions/route.ts
import { NextResponse } from "next/server";
import clientPromise from '@/lib/mongodb';
import { Transaction } from '@/model/transaction';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("personalFinanceDB");
    const transactions = await db.collection<Transaction>("transactions").find({}).toArray();

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { amount, date, description, category } = await req.json();

    if (typeof amount !== "number" || !date || !description || !category) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("personalFinanceDB");
    const collection = db.collection<Transaction>("transactions");

    const newTransaction: Transaction = { amount, date, description, category };
    const result = await collection.insertOne(newTransaction);

    return NextResponse.json({ ...newTransaction, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add transaction" }, { status: 500 });
  }
}