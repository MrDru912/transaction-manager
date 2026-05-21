<template>
  <div class="form-card">

    <!-- Header -->
    <div class="form-header">
      Manage categories
    </div>

    <!-- Category list -->
    <div class="form-body">
      <div
        v-for="(category, i) in categories"
        :key="i"
        class="category-row"
      >
        <v-text-field
          readonly 
          variant="solo"
          color="primary"
          v-model="categories[i].name"
          :hide-details="true"
          required
          :autofocus="i === 0"
          class="category-field"
        />
        <BouncingButton @click="updateCategory(i)">
          <v-icon icon="mdi-pencil" size="large" />
        </BouncingButton>
        <BouncingButton color="#e57373" @click="deleteCategory(i)">
          <v-icon icon="mdi-delete" size="large" />
        </BouncingButton>
      </div>

      <div v-if="categories.length === 0" class="empty-state">
        No categories yet. Add one below.
      </div>
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <BouncingButton type="button" color="#e57373" :width="60" @click="$emit('close-form')">Cancel</BouncingButton>
      <BouncingButton @click="addCategory" :width="60">Add</BouncingButton>
    </div>

    <v-dialog v-model="categoryDialog" width="350px" height="300px">
      <CategoryDialog
        :category="selectedCategory"
        :operation-type="operationType"
        @close-form="categoryDialog = false"
      />
    </v-dialog>
  </div>
</template>


<script setup lang="ts">
import { ref } from "vue";
import BouncingButton from "./BouncingButton.vue";
import CategoryDialog from "./CategoryDialog.vue";
import { OperationType } from "./OperationType";
import { useCategoryMutations } from "../composables/useCategories";
import { Category, Transaction } from "../types";

// const transactionsStore = useTransactionsStore();
// const store = useCategoryStore();
const { deleteCategory: useDeleteCategory } = useCategoryMutations();


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
(event: "close-form"): void;
}>();

const categoryDialog = ref(false);
const selectedCategory = ref();
const operationType = ref(OperationType.ADD)

const addCategory = () => {
  selectedCategory.value = undefined;
  operationType.value = OperationType.ADD;
  categoryDialog.value = true;
}

const updateCategory = (index: number) => {
  selectedCategory.value = props.categories[index];
  operationType.value = OperationType.UPDATE;
  categoryDialog.value = true;
}

const deleteCategory = async (index: number) => {
    const usedCategory = props.transactions.find(t => t.category.id == props.categories[index].id);
    const categoryToBeDeteletedId = props.categories[index].id;
    if (usedCategory === undefined && categoryToBeDeteletedId){
        await useDeleteCategory(categoryToBeDeteletedId);
    } else {
        alert(`This category cannot be deleted since it is being used. Some transaction must be assigned to it.`)
    }
}

</script>


<style scoped>
.form-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}


@keyframes aurora {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.form-body {
      background-color: whitesmoke;
 flex: 1;
  padding: 8px 16px;
  overflow-y: auto;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-field {
  flex: 1;
}

.empty-state {
  text-align: center;
  color: #aaa;
  font-size: 0.9rem;
  padding: 16px 0;
}

.form-actions {
  background-color: whitesmoke;
  margin-top: auto; 
  padding: 8px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: flex-end;
}
</style>