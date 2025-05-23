<template>
    <v-card
            class="mx-auto" style="min-height: 100%; height: 100%;"
            v-if="categoryListOpened"
            >
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

            <v-card-text style="height: 100%; overflow-y: scroll;">
                <v-list>
                    <v-list-item
                    v-for="(category, i) in store.categories"
                    :key="i"
                    :value="category"
                    color="primary"
                    :disabled="transactionsByCategories[i].length === 0"
                    @click="setSelectedCategoryIndex(i)"
                    >
                        <v-row no-gutters>
                                <v-col>
                                    <p>{{ category }}</p>
                                </v-col>
                                <v-col>
                                    {{ Math.round(transactionsSumPercentageAggregation[i]*100)/100}}%
                                </v-col>
                                <v-col>
                                    {{ transactionsSumAggregation[i] }}  
                                </v-col>
                        </v-row>
                    </v-list-item>
                </v-list>
            </v-card-text>
    </v-card>
    <v-card v-if="categoryOpened" class="mx-auto h-100">
            <v-card-title>
                <template v-slot:default>
                    <v-btn variant="tonal" color="primary" @click="closeCategoryInfo">
                        <template v-slot:default>
                                see categories
                        </template>
                        <template v-slot:prepend>
                                <v-icon size="large">mdi-arrow-left</v-icon>
                        </template>
                    </v-btn>
                    <p v-if="transactionsByCategories[selectedCategoryIndex].length === 0">No transactions of this category</p>
                    <p v-else class="text-h5">{{ store.categories[selectedCategoryIndex] }}</p>
                </template>
            </v-card-title>
            <v-card-text style="height: 100%; overflow-y: scroll;">
                <!-- {{ transactionsByCategories[selectedCategoryIndex].map(t => t.amount) }} -->
                <v-list color="primary">
                    <v-list-item
                    v-for="(transaction, i) in transactionsByCategories[selectedCategoryIndex]"
                    :key="i"
                    :value="transaction"
                    color="primary"
                    @click="setSelectedTransaction(transaction)"
                    >
                        <v-row>
                                <v-col>
                                    {{ dateToString(transaction.date) }}
                                </v-col>
                                <v-col>
                                    {{ transaction.amount }} {{ transaction.currency }}
                                </v-col>
                                <v-col>
                                    {{ transaction.organisation }}
                                </v-col>
                        </v-row>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions>
            </v-card-actions>
    </v-card>

    <v-card v-if="categoryTransactionsOpened && selectedTransaction" class="mx-auto h-100">
            <v-card-title>
                <v-btn variant="tonal" color="primary" @click="closeTransactionInfo">
                    <template v-slot:default>
                        see transactions
                    </template>
                    <template v-slot:prepend>
                        <v-icon size="large">mdi-arrow-left</v-icon>
                    </template>
                </v-btn>
            </v-card-title>
            <v-card-text>
                <p class="text-h5">Transaction information</p>
                <v-list>
                    <v-list-item>
                        <p>Date: {{ dateToString(selectedTransaction.date) }}</p>
                    </v-list-item>
                    <v-list-item>
                        <p>Amount: {{ selectedTransaction.amount }} {{ selectedTransaction.currency }}</p>
                    </v-list-item>
                    <v-list-item>
                        <p>Category: {{ selectedTransaction.category }}</p>
                    </v-list-item>
                    <v-list-item>
                        <p>Organisation: {{ selectedTransaction.organisation }}</p>
                    </v-list-item>
                    <v-list-item>
                        <p>Location: {{ selectedTransaction.location }}</p>
                    </v-list-item>
                    <v-list-item>
                        <p>Description: {{ selectedTransaction.description }}</p>
                    </v-list-item>
                </v-list>
            </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed, Ref, ref, watch } from 'vue';
import { Transaction } from '../interfaces/Transaction';
import { useTransactionsStore } from '../stores/transactionStore'
import { dateToString } from '../utils/dateUtils';

const store = useTransactionsStore();

const categoryListOpened = ref(true);
const categoryOpened = ref(false);
const categoryTransactionsOpened = ref(false);
const selectedCategoryIndex = ref(-1);
const selectedTransaction: Ref<undefined | Transaction> = ref(undefined);
const transactionCurrency: Ref<undefined | string> = ref(store.statsCurrencyFilter);

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

const transactionsSumPercentageAggregation = computed(() => {
     let categorisedTransactionsPercentage: number[] = [];
     transactionsSumAggregation.value.forEach(categorySum => {
        if (transactionsTotalSum.value === 0) categorisedTransactionsPercentage.push(0);
        else categorisedTransactionsPercentage.push(categorySum / transactionsTotalSum.value * 100);
     });
     return categorisedTransactionsPercentage;
})

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
    store.statsCurrencyFilter = newValue;
}

watch(() => store.statsCurrencyFilter, (newValue) => {
     transactionCurrency.value = newValue;
})
</script>
