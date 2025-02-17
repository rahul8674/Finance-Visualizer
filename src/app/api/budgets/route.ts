// src/app/api/budget/route.ts
import { NextResponse } from "next/server";
import clientPromise from '@/lib/mongodb';
import { Budget } from '@/model/budget';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("personalFinanceDB");
    const budgets = await db.collection<Budget>("budgets").find({}).toArray();

    return NextResponse.json(budgets, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { category, amount, month } = await req.json();

    if (typeof amount !== "number" || !category || !month) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("personalFinanceDB");
    const collection = db.collection<Budget>("budgets");

    const newBudget: Budget = { category, amount, month };
    const result = await collection.insertOne(newBudget);

    return NextResponse.json({ ...newBudget, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add budget" }, { status: 500 });
  }
}
