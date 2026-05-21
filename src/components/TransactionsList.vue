<template>
    <section class="table-section">
        <header class="filter-section">
            <FiltersAndFunctionsBar
                :transactions="transactions"
                :categories="categories">
              <!-- Desktop buttons -->
  <template #actions-desktop>
    <BouncingButton @click="setTransactionForAdd">ADD TRANSACTION</BouncingButton>
    <BouncingButton @click="manageCategories">CATEGORIES</BouncingButton>
    <BouncingButton @click="downloadTransactionsList">EXPORT IN .CSV</BouncingButton>
  </template>

  <!-- Mobile menu items -->
  <template #actions-mobile>
    <v-list-item @click="setTransactionForAdd" title="Add transaction" />
    <v-list-item @click="manageCategories" title="Manage categories" />
    <v-list-item @click="downloadTransactionsList" title="Export in .csv" />
  </template>

  <!-- Dialogs -->
  <template #dialogs>
    <v-dialog v-model="categoriesDialog" width="500px" height="580px">
      <CategoriesDialogList
        :transactions="transactions"
        :categories="categories"
        @close-form="categoriesDialog = false"
      />
    </v-dialog>
    <v-dialog v-model="transactionDialog" width="500px" height="580px">
      <TransactionDialog
        :mode="OperationType.ADD"
        :transaction="selectedTransaction"
        :categories="categories"
        :currencies="currencies"
        @close-form="transactionDialog = false"
      />
    </v-dialog>
  </template>

</FiltersAndFunctionsBar>
        </header>
      
        <!-- Table -->
        <div class="table-wrapper">
            <v-data-table-virtual
            fixed-header
            :headers="headers"
            :items="computedTransactions"
            height="auto"
            width="100%"
            >
            <template #item.actions="{ item, index }">
                <div class="d-flex justify-center align-center">
                <v-btn color="primary" variant="tonal" height="40px" width="70px" class="ma-0 mr-1" @click="updateTransaction(item)">
                    <v-icon icon="mdi-pencil" size="large" />
                </v-btn>
                <v-btn color="red-accent-2" variant="tonal" height="40px" width="70px" class="ma-0 ml-1" @click="deleteItem(index)">
                    <v-icon icon="mdi-delete" size="large" />
                </v-btn>
                </div>
            </template>
            <template #item.category="{ item }">
                {{ item.category.name }}
            </template>

            <template #item.date="{ item }">
                {{ new Date(item.createdAt).toLocaleDateString('cs-CZ', { year:"numeric", month:"short", day:"numeric"}) }}
            </template>
            <template #item.amount="{ item }">
                {{ getFormattedAmount(item) }}
            </template>

            </v-data-table-virtual>
        </div>
        <v-dialog v-model="transactionDialog" width="500px" height="580px">
        <TransactionDialog
            :mode="OperationType.UPDATE"
            :transaction="selectedTransaction"
            :categories="categories"
            :currencies="currencies"
            @close-form="transactionDialog = false"
        />
        </v-dialog>
    </section>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from "vue";
import { Transaction } from "../types";
import BouncingButton from "./BouncingButton.vue";
import { useTransactionManager, useTransactionMutations } from "../composables/useTransactions";
import { useCurrencies } from "../composables/useCurrencies";
import { useGlobalStore } from "../stores/globalStore";
import { log } from "console";
import { filterTransactionByCurrency, filterTransactionsByDateInterval, TransactionTypeItem } from "../utils/filters";
import { TransactionType } from "../types/TransactionType";
import FiltersAndFunctionsBar from "./FiltersAndFunctionsBar.vue";
import { useCategoryManager } from "../composables/useCategories";
import { OperationType } from "./OperationType";
import TransactionDialog from '../components/TransactionDialog.vue';
import CategoriesDialogList from '../components/CategoriesDialogList.vue';
import { getFormattedAmount } from "../utils/formaters";

const  { data: currencies } = useCurrencies();
const { deleteTransaction: useDeleteTransaction } = useTransactionMutations()
const { transactions } = useTransactionManager()
const { categories } = useCategoryManager()
const store = useGlobalStore();

const headers = [
    { title: 'Date', align: 'center', key: 'date' },
    // { title: 'Income/Spend', align: 'center', key: 'sign' },
    { title: 'Amount', align: 'center', key: 'amount' },
    // { title: 'Currency', align: 'center', key: 'currency' },
    { title: 'Counterparty', align: 'center', key: 'counterparty' },
    { title: 'Location', align: 'center', key: 'location' },
    { title: 'Category', align: 'center', key: 'category' },
    { title: 'Description', align: 'center', key: 'description' },
    { title: 'Actions', align: 'center', key: 'actions' },
]

const emits = defineEmits<{
  (event: "add-item"): void;
  (event: "edit-item", item: Transaction, index: number): void;
  (event: "delete-item", index: number): void;
  (event: "download"): void;
}>();

const filterFrom: Ref<undefined | string> = ref(undefined)
const filterTo: Ref<undefined | string> = ref(undefined)

// const transactionTypes: TransactionTypeItem[] = [
//     { title: 'All', value: 'ALL' },
//     { title: 'Incoming', value: TransactionType.INCOMING },
//     { title: 'Outgoing', value: TransactionType.OUTGOING },
//   ]

// const transactionType = ref<TransactionType | 'ALL'>(store.transactionType);

// const transactionMode = OperationType.UPDATE;
const transactionDialog = ref(false)
// const selectedTransactionIndex = ref(0)
const selectedTransaction: Ref<Transaction | Omit<Transaction, 'id'> | undefined> = ref(undefined);

const updateTransaction = (transaction: Transaction, index: number) => {
//   transactionMode.value = OperationType.UPDATE;
//   selectedTransactionIndex.value = index;
  selectedTransaction.value = transaction;
  transactionDialog.value = true;
}


// function transactionCurrencyUpdated (newValue: string) {
//     //  store.statsCurrencyFilter = newValue;
// }

const computedTransactions = computed(() => {
  console.log(transactions.value?.map(t => t.type));
  return transactions.value
      ? transactions.value
          .filter(t => filterTransactionsByDateInterval(t, filterFrom.value, filterTo.value))
          .filter(t => store.transactionType === 'ALL' || store.transactionType === t.type)
          .filter(t => filterTransactionByCurrency(t, store.statsCurrencyFilter))
      : []
}
);

const pressed = ref(false);

const addItem = () => {
    emits("add-item");
}

const deleteItem = (index: number) => {
    // emits("delete-item", index);
    const transactionIdToBeDeleted = computedTransactions.value[index].id;
    if (transactionIdToBeDeleted) {
        useDeleteTransaction(transactionIdToBeDeleted);
    } else {
        console.log("Transaction deletion failed. Id is undefined");
        
    }
}

const downloadTransactionsList = () => {
    emits("download")
}


const categoriesDialog = ref(false)

const setTransactionForAdd = () => {
  const currency = currencies.value && currencies.value[0] ? currencies.value[0] : "";
  const category = categories.value && categories.value[0] ? categories.value[0] : undefined;
  selectedTransaction.value = 
  {
      createdAt: new Date(),
      amount: 0,
      currency: currency,
      organisation: "",
      location: "",
      category: category,
      description: "",
      type: TransactionType.OUTGOING,
    }
  transactionDialog.value = true;
}



const manageCategories = () => {
    categoriesDialog.value = true;
}

</script>

<style scoped>


.table-section {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.table-wrapper {
  flex-grow: 1;
  overflow: scroll;
  width: 100%;
}

.filter-text-field{
    height: 50px;
}

@media screen and (max-width: 400px) {
    .filter-text-field{
        height: 30px;
    }
}



.menu-item {
    margin-inline: 3px;
}




/* .shimmer-btn:hover {
  background-color: rgba(67, 198, 172, 0.25);
}

.shimmer-btn::after {
  content: "";
  position: absolute;
  top: -100%;
  left: -100%;
  width: 60%;
  height: 300%;
  background: linear-gradient(
    105deg,
    transparent,
    rgba(255, 255, 255, 0.35),
    transparent
  );
}

.shimmer-btn:hover::after {
  animation: shimmer 0.6s linear;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 150%; }
} */

</style>
