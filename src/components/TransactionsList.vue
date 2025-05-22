<template>
  <div>
    <div class="table-section">
      <div class="filter-section">
        <!-- Responsive Filters and Managing Section -->
        <div class="controls-container">
          <!-- Filters -->
          <div class="navigation-part d-none d-lg-flex">
            <v-text-field
              v-model="filterFrom"
              color="primary"
              :hide-details="true"
              type="date"
              label="From"
              class="pr-1 filter-text-field"
            />
            <v-text-field
              v-model="filterTo"
              color="primary"
              :hide-details="true"
              type="date"
              label="To"
              class="pr-1 filter-text-field"
            />
          </div>

          <!-- Managing buttons (visible on md+) -->
          <div class="managing-part d-none d-lg-flex">
            <v-btn height="35" color="primary" variant="tonal" @click="addItem">
              Add transaction
            </v-btn>
            <v-btn height="35" color="primary" variant="tonal" class="ml-2" @click="manageCategories">
              Manage categories
            </v-btn>
            <v-btn height="35" color="primary" variant="tonal" class="ml-2" @click="downloadTransactionsList">
              Download in .csv
            </v-btn>
          </div>

          <!-- Dropdown for small screens -->
          <div class="d-flex d-lg-none justify-center">
              <v-menu :close-on-content-click="false">
              <template #activator="{ props }">
                <v-btn color="primary" v-bind="props" variant="tonal" class="mr-1">
                  Filter
                </v-btn>
              </template>
              <v-list>
                <v-text-field
                v-model="filterFrom"
                color="primary"
                :hide-details="true"
                type="date"
                label="From"
                class="mx-1 filter-text-field"
                />
                <v-text-field
                v-model="filterTo"
                color="primary"
                :hide-details="true"
                type="date"
                label="To"
                class="mx-1 filter-text-field"
                />
              </v-list>
            </v-menu>
            <v-menu>
              <template #activator="{ props }">
                <v-btn color="primary" v-bind="props" variant="tonal">
                  Manage
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="addItem" title="Add transaction" />
                <v-list-item @click="manageCategories" title="Manage categories" />
                <v-list-item @click="downloadTransactionsList" title="Download in .csv" />
              </v-list>
            </v-menu>

          </div>
        </div>
      </div>
      
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
                <v-btn color="primary" variant="tonal" height="40px" width="70px" class="ma-0 mr-1" @click="editItem(item, index)">
                  <v-icon icon="mdi-pencil" size="large" />
                </v-btn>
                <v-btn color="red-accent-2" variant="tonal" height="40px" width="70px" class="ma-0 ml-1" @click="deleteItem(index)">
                  <v-icon icon="mdi-delete" size="large" />
                </v-btn>
              </div>
            </template>

            <template #item.date="{ item }">
              {{ item.date.toLocaleDateString('cs-CZ', { year:"numeric", month:"short", day:"numeric"}) }}
            </template>
          </v-data-table-virtual>
        </div>
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

const computedTransactions = computed(() => props.transactions.filter(t => filterTransactions(t, filterFrom.value, filterTo.value)));

const filterTransactions = (t: Transaction, filterFrom, filterTo) => {
    if (filterFrom && filterTo) {
        const dateFrom: Date = new Date(Date.parse(filterFrom));
        const dateTo: Date = new Date(Date.parse(filterTo));
        return t.date >= dateFrom && t.date <= dateTo;
    } else if (filterFrom) {
        const dateFrom: Date = new Date(Date.parse(filterFrom));
        return t.date >= dateFrom;
    } else if (filterTo) {
        const dateTo: Date = new Date(Date.parse(filterTo));
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
.filter-section {
  flex-shrink: 0;
  background-color: whitesmoke;
  max-height: 110px;
}

.table-section {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.controls-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  background-color: white;
}

/* Filters section */
.navigation-part {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 10px;
}

/* Managing buttons section */
.managing-part {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 10px;
}

.table-wrapper {
  flex-grow: 1;
  overflow: scroll;
  width: 100%;
}

.filter-text-field{
    width: 165px;
}

@media screen and (max-width: 400px) {
    .filter-text-field{
        width: 120px;
    }
}

</style>
