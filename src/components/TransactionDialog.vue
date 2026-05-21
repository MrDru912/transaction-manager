<script setup lang="ts">
import { ref } from "vue";
import { dateToString } from "../utils/dateUtils"
import { Category, Transaction } from "../types";
import BouncingButton from "./BouncingButton.vue";
import { useTransactionMutations } from "../composables/useTransactions";
import { OperationType } from "./OperationType";

const props = withDefaults(
  defineProps<{
    // date?: Date;
    // amount?: number;
    // category?: Category;
    // currency?: string;
    // location?: string;
    // organisation?: string;
    // description?: string;
    mode: OperationType;
    currencies?: string[];
    categories?: Category[];
    transaction: Transaction;
    transactionIndex?: number;
  }>(),
  {
    currencies: () => [],
    categories: () => [],
    transactionIndex: undefined,
  },
);

const emits = defineEmits<{
  (event: "close-form"): void;
}>();

// const { transactions, isLoading: transactionIsLoading } = useTransactionManager()
const { addTransaction: useAddTransaction, updateTransaction: useUpdateTransaction } = useTransactionMutations()

const transactionDate = ref(props.transaction.createdAt == undefined ? new Date().toISOString().split('T')[0] : dateToString(props.transaction.createdAt));
const transactionAmount = ref(props.transaction.amount == undefined ? 0 : props.transaction.amount);
const transactionCategory = ref(props.transaction.category == undefined ? props.categories[0] : props.transaction.category);
const transactionCurrency = ref(props.transaction.currency == undefined ? props.currencies[0] : props.transaction.currency);
const transactionLocation = ref(props.transaction.counterparty == undefined ? "" : props.transaction.counterparty);
const transactionOrganisation = ref(props.transaction.counterparty == undefined ? "" : props.transaction.counterparty);
const transactionDescription = ref(props.transaction.description == undefined ? "" : props.transaction.description);
const transactionType = ref('OUTGOING');

const amountRef = ref(null);
const input = amountRef.value?.$el.querySelector('input');
input?.addEventListener('input', () => {
  input.setCustomValidity(''); // Clear custom validity on input change
});

async function sumbitTransactionForm(event) {
  console.log('sumbitTransactionForm');

    event.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    
    if (transactionDate.value > today) {
      alert('Date cannot be in the future.');
      return;
    }
    
    const transaction: Transaction = {
      id: props.mode === OperationType.ADD ? undefined : props.transaction.id,
      createdAt: new Date(Date.parse(transactionDate.value)),
      amount: Number(transactionAmount.value),
      currency: transactionCurrency.value,
      organisation: transactionOrganisation.value,
      location: transactionLocation.value,
      category: transactionCategory.value,
      description: transactionDescription.value,
      type: transactionType.value,
    }
    transaction.createdAt.setHours(0, 0, 0, 0);
  
    console.log("Submitiing transaction in the form: " + JSON.stringify(transaction));
    
    if (props.mode === OperationType.ADD) {
      console.log("Adding new transaction");
      await useAddTransaction(transaction);
      // emits("add-transaction", transaction);
    } else {
      console.log("Editing transaction");
      // emits("edit-transaction", transaction);
      await useUpdateTransaction(transaction);
    }
  emits('close-form');
}

</script>

<template>
  <form @submit="sumbitTransactionForm">
    <div class="form-card">

      <!-- Header -->
      <div class="form-header">
        <span v-if="mode === OperationType.ADD">Add transaction</span>
        <span v-else>Edit transaction</span>
      </div>

      <!-- Fields -->
<div class="form-body">
  <div class="form-grid">
    <v-text-field type="date" variant="solo" label="Date" color="primary" v-model="transactionDate" autofocus required/>
    <v-select v-model="transactionType" variant="solo" label="+/-" color="primary" :items="['INCOMING', 'OUTGOING']"/>
    <div class="form-row-2">
      <v-text-field type="number" variant="solo" label="Amount" ref="amountRef" color="primary" v-model="transactionAmount" required min="0.01" step="0.01"/>
      <v-select v-model="transactionCurrency" variant="solo" label="Currency" color="primary" :items="currencies"/>
    </div>
    <v-select v-model="transactionCategory" variant="solo" label="Category" color="primary" :items="categories" item-title="name" item-value="id" return-object/>
    <div class="form-row-2">
      <v-text-field variant="solo" label="Organisation" color="primary" v-model="transactionOrganisation" placeholder="Tesco"/>
      <v-text-field variant="solo" label="Location" color="primary" v-model="transactionLocation" placeholder="Prague"/>
    </div>
    <v-textarea variant="solo" label="Description" color="primary" v-model="transactionDescription" placeholder="Bought meat, eggs and milk"/>
  </div>
  {{ transactionCategory }}
</div>
      <!-- Actions -->
      <div class="form-actions">
        <BouncingButton type="button" color="#e57373" :width="60" @click="$emit('close-form')">Cancel</BouncingButton>
        <BouncingButton type="submit" :width="60">Save</BouncingButton>
      </div>

    </div>
  </form>
</template>

<style scoped>
.form-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.form-body {
  background-color: whitesmoke;
  padding: 8px 16px;
  overflow-y: auto;
  max-height: 500px;
}

.form-columns {
  display: grid;
  grid-template-columns: 3fr 2fr; /* left col wider since it's more important */
  gap: 0 5px;
}

.form-col {
  display: flex;
  flex-direction: column;
  min-width: 0; /* prevents grid blowout */
}

.form-actions {
  background-color: whitesmoke;
  display: flex;
  justify-content: end;
  padding: 8px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}


</style>