<template>
     <section class="w-100 h-100">
        <header class="filter-section">
             <v-row no-gutters>
                    <div class="controls-container d-none d-lg-flex" >
                         <v-text-field
                         v-model="filterFrom"
                         variant="solo"
                         style="height: 50px"
                         color="primary"
                         :hide-details="true"
                         type="date"
                         label="From"
                         class="pr-1 filter-text-field"
                         />
                         <v-text-field
                         v-model="filterTo"
                         variant="solo"
                         style="height: 50px"
                         color="primary"
                         :hide-details="true"
                         type="date"
                         label="To"
                         class="pr-1 filter-text-field"
                         />
                         <v-select
                              v-model="store.statsCurrencyFilter"
                              variant="solo"
                              style="height: 50px; width: 120px;"
                              class="mx-1 filter-text-field"
                              label="Currency"
                              color="primary"
                              :items="currencies"
                              @update:modelValue="transactionCurrencyUpdated"
                         />
                         <v-select
                              v-model="store.transactionType"
                              variant="solo"
                              style="height: 50px; width: 130px;"
                              class="mx-1 filter-text-field"
                              label="Type"
                              color="primary"
                              :items="store.transactionTypes"
                              @update:modelValue="transactionTypeUpdated"
                         />
                    </div>
                    <!-- <v-select
                         v-model="transactionCurrency"
                         max-height="50px"
                         width="200px"
                         label="Filter by currency"
                         color="primary"
                         :items="store.currencies"
                         @update:modelValue="transactionCurrencyUpdated"
                    /> -->
                                <div class="controls-container d-flex d-lg-none">
                <v-menu :close-on-content-click="false">
                <template #activator="{ props }">
                    <BouncingButton v-bind="props" width="100px">Filters</BouncingButton>
                    <!-- <v-btn height="55" color="primary" v-bind="props" variant="tonal" class="mr-1">
                    Filters
                    </v-btn> -->
                </template>
                <v-list class="filter-list" style="background-color: whitesmoke;">
                    <v-text-field
                    v-model="filterFrom"
                    variant="solo"
                    color="primary"
                    :hide-details="true"
                    type="date"
                    label="From"
                    class="mx-1"
                    />
                    <v-text-field
                    v-model="filterTo"
                    variant="solo"
                    color="primary"
                    :hide-details="true"
                    type="date"
                    label="To"
                    class="mx-1"
                    />
                    <v-select
                        v-model="store.statsCurrencyFilter"
                        variant="solo"
                        style="height: 50px;"
                        class="mx-1 filter-text-field"
                        label="Filter by currency"
                        color="primary"
                        :items="currencies"
                        :hide-details="true"
                        @update:modelValue="transactionCurrencyUpdated"
                    />
                    <v-select
                        v-model="store.transactionType"
                        variant="solo"
                        style="height: 50px;"
                        class="mx-1 filter-text-field"
                        label="Filter by type"
                        color="primary"
                        :items="store.transactionTypes"
                        :hide-details="true"
                        @update:modelValue="transactionTypeUpdated"
                    />
                </v-list>
                </v-menu>
            </div>

                </v-row>
                <v-row no-gutters class="d-flex d-md-none">
                    <v-tabs
                         v-model="tab"
                         bg-color="primary"
                         color="white"
                         style="width: 100%; height: 48px;"
                         fixed-tabs
                    >
                         <v-tab value="one">Chart</v-tab>
                         <v-tab value="two">Categories</v-tab>
                    </v-tabs>
                </v-row>
               <!-- <v-row no-gutters class="pt-2">
                    <v-col no-gutters>
                         <p align="center" class="text-h5">
                              Transactions by categories
                         </p>
                    </v-col>
               </v-row> -->
          </header>
          <div class="d-none d-md-flex" style="display: flex; flex-direction: row; width: 100%; align-items: stretch;  height: calc(100% - 65px);">
               <v-col class="w-100 h-100">
                    <v-card class="mx-auto" style="min-height: 100%; height: 100%; overflow-y: auto">
                         <v-card-title class="form-header">
                              <p align="center">Chart</p>
                         </v-card-title>
                         <v-card-text>
                              <PieChart :transactions="computedTransactions"/>
                         </v-card-text>
                    </v-card>
               </v-col>
               <v-col class="w-100 h-100">
                    <TransactionsByCategories :transactions="computedTransactions"/>
               </v-col>
          </div>
          <div class="d-flex d-md-none flex-column" style="width: 100%;">
               <!-- <div style="position: sticky; top: 0; z-index: 10; background: red; width: 100%; height: 100%;">
                    <header class="tool-bar d-none d-md-flex" style="width: 100%">
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
                    </header>
                    <v-tabs
                         v-model="tab"
                         bg-color="primary"
                         style="width: 100%;"
                         fixed-tabs
                    >
                         <v-tab value="one">Chart</v-tab>
                         <v-tab value="two">Categories</v-tab>
                    </v-tabs>
               </div> -->
               
               <div style="flex: 1; overflow-y: auto; padding-top: calc(48px);">
               <v-tabs-window v-model="tab" style="width: 100%;">
                    <v-tabs-window-item value="one">
                    <v-card class="mx-auto" style="min-height: 100%;">
                         <v-card-text>
                         <PieChart :transactions="computedTransactions"/>
                         </v-card-text>
                    </v-card>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="two">
                    <TransactionsByCategories :transactions="computedTransactions"/>
                    </v-tabs-window-item>
               </v-tabs-window>
               </div>
          </div>
     </section>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from 'vue';
import PieChart from '../components/PieChart.vue'
import TransactionsByCategories from '../components/TransactionsByCategories.vue';
import BouncingButton from "../components/BouncingButton.vue";
import { useGlobalStore } from '../stores/globalStore';
import { filterTransactionByCurrency, filterTransactionsByDateInterval } from "../utils/filters";
import { useTransactionManager } from '../composables/useTransactions';
import { useCurrencies } from '../composables/useCurrencies';

const store = useGlobalStore();
const  { data: currencies } = useCurrencies();
const { transactions } = useTransactionManager()

const tab = ref(null);

const filterFrom: Ref<undefined | string> = ref(undefined)
const filterTo: Ref<undefined | string> = ref(undefined)

// const transactionCurrency: Ref<undefined | string> = ref(store.statsCurrencyFilter);

// const transactionTypes = ['All', 'Outgoing', 'Incoming']
// const transactionType = ref(transactionTypes[0])
function transactionTypeUpdated (newValue: string) {
    store.setTransactionType(newValue);
}

const computedTransactions = computed(() => transactions.value
    ? transactions.value
        .filter(t => filterTransactionsByDateInterval(t, filterFrom.value, filterTo.value))
        .filter(t => store.transactionType === 'ALL' || store.transactionType === t.type)
        .filter(t => filterTransactionByCurrency(t, store.statsCurrencyFilter))
    : []
);


// function transactionCurrencyUpdated (newValue: string) {
//      store.setCurrencyFilter(newValue);
// }

// watch(() => store.statsCurrencyFilter, (newValue) => {
//      transactionCurrency.value = newValue;
// })
</script>

<style scoped>

/* .tool-bar{
     background-color: blue;
     position: fixed;
     z-index: 10;
     width: 100%;
     background-color: whitesmoke;
     max-height: 110px;
}


.navigation-part {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 10px;
} */


/* @media (max-width: 1023px) {
     .tool-bar{
          height: calc(60px + 48px);
          background-color: pink;
     }
} */

@media (max-width: 1023px) {
     .tool-bar{
          height: calc(60px + 48px);
          background-color: pink;
     }
}


:deep(.v-tab) {
  color: rgba(255, 255, 255, 0.7) !important;
}

:deep(.v-tab--selected) {
  color: white !important;
}

</style>