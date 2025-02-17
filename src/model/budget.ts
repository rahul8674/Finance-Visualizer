// model/budget.ts
import { ObjectId } from 'mongodb';

export interface Budget {
    _id?: ObjectId;
    category: string;
    amount: number;
    month: string; 
}
