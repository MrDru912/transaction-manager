<template>
     <div class="w-100 h-100">
          <div class="tool-bar d-none d-md-flex">
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
          </div>
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
          <div class="d-flex d-lg-none" style="width: 100%;">
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
          <div>
            <v-tabs-window v-model="tab">
               <v-tabs-window-item value="one">
                    <v-card class="mx-auto" style="min-height: 100%; height: 100%; overflow-y: scroll;">
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
     </div>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from 'vue';
import { Transaction } from '../interfaces/Transaction';
import { useTransactionsStore } from '../stores/transactionStore'
import { dateToString } from '../utils/dateUtils';
import { ca, fa, tr } from 'vuetify/locale';
import PieChart from '../components/PieChart.vue'
import TransactionsByCategories from '../components/TransactionsByCategories.vue';

const store = useTransactionsStore();
const tab = ref(null);

/* TODO */
/* Reactivity of categories does not work. When category added it is not reflected on statistics page
although the categories data are retrieved from store*/

const transactionsByCategories = computed(() => {
     let transactionsForMap: Transaction[][] = [];
     store.categories.forEach(category => {
          const filteredTransactions = store.transactions.filter(t => {
               return t.category == category
          });
          transactionsForMap.push(filteredTransactions);          
     });
     return transactionsForMap;
})

const transactionsTotalSum = computed(() => {
     const totalAmountSpent = store.transactions
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

const transactionsSumPercentageAggregation = computed(() => {
     let categorisedTransactionsPercentage: number[] = [];
     transactionsSumAggregation.value.forEach(categorySum => {
          categorisedTransactionsPercentage.push(categorySum / transactionsTotalSum.value * 100);
     });
     return categorisedTransactionsPercentage;
})

const categoryListOpened = ref(true);
const categoryOpened = ref(false);
const categoryTransactionsOpened = ref(false);
const selectedCategoryIndex = ref(-1);
const selectedTransaction: Ref<undefined | Transaction> = ref(undefined);
const transactionCurrency: Ref<undefined | string> = ref(undefined);

const setSelectedCategoryIndex = (index: number) => {
     selectedCategoryIndex.value = index;
     categoryListOpened.value = false;
     categoryOpened.value = true;
}

const setSelectedTransaction = (transaction) => {
     selectedTransaction.value = transaction;
     categoryOpened.value = false;
     categoryTransactionsOpened.value = true;
}

const closeCategoryInfo = () => {
     categoryOpened.value = false;
     categoryListOpened.value = true;
     selectedCategoryIndex.value = -1;
}

const closeTransactionInfo = () => {
     categoryTransactionsOpened.value = false;
     categoryOpened.value = true;
     selectedTransaction.value = undefined;
}

function transactionCurrencyUpdated (newValue: string) {

}
</script>

<style>
.tool-bar{
     height: 52px;
     background-color: whitesmoke;
}
</style>