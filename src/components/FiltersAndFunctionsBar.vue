<!-- FilterControls.vue -->
<template>
  <v-row no-gutters>
    <!-- Desktop -->
    <div class="controls-container d-none d-lg-flex">
      <v-text-field
        v-model="filterFrom"
        color="primary"
        :hide-details="true"
        type="date"
        variant="solo"
        label="From"
        class="pr-1 filter-text-field"
      />
      <v-text-field
        v-model="filterTo"
        style="height: 50px"
        color="primary"
        :hide-details="true"
        type="date"
        variant="solo"
        label="To"
        class="pr-1 filter-text-field"
      />
      <v-select
        v-model="store.statsCurrencyFilter"
        style="height: 50px; width: 120px;"
        class="mx-1 filter-text-field"
        label="Currency"
        variant="solo"
        color="primary"
        :items="currencies"
        @update:modelValue="transactionCurrencyUpdated"
      />
      <v-select
        v-model="store.transactionType"
        style="height: 50px; width: 130px;"
        class="mx-1 filter-text-field"
        label="Type"
        variant="solo"
        color="primary"
        :items="store.transactionTypes"
        @update:modelValue="transactionTypeUpdated"
      />

      <!-- Desktop action buttons injected by parent -->
      <slot name="actions-desktop" />
    </div>
  </v-row>

  <!-- Mobile -->
  <div class="controls-container d-flex d-lg-none">
    <v-menu :close-on-content-click="false">
      <template #activator="{ props }">
        <BouncingButton v-bind="props" width="100px">Filters</BouncingButton>
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

    <v-menu>
      <template #activator="{ props }">
        <BouncingButton v-bind="props" width="100px">Manage</BouncingButton>
      </template>
      <v-list>
        <!-- Mobile action items injected by parent -->
        <slot name="actions-mobile" />
      </v-list>
    </v-menu>
  </div>

  <!-- Dialogs injected by parent -->
  <slot name="dialogs" />
</template>


<script setup lang="ts">
import { Ref, ref } from "vue";
import { Category, Transaction } from "../types";
import BouncingButton from "./BouncingButton.vue";
import { useCurrencies } from "../composables/useCurrencies";
import { useGlobalStore } from "../stores/globalStore";

const  { data: currencies } = useCurrencies();
const store = useGlobalStore();

const props = withDefaults(
  defineProps<{
    transactions?: Transaction[];
    categories?: Category[];
  }>(),
  {
    transactions: () => [],
    categories: () => [],
  },
);

const emits = defineEmits<{
  (event: "add-item"): void;
  (event: "edit-item", item: Transaction, index: number): void;
  (event: "delete-item", index: number): void;
  (event: "manage-categories"): void;
  (event: "download"): void;
}>();


const filterFrom: Ref<undefined | string> = ref(undefined)
const filterTo: Ref<undefined | string> = ref(undefined)

// const transactionTypes: TransactionTypeItem[] = [
//     { title: 'All', value: 'ALL' },
//     { title: 'Incoming', value: TransactionType.INCOMING },
//     { title: 'Outgoing', value: TransactionType.OUTGOING },
//   ]

// const transactionType = ref<TransactionType | 'ALL'>('ALL');
// const transactionType: Ref<TransactionType | 'ALL'> = store.transactionType || TransactionType.OUTGOING;

function transactionCurrencyUpdated (newValue: string) {
    store.setCurrencyFilter(newValue);
}

function transactionTypeUpdated (newValue: string) {
    store.setTransactionType(newValue);
}




</script>

<style scoped>

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


</style>
