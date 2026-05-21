import { defineStore } from 'pinia'
// import { Transaction } from '../interfaces/Transaction';
import { Ref, ref } from 'vue';
import { TransactionType } from '../types/TransactionType';
import { TransactionTypeItem } from '../utils/filters';

export const useGlobalStore = defineStore('global', () => {
  // const transactionTypes = ['All', 'Outgoing', 'Incoming']

  const transactionTypes: TransactionTypeItem[] = [
    { title: 'All', value: 'ALL' },
    { title: 'Incoming', value: TransactionType.INCOMING },
    { title: 'Outgoing', value: TransactionType.OUTGOING },
  ]

  const statsCurrencyFilter = ref(localStorage.getItem('currency-filter') || 'USD')
  const transactionType: Ref<TransactionType | 'ALL'> = ref(localStorage.getItem('transaction-type') as TransactionType | 'ALL' || TransactionType.OUTGOING)

  function setCurrencyFilter(value: string) {
    statsCurrencyFilter.value = value
    localStorage.setItem('currency-filter', value)
  }

  function setTransactionType(value: string) {
    transactionType.value = value as TransactionType | 'ALL'
    localStorage.setItem('transaction-type', value)
  }

  // const statsCurrencyFilter = ref("USD")
  // const transactionType: Ref<TransactionType | null> = ref(TransactionType.OUTGOING)
    return { statsCurrencyFilter, transactionType, setTransactionType, setCurrencyFilter, transactionTypes }
})
