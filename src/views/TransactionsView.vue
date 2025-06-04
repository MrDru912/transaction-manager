<template>
  <div style="height: 100%;">
      <TransactionsList
        :transactions="store.transactions"
        @edit-item="setTransactionForEdit"
        @delete-item="deleteTransaction"
        @add-item="setTransactionForAdd"
        @manage-categories="manageCategories"
        @download="downloadTransactionsList"
      />
    <v-dialog v-model="transactionDialog" width="500px" height="580px">
      <TransactionDialog
        :date="selectedTransactionDate"
        :currency="selectedTransactionCurrency"
        :amount="selectedTransactionAmount"
        :category="selectedTransactionCategory"
        :location="selectedTransactionLocation"
        :description="selectedTransactionDescription"
        :organisation="selectedTransactionOrganisation"
        :categories="store.categories"
        :currencies="store.currencies"
        @add-transaction="addTransaction" 
        @edit-transaction="editTransaction"
        @close-dialog="transactionDialog = false"
      />
    </v-dialog>
    <v-dialog v-model="categoriesDialog" width="500px" height="580px">
      <CategoriesDialog
        @close-dialog="transactionDialog = false"
      />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import TransactionDialog from '../components/TransactionDialog.vue'
import TransactionsList from '../components/TransactionsList.vue';
import { Ref, ref } from "vue";
import { Transaction } from '../interfaces/Transaction';
import { useTransactionsStore } from '../stores/transactionStore'
import CategoriesDialog from '../components/CategoriesDialog.vue';

const store = useTransactionsStore();

const transactionDialog = ref(false)
const categoriesDialog = ref(false)
const selectedTransactionIndex = ref(0)

store.transactions.map(t => { let copy = { ...t}; copy.date.setHours(0,0,0,0); return copy; })

const selectedTransactionDate: Ref<Date | undefined> = ref(undefined);
const selectedTransactionAmount = ref(-1);
const selectedTransactionCategory: Ref<string | undefined> = ref(undefined);
const selectedTransactionCurrency: Ref<string | undefined> = ref(undefined);
const selectedTransactionLocation: Ref<string | undefined> = ref(undefined);
const selectedTransactionOrganisation: Ref<string | undefined> = ref(undefined);
const selectedTransactionDescription: Ref<string | undefined> = ref(undefined);

const addTransaction = (transaction) => {  
  store.transactions.push(transaction);
  transactionDialog.value = false;
}

const editTransaction = (item: Transaction) => {
  console.log("EDIT " + selectedTransactionIndex.value);
  
  store.transactions[selectedTransactionIndex.value] = item;
  transactionDialog.value = false;
}

const deleteTransaction = (index: number) => {
  console.log("DELETE " + index);
  
  store.transactions.splice(index, 1);
}

const setTransactionForEdit = (transaction: Transaction, index: number) => {
  selectedTransactionIndex.value = index;
  selectedTransactionDate.value = transaction.date;
  selectedTransactionAmount.value = transaction.amount;
  selectedTransactionCategory.value = transaction.category;
  selectedTransactionCurrency.value = transaction.currency;
  selectedTransactionLocation.value = transaction.location;
  selectedTransactionDescription.value = transaction.description;
  selectedTransactionOrganisation.value = transaction.organisation;
  transactionDialog.value = true;
}

const setTransactionForAdd = () => {
  selectedTransactionDate.value = undefined;
  selectedTransactionAmount.value = 0;
  selectedTransactionCategory.value = undefined;
  selectedTransactionCurrency.value = undefined;
  selectedTransactionLocation.value = undefined;
  selectedTransactionDescription.value = undefined;
  selectedTransactionOrganisation.value = undefined;
  transactionDialog.value = true;
}

const manageCategories = () => {
  categoriesDialog.value = true;
}

const transactionsToCSV = () => {
  if (store.transactions.length === 0) {
    alert("Empty transaction list");
    return "";
  }
  let textBuffer = "";
  const headers = Object.keys(store.transactions[0]);
  textBuffer += headers.join(',') + "\n";
  store.transactions.forEach(t => {
    const date = t.date.toLocaleDateString('cs-CZ', {year:"numeric",month:"short",day:"numeric"}).split(' ').join('')
    textBuffer+=`${date},${t.amount},${t.currency},${t.organisation},${t.location},${t.category},${t.description}\n`
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
