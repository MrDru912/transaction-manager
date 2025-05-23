<template>
  <v-form id="transaction-form" @submit="sumbitTransactionForm">
    <v-card>
      <v-card-title>
        <p v-if="mode === 'add'" class="text-center">Add transaction</p>
        <p v-else="mode === 'edit'" class="text-center">Edit transaction</p>
      </v-card-title>
      <v-card-text style="max-height: 500px; overflow-y: scroll;">
          <v-row>
            <v-col cols="6">
              <v-text-field type="date" label="Date" id="transaction-date" color="primary" v-model="transactionDate" autofocus required/>
              <v-select v-model="transactionSign" label="+/-" color="primary" :items="['+', '-']"/>
              <v-text-field type="number" label="Amount" id="transaction-amount" color="primary" v-model="transactionAmount" required/>
              <v-select v-model="transactionCurrency" label="Currency" color="primary" :items="currencies"/>
            </v-col>
            <v-col cols="6">
              <v-text-field label="Organisation" id="transaction-organisation" color="primary" v-model="transactionOrganisation" placeholder="Tesco" required/>
              <v-text-field label="Location" id="transaction-location" color="primary" v-model="transactionLocation" placeholder="Prague" required/>
              <v-select v-model="transactionCategory" label="Category" color="primary" :items="categories"/>
              <v-textarea label="Description" id="transaction-description" color="primary" v-model="transactionDescription" placeholder="Bought meat, eggs and milk"/>
            </v-col>
          </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn type="submit" id="save-button" variant="tonal" color="primary" block>Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
// import { Transaction } from "@/interfaces";
import { dateToString } from "../utils/dateUtils"

const props = withDefaults(
  defineProps<{
    date?: Date;
    amount?: number;
    category?: string;
    currency?: string;
    location?: string;
    organisation?: string;
    description?: string;
    currencies?: string[];
    categories?: string[];
    transactionIndex?: number;
  }>(),
  {
    currencies: () => [],
    categories: () => [],
    transactionIndex: undefined,
  },
);

const emits = defineEmits<{
  (event: "add-transaction", transaction): void;
  (event: "edit-transaction", transaction): void;
}>();


const mode = ref(props.date == undefined ? "add" : "edit"); 
const transactionDate = ref(props.date == undefined ? new Date().toISOString().split('T')[0] : dateToString(props.date));
const transactionAmount = ref(props.amount == undefined ? 0 : props.amount);
const transactionCategory = ref(props.category == undefined ? props.categories[0] : props.category);
const transactionCurrency = ref(props.currency == undefined ? props.currencies[0] : props.currency);
const transactionLocation = ref(props.location == undefined ? "" : props.location);
const transactionOrganisation = ref(props.organisation == undefined ? "" : props.organisation);
const transactionDescription = ref(props.description == undefined ? "" : props.description);
const transactionSign = ref('-');

function sumbitTransactionForm(event) {  
  // if (mode.value === 'add'){
    event.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    
    if (transactionDate.value > today) {
      alert('Date cannot be in the future.');
      return;
    }
    
    const transaction = {
      date: new Date(Date.parse(transactionDate.value)),
      amount: Number(transactionAmount.value),
      currency: transactionCurrency.value,
      organisation: transactionOrganisation.value,
      location: transactionLocation.value,
      category: transactionCategory.value,
      description: transactionDescription.value,
      sign: transactionSign.value,
    }
    transaction.date.setHours(0, 0, 0, 0);
  
    if (mode.value === 'add') {
      console.log("Adding new transaction");
      emits("add-transaction", transaction);
    } else {
      console.log("Editing transaction");
      emits("edit-transaction", transaction);
    }
  // }
}

</script>