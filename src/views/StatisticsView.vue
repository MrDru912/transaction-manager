<template>
     <section class="w-100 h-100">
          <header class="tool-bar d-none d-md-flex">
               <v-row no-gutters class="pt-2">
                    <v-col no-gutters>
                         <p align="center" class="text-h5">
                              Spends by categories
                         </p>
                    </   v-col>
                    <v-col no-gutters>
                         <p align="center" class="text-h5">
                              Transactions by categories
                         </p>
                    </v-col>
               </v-row>
          </header>
          <div class="d-none d-md-flex" style="display: flex; flex-direction: row; width: 100%; align-items: stretch; height: calc(100% - 52px);">
               <v-col class="w-100 h-100">
                    <v-card class="mx-auto" style="min-height: 100%; height: 100%; overflow-y: scroll;">
                         <v-card-text>
                              <PieChart />
                         </v-card-text>
                    </v-card>
               </v-col>
               <v-col class="w-100 h-100">
                    <TransactionsByCategories/>
               </v-col>
          </div>
          <div class="d-flex d-md-none" style="width: 100%;">
               <v-tabs
               v-model="tab"
               bg-color="primary"
               style="width: 100%;"
               fixed-tabs
               >
                    <v-tab value="one">Chart</v-tab>
                    <v-tab value="two">Categories</v-tab>
               </v-tabs>
          </div>
          <div class="d-flex d-md-none" style="width: 100%;">
               <v-tabs-window v-model="tab"style="width: 100%;">
                    <v-tabs-window-item value="one">
                         <v-card class="mx-auto" style="min-height: 100%; height: 100%; overflow-y: scroll;">
                              <v-card-title>
                                   <v-row no-gutters>
                                        <div style="height: 50px;">
                                        <v-select
                                                  v-model="transactionCurrency"
                                                  max-height="50px"
                                                  width="200px"
                                                  label="Filter by currency"
                                                  color="primary"
                                                  :items="store.currencies"
                                                  @update:modelValue="transactionCurrencyUpdated"
                                        />
                                        </div>
                                   </v-row>
                              </v-card-title>
                              <v-card-text>
                                   <PieChart />
                              </v-card-text>
                         </v-card>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="two">
                         <TransactionsByCategories/>
                    </v-tabs-window-item>
               </v-tabs-window>
          </div>
     </section>
</template>

<script setup lang="ts">
import { computed, Ref, ref, watch } from 'vue';
import { Transaction } from '../interfaces/Transaction';
import { useTransactionsStore } from '../stores/transactionStore'
import { dateToString } from '../utils/dateUtils';
import { ca, fa, tr } from 'vuetify/locale';
import PieChart from '../components/PieChart.vue'
import TransactionsByCategories from '../components/TransactionsByCategories.vue';

const store = useTransactionsStore();
const tab = ref(null);

const categoryListOpened = ref(true);
const categoryOpened = ref(false);
const categoryTransactionsOpened = ref(false);
const selectedCategoryIndex = ref(-1);
const selectedTransaction: Ref<undefined | Transaction> = ref(undefined);
const transactionCurrency: Ref<undefined | string> = ref(store.statsCurrencyFilter);
console.log(transactionCurrency.value);

/* TODO */
/* Reactivity of categories does not work. When category added it is not reflected on statistics page
although the categories data are retrieved from store*/

const transactionsFilterdByCurrency = computed(() => {
     return store.transactions.filter(t => !transactionCurrency.value || (transactionCurrency.value && transactionCurrency.value === t.currency))
})

const transactionsByCategories = computed(() => {
     let transactionsForMap: Transaction[][] = [];
     store.categories.forEach(category => {
          const filteredTransactions = transactionsFilterdByCurrency.value.filter(t => {
               return t.category == category
          });
          transactionsForMap.push(filteredTransactions);          
     });
     return transactionsForMap;
})

const transactionsTotalSum = computed(() => {
     const totalAmountSpent = transactionsFilterdByCurrency.value
          .map(t => t.amount)
          .reduce((acc, currentVal) => acc + currentVal, 0);
     return totalAmountSpent;
})

const transactionsSumAggregation = computed(() => {
     let categorisedTransactionsSums: number[] = [];
     transactionsByCategories.value.forEach(category => {
          categorisedTransactionsSums.push(category.reduce((acc, t) => acc + t.amount, 0));
     });
     return categorisedTransactionsSums;
})

function transactionCurrencyUpdated (newValue: string) {
     store.statsCurrencyFilter = newValue;
}

watch(() => store.statsCurrencyFilter, (newValue) => {
     console.log("CHAAAAANGED");
     
     transactionCurrency.value = newValue;
})
</script>

<style>
.tool-bar{
     height: 52px;
     background-color: whitesmoke;
}
</style>