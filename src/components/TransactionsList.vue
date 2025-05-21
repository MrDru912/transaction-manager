<template>
    <!-- <h1>Transactinons</h1> -->
    <div id="main-container">
        <div id="table-section">
            <div id="filter-section">
                <v-row justify="center" align="center" style="height: 70px;">
                    <h2 class="text-center">Transactions List</h2>
                </v-row>
                <v-row justify="center" align="center">
                    <span class="py-1">
                        <div>
                            <v-text-field v-model="filterFrom" color="primary" :hide-details="true" type="date" id="filter-from-date" label="From" class="px-2" width="180px"></v-text-field>
                        </div>
                    </span>
                    <span class="py-1">
                        <v-text-field v-model="filterTo" color="primary" :hide-details="true" type="date" id="filter-to-date" label="To" class="px-2" width="180px"></v-text-field>
                    </span>
                    <span class="py-1">
                        <v-btn height="50" color="primary" variant="tonal" @click="addItem">
                            Add transaction
                        </v-btn>
                    </span>
                    <span class="py-1 ml-2">
                        <v-btn height="50" color="primary" variant="tonal" @click="manageCategories">
                            Manage categories
                        </v-btn>
                    </span>
                    <span class="py-1 ml-2">
                        <v-btn height="50" color="primary" variant="tonal" @click="downloadTransactionsList">
                            Download in .csv
                        </v-btn>
                    </span>
                </v-row>
            </div>
            <v-data-table-virtual
                :headers="headers"
                :items="computedTransactions"
                height="100vh"
                class="mt-5"
            >
                <template v-slot:item.actions="{ item, index }">
                    <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; height: 100%; width: 100%;">
                        <v-btn color="primary" variant="tonal" height="40px" width="70px" class="ma-0 mr-1" @click="editItem(item, index)">
                            <v-icon
                                icon="mdi-pencil" 
                                size="large"
                            />
                        </v-btn>
                        <v-btn color="red-accent-2" variant="tonal" height="40px" width="70px" class="ma-0 ml-1" @click="deleteItem(index)">
                            <v-icon
                                icon="mdi-delete"
                                size="large"
                            />
                        </v-btn>
                    </div>
                </template>
                <template v-slot:item.date="{ item }">
                    {{  item.date.toLocaleDateString('cs-CZ', { year:"numeric", month:"short", day:"numeric"}) }}
                </template>

            </v-data-table-virtual>

        </div>
    </div>
</template>

<script setup lang="ts">
// import { ref } from "vue";
import { computed, Ref, ref } from "vue";
import { Transaction } from "../interfaces/Transaction";
import { dateToString } from "../utils/dateUtils"

const headers = [
    { title: 'Date', align: 'center', key: 'date' },
    { title: 'Amount', align: 'center', key: 'amount' },
    { title: 'Currency', align: 'center', key: 'currency' },
    { title: 'Organisation', align: 'center', key: 'organisation' },
    { title: 'Location', align: 'center', key: 'location' },
    { title: 'Category', align: 'center', key: 'category' },
    { title: 'Description', align: 'center', key: 'description' },
    { title: 'Actions', align: 'center', key: 'actions' },
]

const emits = defineEmits<{
  (event: "add-item"): void;
  (event: "edit-item", item: Transaction, index: number): void;
  (event: "delete-item", index: number): void;
  (event: "manage-categories"): void;
  (event: "download"): void;
}>();

const props = withDefaults(
  defineProps<{
    // currencies: string[];
    // categories: string[];
    // transactionIndex?: number;
    transactions: Transaction[];
  }>(),
  {
    transactions:() => [],
    // currencies: () => [],
    // categories: () => [],
    // transactionIndex: undefined,
  },
);

const filterFrom: Ref<undefined | string> = ref(undefined)
const filterTo: Ref<undefined | string> = ref(undefined)

const computedTransactions = computed(() => props.transactions.filter(t => filterTransactions(t)));

const filterTransactions = (t: Transaction) => {
    if (filterFrom.value && filterTo.value) {
        const dateFrom: Date = new Date(Date.parse(filterFrom.value));
        const dateTo: Date = new Date(Date.parse(filterTo.value));
        return t.date >= dateFrom && t.date <= dateTo;
    } else if (filterFrom.value) {
        const dateFrom: Date = new Date(Date.parse(filterFrom.value));
        return t.date >= dateFrom;
    } else if (filterTo.value) {
        const dateTo: Date = new Date(Date.parse(filterTo.value));
        console.log(t.date + " " + dateTo);
        
        return t.date <= dateTo;
    }
    return true;
}

// const transactions = ref([ 
//     { date: new Date().toLocaleDateString('cs-CZ', { year:"numeric", month:"short", day:"numeric"}) 
//     , amount: 180, currency: "CZK", organisation: "Albert", location: "Prague", category: "groceries", description: "tea and honey"},
//     { date: new Date().toLocaleDateString('cs-CZ', { year:"numeric", month:"short", day:"numeric"}), amount: 200, currency: "USD", organisation: "Burger King", location: "Atlanta", category: "groceries", description: "Wopper adn fries"}
// ]);

// let editIndex = -1;
// let charts = {};

const addItem = () => {
    emits("add-item");
}

const editItem = (item: Transaction, index: number) => {
    emits("edit-item", item, index);
}

const deleteItem = (index: number) => {
    emits("delete-item", index);
}

const manageCategories = () => {
    emits("manage-categories");
}

const downloadTransactionsList = () => {
    emits("download")
}

</script>

<style>

</style>