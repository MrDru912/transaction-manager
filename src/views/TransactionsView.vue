<template>
  <div style="height: 100%;">
      <TransactionsList
        @delete-item="deleteTransaction"
        @download="downloadTransactionsList"
      />
  </div>
</template>

<script setup lang="ts">
import TransactionsList from '../components/TransactionsList.vue';
import { useTransactionManager, useTransactionMutations } from '../composables/useTransactions';
import { useCategoryManager } from '../composables/useCategories';
import { useCurrencies } from '../composables/useCurrencies';

// const store = useTransactionsStore();
const { transactions } = useTransactionManager()
const { deleteTransaction: useDeleteTransaction } = useTransactionMutations();
const { data: currencies } = useCurrencies()
const { categories } = useCategoryManager()


// store.transactions.map(t => { let copy = { ...t}; copy.date.setHours(0,0,0,0); return copy; })

// const selectedTransactionDate: Ref<Date | undefined> = ref(undefined);
// const selectedTransactionAmount = ref(-1);
// const selectedTransactionCategory: Ref<Category | undefined> = ref(undefined);
// const selectedTransactionCurrency: Ref<string | undefined> = ref(undefined);
// const selectedTransactionLocation: Ref<string | undefined> = ref(undefined);
// const selectedTransactionOrganisation: Ref<string | undefined> = ref(undefined);
// const selectedTransactionDescription: Ref<string | undefined> = ref(undefined);

// const editTransaction = (item: Transaction) => {
//   console.log("EDIT " + selectedTransactionIndex.value);
//   useUpdateTransaction(item)
//   // store.transactions[selectedTransactionIndex.value] = item;
//   transactionDialog.value = false;
// }

const deleteTransaction = (index: number) => {
  console.log("DELETE " + index);
  useDeleteTransaction(index);
  // store.transactions.splice(index, 1);
}



const transactionsToCSV = () => {
  if (transactions.value.length === 0) {
    alert("Empty transaction list");
    return "";
  }
  let textBuffer = "";
  const headers = Object.keys(transactions.value[0]);
  textBuffer += headers.join(',') + "\n";
  transactions.value.forEach(t => {
    const date = new Date(t.createAt)
      .toLocaleDateString('cs-CZ', {year:"numeric",month:"short",day:"numeric"})
      .split(' ')
      .join('')
    textBuffer+=`${date},${t.amount},${t.currency},${t.counterparty},${"location TODO"},${t.category.name},${t.description}\n`
  });
  return textBuffer;
}

const downloadTransactionsList = () => {
  const fileContent = transactionsToCSV();
  if (fileContent.length === 0) {
    alert("Empty transaction list");
  }
  const blob = new Blob([fileContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transactions.csv';
  a.click();
}
</script>

<style scoped>

.transactions-container {
  position: relative;
  left: 220px;
  width: calc(100% - 220px);
}

@media screen and (max-width: 400px) {
  .transactions-container {
    left: 100px;
    width: calc(100% - 100px);
  }
}

</style>
