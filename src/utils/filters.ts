import { Transaction } from "../types";
import { TransactionType } from "../types/TransactionType";

export interface TransactionTypeItem {title: string, value: TransactionType | 'ALL'}

export const filterTransactionsByDateInterval = (t: Transaction, filterFrom, filterTo) => {
    const createdAtDate = new Date(t.createdAt);
    if (filterFrom && filterTo) {
        const dateFrom: Date = new Date(Date.parse(filterFrom));
        const dateTo: Date = new Date(Date.parse(filterTo));
        return createdAtDate >= dateFrom && createdAtDate <= dateTo;
    } else if (filterFrom) {
        const dateFrom: Date = new Date(Date.parse(filterFrom));
        return createdAtDate >= dateFrom;
    } else if (filterTo) {
        const dateTo: Date = new Date(Date.parse(filterTo));
        console.log(createdAtDate + " " + dateTo);
        
        return createdAtDate <= dateTo;
    }
    return true;
}

// export const filterTransactionsByType = (t: Transaction, transactionType: TransactionType | 'All') => {
//     switch (transactionType) {
//         case 'All':
//             return true;
//         case TransactionType.OUTGOING:
//             if (t.type === TransactionType.OUTGOING) return true;
//             else return false;
//         case TransactionType.INCOMING:
//             if (t.type === TransactionType.INCOMING) return true;
//             else return false;
//     }
// }

export function filterTransactionByCurrency (t: Transaction, transactionCurrency: undefined | string) {
     return !transactionCurrency || (transactionCurrency && transactionCurrency === t.currency);
}