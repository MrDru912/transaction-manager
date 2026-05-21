import { Category } from "..";

export interface TransactionDTO {
  id?: number;
  createdAt: string;
  category: Category;
  amount: number;
  type: string;
  currency: string;
  counterparty?: string;
  description: string;
}
