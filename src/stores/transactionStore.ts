import { defineStore } from 'pinia'
import { Transaction } from '../interfaces/Transaction';
import { ref } from 'vue';

export const useTransactionsStore = defineStore('transactions', () => {
const transactions = ref<Transaction[]>([
  new Transaction(new Date(), '-', 180, "CZK", "Albert", "Prague", "Groceries", "tea and honey"),
  new Transaction(new Date(), '-', 200, "USD", "Burger King", "Atlanta", "Groceries", "Wopper adn fries"),
  new Transaction(new Date(), '-', 5000, "CZK", "SUZ CVUT", "Prague", "Accomodation", "dorm"),
  new Transaction(new Date(), '-', 1200, "CZK", "PID", "Prague", "Transportation", "litacka"),
  new Transaction(new Date(), '-', 800, "CZK", "Zara", "Prague", "Clothes", "pants"),
  new Transaction(new Date(), '-', 2000, "CZK", "Decatlon", "Prague", "Clothes", "shoes"),
  new Transaction(new Date(), '-', 700, "USD", "SilliconHill", "Prague", "Internet", ""),
  new Transaction(new Date(), '-', 700, "USD", "SilliconHill", "Prague", "D", ""),
  new Transaction(new Date(), '-', 700, "USD", "SilliconHill", "Prague", "Internet", ""),
  new Transaction(new Date(), '-', 700, "EUR", "SilliconHill", "Prague", "Internet", ""),
  new Transaction(new Date(), '-', 700, "EUR", "SilliconHill", "Prague", "Transportation", ""),
  new Transaction(new Date(), '-', 500, "EUR", "SilliconHill", "Prague", "Household goods", ""),
  new Transaction(new Date(), '-', 700, "EUR", "SilliconHill", "Prague", "Transportation", ""),
  new Transaction(new Date(), '-', 678, "USD", "SilliconHill", "Prague", "Household goods", ""),
  new Transaction(new Date(), '-', 230, "EUR", "SilliconHill", "Prague", "C", ""),
  new Transaction(new Date(), '-', 100, "EUR", "SilliconHill", "Prague", "B", ""),
  new Transaction(new Date(), '-', 180, "USD", "SilliconHill", "Prague", "B", ""),
  new Transaction(new Date(), '-', 340, "CZK", "SilliconHill", "Prague", "A", ""),
  new Transaction(new Date(), '-', 2300, "CZK", "SilliconHill", "Prague", "Clothes", ""),
  new Transaction(new Date(), '-', 200, "CZK", "SilliconHill", "Prague", "Household goods", "")
]);


    const categories = ref(["Groceries", "Clothes", "Accomodation", "Entertainment", "Transportation", "Internet", "Household goods",
      "A", "B", "C", "D", "E", "F", "G"
    ])
    const currencies = ref(["CZK", "USD", "EUR"])

    const statsCurrencyFilter = ref("USD")

    const addTransaction = (transaction) => {  
      transactions.value.push(transaction);
    }
  
    const editTransaction = (item: Transaction, selectedTransactionIndex: number) => {  
      transactions.value[selectedTransactionIndex] = item;
    }
  
    const deleteTransaction = (index: number) => {
      transactions.value.splice(index, 1);
    }
  
    return { transactions: transactions, categories: categories, currencies: currencies, addTransaction, editTransaction, deleteTransaction, statsCurrencyFilter }
  })
  