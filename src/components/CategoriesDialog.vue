<template>
    <v-card class="pa-4">
        <v-card-title>
            <p class="text-center">Manage categories</p>
        </v-card-title>
        <v-card-text style="max-height: 500px; overflow-y: scroll;">
            <!-- <v-row no-gutters> -->
                <v-col>
                        <v-row v-for="(category, i) in store.categories" :key="i" no-gutters class="my-1">
                            <v-col cols="10" class="pr-1">
                                <v-text-field color="primary" v-model="store.categories[i]" :placeholder="category" :hide-details="true" required/>
                            </v-col>
                            <v-col cols="2">
                                <v-btn color="red-accent-2" variant="tonal" height="100%" width="70px" class="" @click="deleteCategory(i)">
                                    <v-icon
                                        icon="mdi-delete"
                                        size="large"
                                    />
                                </v-btn>
                            </v-col>
                        </v-row>
                </v-col>
            <!-- </v-row> -->
        </v-card-text>
        <!-- <v-row no-gutters class="mt-2"> -->
            <!-- <v-col class="px-1"> -->
        <v-card-actions>
            <v-btn id="add-button" variant="tonal" color="primary" block @click="addCategory">Add</v-btn>
        </v-card-actions>
            <!-- </v-col> -->
        <!-- </v-row> -->
    </v-card>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
import { useTransactionsStore } from '../stores/transactionStore'
const store = useTransactionsStore();

const emits = defineEmits<{
(event: "add-transaction", transaction): void;
(event: "edit-transaction", transaction): void;
}>();

const addCategory = () => {
    store.categories.push("")
}

const deleteCategory = (index: number) => {
    const usedCategory = store.transactions.find(t => t.category == store.categories[index]);
    if (usedCategory === undefined){
        store.categories.splice(index, 1); 
    } else {
        alert(`This category cannot be deleted since it is being used. Some transaction must be assigned to it.`)
    }
}

</script>