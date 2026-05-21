import { TransactionType } from "./TransactionType";

export interface Category {
  id?: number;
  name: string;
  description: string;
}

export interface Transaction {
  id?: number;
  createdAt: Date;
  category: Category;
  amount: number;
  type: TransactionType;
  currency: string;
  counterparty?: string;
  description: string;
}
