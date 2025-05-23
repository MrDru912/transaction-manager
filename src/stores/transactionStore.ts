import { defineStore } from 'pinia'
import { Transaction } from '../interfaces/Transaction';
import { ref } from 'vue';

export const useTransactionsStore = defineStore('transactions', () => {
    const transactions = ref([ 
      { date: new Date(), sign: '-', 
         amount: 180, currency: "CZK", organisation: "Albert", location: "Prague", category: "Groceries", description: "tea and honey"},
      { date: new Date(), sign: '-', 
         amount: 200, currency: "USD", organisation: "Burger King", location: "Atlanta", category: "Groceries", description: "Wopper adn fries"},
      { date: new Date(), sign: '-', 
          amount: 5000, currency: "CZK", organisation: "SUZ CVUT", location: "Prague", category: "Accomodation", description: "dorm"},
      { date: new Date(), sign: '-', 
        amount: 1200, currency: "CZK", organisation: "PID", location: "Prague", category: "Transportation", description: "litacka"},
      { date: new Date(), sign: '-', 
        amount: 800, currency: "CZK", organisation: "Zara", location: "Prague", category: "Clothes", description: "pants"},
      { date: new Date(), sign: '-', 
        amount: 2000, currency: "CZK", organisation: "Decatlon", location: "Prague", category: "Clothes", description: "shoes"},
      { date: new Date(), sign: '-', 
        amount: 700, currency: "USD", organisation: "SilliconHill", location: "Prague", category: "Internet", description: ""},
      { date: new Date(), sign: '-',
        amount: 700, currency: "USD", organisation: "SilliconHill", location: "Prague", category: "D", description: ""},
      { date: new Date(), sign: '-', 
        amount: 700, currency: "USD", organisation: "SilliconHill", location: "Prague", category: "Internet", description: ""},
      { date: new Date(), sign: '-', 
        amount: 700, currency: "EUR", organisation: "SilliconHill", location: "Prague", category: "Internet", description: ""},
      { date: new Date(), sign: '-', 
        amount: 700, currency: "EUR", organisation: "SilliconHill", location: "Prague", category: "Transportation", description: ""},
      { date: new Date(), sign: '-', 
        amount: 500, currency: "EUR", organisation: "SilliconHill", location: "Prague", category: "Household goods", description: ""},
      { date: new Date(), sign: '-', 
        amount: 700, currency: "EUR", organisation: "SilliconHill", location: "Prague", category: "Transportation", description: ""},
      { date: new Date(), sign: '-', 
        amount: 678, currency: "USD", organisation: "SilliconHill", location: "Prague", category: "Household goods", description: ""},
      { date: new Date(), sign: '-', 
        amount: 230, currency: "EUR", organisation: "SilliconHill", location: "Prague", category: "C", description: ""},
      { date: new Date(), sign: '-', 
        amount: 100, currency: "EUR", organisation: "SilliconHill", location: "Prague", category: "B", description: ""},
      { date: new Date(), sign: '-', 
        amount: 180, currency: "USD", organisation: "SilliconHill", location: "Prague", category: "B", description: ""},
      { date: new Date(), sign: '-', 
        amount: 340, currency: "CZK", organisation: "SilliconHill", location: "Prague", category: "A", description: ""},
      { date: new Date(), sign: '-', 
        amount: 2300, currency: "CZK", organisation: "SilliconHill", location: "Prague", category: "Clothes", description: ""},
      { date: new Date(), sign: '-', 
        amount: 200, currency: "CZK", organisation: "SilliconHill", location: "Prague", category: "Household goods", description: ""},

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
  