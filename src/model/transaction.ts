// model/transaction.ts
import { ObjectId } from 'mongodb';

export interface Transaction {
    _id?: ObjectId;  
    amount: number;
    date: string;  
    description: string;
    category: string;
  }