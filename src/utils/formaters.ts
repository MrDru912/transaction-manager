import { Transaction } from "../types";
import { TransactionType } from "../types/TransactionType";

export function getFormattedAmount(t: Transaction): string {
    return `${t.type === TransactionType.INCOMING ? "+" : "-"}${t.amount} ${t.currency}`;
  }
