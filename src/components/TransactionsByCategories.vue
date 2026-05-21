<template>
    <div style="height: 100%;">
        <v-card
            class="mx-auto" style="min-height: 100%; height: 100%; overflow-y: auto;"
            >
            <!-- <v-card-title class="form-header d-none d-md-flex">
                    <p align="center">Categories</p>
                    
            </v-card-title> -->
            <v-card-title class="form-header d-none d-md-flex">
                    
                <template v-slot:default>
                    <v-row no-gutters style="justify-content: space-around;">
                        <p align="center">{{ rightCardTitle }}</p>
                        <v-btn  v-if="categoryOpened" variant="outlined" style="margin-left: 16px;" @click="closeCategoryInfo">
                            <template v-slot:default>
                                    see categories
                            </template>
                            <template v-slot:prepend>
                                    <v-icon size="large">mdi-arrow-left</v-icon>
                            </template>
                        </v-btn>
                        <v-btn v-if="categoryTransactionsOpened && selectedTransaction" variant="outlined" style="margin-left: 16px;" @click="closeTransactionInfo">
                            <template v-slot:default>
                                see transactions
                            </template>
                            <template v-slot:prepend>
                                <v-icon size="large">mdi-arrow-left</v-icon>
                            </template>
                        </v-btn>
                        <p v-if="categoryOpened && transactionsByCategories[selectedCategoryIndex].length === 0">No transactions of this category</p>
                    </v-row>
                </template>
            </v-card-title>

            <v-card-text>
                <div class="small-tab-header d-flex d-md-none flex-column">
                    <v-row no-gutters style="justify-content: space-between; align-items: center;">
                        <v-chip color="primary" text-color="white" class="ma-0" elevation="2">
                            {{ rightCardTitle }}
                        </v-chip>
                        <v-btn  v-if="categoryOpened" variant="outlined" style="margin-left: 16px;" @click="closeCategoryInfo">
                            <template v-slot:default>
                                    see categories
                            </template>
                            <template v-slot:prepend>
                                    <v-icon size="large">mdi-arrow-left</v-icon>
                            </template>
                        </v-btn>
                        <v-btn v-if="categoryTransactionsOpened && selectedTransaction" variant="outlined" style="margin-left: 16px;" @click="closeTransactionInfo">
                            <template v-slot:default>
                                see transactions
                            </template>
                            <template v-slot:prepend>
                                <v-icon size="large">mdi-arrow-left</v-icon>
                            </template>
                        </v-btn>
                        <p v-if="categoryOpened && transactionsByCategories[selectedCategoryIndex].length === 0">No transactions of this category</p>
                    </v-row>
                </div>
                <div v-if="categoryListOpened">
                    <v-row no-gutters style="padding: 12px 16px;">
                        <v-col class="transaction-info-label">
                            Name
                        </v-col>
                        <v-col class="transaction-info-label">
                            Percentage
                        </v-col>
                        <v-col class="transaction-info-label">
                            Total sum
                        </v-col>
                    </v-row>
                    <v-list>
                        <v-list-item
                        v-for="(category, i) in categories"
                        :key="i"
                        :value="category"
                        color="primary"
                        :disabled="transactionsByCategories[i].length === 0"
                        @click="setSelectedCategoryIndex(i)"
                        >
                            <v-row no-gutters>
                                    <v-col>
                                        <p>{{ category.name }}</p>
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
                </div>
                <div v-if="categoryOpened">
                    <v-row no-gutters style="padding: 12px 16px;">
                        <v-col class="transaction-info-label">
                            Date
                        </v-col>
                        <v-col class="transaction-info-label">
                            Amount
                        </v-col>
                        <v-col class="transaction-info-label">
                            Counterparty
                        </v-col>
                    </v-row>
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
                                    {{ dateToString(transaction.createdAt) }}
                                </v-col>
                                <!-- <v-col>
                                    {{ transaction.getFormattedAmount() }}
                                </v-col> -->
                                <v-col>
                                    {{ getFormattedAmount(transaction) }}
                                </v-col>
                                <v-col>
                                    {{ transaction.counterparty ?? "N/A" }}
                                </v-col>
                            </v-row>
                        </v-list-item>
                    </v-list>
                </div>
                <div v-if="categoryTransactionsOpened && selectedTransaction">
                    <v-list>
                        <v-list-item class="transaction-info-item">
                            <v-row no-gutters align="center">
                                <v-col cols="4" class="transaction-info-label">Date</v-col>
                                <v-col cols="8" class="transaction-info-value">
                                    {{ dateToString(selectedTransaction.createdAt) }}
                                </v-col>
                            </v-row>
                        </v-list-item>
                        <v-list-item class="transaction-info-item">
                            <v-row no-gutters align="center">
                                <v-col cols="4" class="transaction-info-label">Amount</v-col>
                                <v-col cols="8" class="transaction-info-value">
                                    {{ getFormattedAmount(selectedTransaction) }}
                                </v-col>
                            </v-row>
                        </v-list-item>
                        <v-list-item class="transaction-info-item">
                            <v-row no-gutters align="center">
                                <v-col cols="4" class="transaction-info-label">Category</v-col>
                                <v-col cols="8" class="transaction-info-value">
                                    {{ selectedTransaction.category.name }}
                                </v-col>
                            </v-row>
                        </v-list-item>
                        <v-list-item class="transaction-info-item">
                            <v-row no-gutters align="center">
                                <v-col cols="4" class="transaction-info-label">Organisation</v-col>
                                <v-col cols="8" class="transaction-info-value">
                                    {{ selectedTransaction.counterparty ?? "N/A" }}
                                </v-col>
                            </v-row>
                        </v-list-item>
                        <v-list-item class="transaction-info-item">
                            <v-row no-gutters align="center">
                                <v-col cols="4" class="transaction-info-label">Counterparty</v-col>
                                <v-col cols="8" class="transaction-info-value">
                                    {{ selectedTransaction.counterparty ?? "N/A" }}
                                </v-col>
                            </v-row>
                        </v-list-item>
                        <v-list-item class="transaction-info-item">
                            <v-row no-gutters align="center">
                                <v-col cols="4" class="transaction-info-label">Description</v-col>
                                <v-col cols="8" class="transaction-info-value">
                                    {{ selectedTransaction.description == "" ? "N/A" : selectedTransaction.description }}
                                </v-col>
                            </v-row>
                        </v-list-item>
                    </v-list>
                </div>
            </v-card-text>
        </v-card>
    
    </div>
</template>

<script setup lang="ts">
import { computed, Ref, ref, watch } from 'vue';
import { useTransactionsStore } from '../stores/transactionStore'
import { dateToString } from '../utils/dateUtils';
import { Transaction } from '../types';
import { useCategoryManager } from '../composables/useCategories';
import { useGlobalStore } from '../stores/globalStore';
import { getFormattedAmount } from '../utils/formaters';

const props = 
  defineProps<{
    transactions: Transaction[];
  }>();

// const store = useTransactionsStore();
const store = useGlobalStore();
const { categories } = useCategoryManager()

const categoryListOpened = ref(true);
const categoryOpened = ref(false);
const categoryTransactionsOpened = ref(false);
const selectedCategoryIndex = ref(-1);
const selectedTransaction: Ref<undefined | Transaction> = ref(undefined);
const transactionCurrency: Ref<undefined | string> = ref(store.statsCurrencyFilter);

const rightCardTitle = computed(() => {
     if (categoryListOpened.value) return "Categories";
     if (categoryOpened.value) return categories.value[selectedCategoryIndex.value].name;
     if (categoryTransactionsOpened.value) return "Transaction details";
     return "";
})
/* TODO */
/* Reactivity of categories does not work. When category added it is not reflected on statistics page
although the categories data are retrieved from store*/

// const debugTransactionsCount = computed(() => {
//   return store.transactions.length;
// });

// const transactionsFilterdByCurrency = computed(() => {
//      return store.transactions.filter(t => !transactionCurrency.value || (transactionCurrency.value && transactionCurrency.value === t.currency))
// })

const transactionsByCategories = computed(() => {
    if (!categories.value) return [];
    return categories.value.map(category => {
        return props.transactions.filter(t => {
            return t.category.id === category.id;
        });
    });
});
const transactionsTotalSum = computed(() => {
     const totalAmountSpent = props.transactions
          .map(t => t.type === 'OUTGOING' ? -t.amount : t.amount)
          .reduce((acc, currentVal) => acc + currentVal, 0);
     return totalAmountSpent;
})

const transactionsSumAggregation = computed(() => {
     return transactionsByCategories.value.map(category => {
          return category.reduce((acc, t) => {
               const signedAmount = t.type === 'OUTGOING' ? -t.amount : t.amount;
               return acc + signedAmount;
          }, 0);
     });
});

const transactionsSumPercentageAggregation = computed(() => {
     return transactionsSumAggregation.value.map(categorySum => {
          if (transactionsTotalSum.value === 0) return 0;
          return categorySum / transactionsTotalSum.value * 100;
     });
});

const setSelectedCategoryIndex = (index: number) => {
     selectedCategoryIndex.value = index;
     categoryListOpened.value = false;
     categoryOpened.value = true;
}

const setSelectedTransaction = (transaction: Transaction) => {
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

<style scoped>
.small-tab-header {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  margin-bottom: 16px;
}

.transaction-info-item {
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.transaction-info-item:last-child {
  border-bottom: none;
}
.transaction-info-label {
  font-weight: 600;
  opacity: 0.8;
}
.transaction-info-value {
  text-align: right;
}
</style>
