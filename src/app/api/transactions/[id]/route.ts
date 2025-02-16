// src/app/api/transactions/[id]/route.ts
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
      return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 });
    }

    const body = await req.json();
    const { amount, date, description, category } = body;

    if (typeof amount !== "number" || !date || !description || !category) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("personalFinanceDB");
    const collection = db.collection("transactions");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { amount, date, description, category } }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: "Transaction updated successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Transaction not found or no changes made" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update transaction", details: (error as Error).message },
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
      return NextResponse.json({ error: "Invalid transaction ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("personalFinanceDB");
    const collection = db.collection("transactions");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Transaction deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete transaction", details: (error as Error).message },
      { status: 500 }
    );
  }
}
