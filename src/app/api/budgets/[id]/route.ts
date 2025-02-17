// src/app/api/budget/[id]/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req: Request, context: { params?: { id: string } }) {
  try {
    if (!context.params) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid budget ID" }, { status: 400 });
    }

    const body = await req.json();
    const { category, amount, month } = body;

    if (typeof amount !== "number" || !category || !month) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("personalFinanceDB");
    const collection = db.collection("budgets");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { category, amount, month } }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: "Budget updated successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Budget not found or no changes made" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update budget", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: { params?: { id: string } }) {
  try {
    if (!context.params) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid budget ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("personalFinanceDB");
    const collection = db.collection("budgets");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Budget deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete budget", details: (error as Error).message },
      { status: 500 }
    );
  }
}
