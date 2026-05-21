<template>
  <div class="form-card">

    <!-- Header -->
    <div v-if="operationType === OperationType.ADD" class="form-header">
      Add category
    </div>
    <div v-if="operationType === OperationType.UPDATE" class="form-header">
      Update category
    </div>

    <!-- Category list -->
    <div class="form-body">
        <v-text-field
          variant="solo"
          color="primary"
          v-model="categoryName"
          placeholder="Name"
          :hide-details="true"
          required
          class="category-field"
        />
        <v-text-field
          variant="solo"
          color="primary"
          v-model="categoryDescription"
          placeholder="Description"
          :hide-details="true"
          required
          class="category-field"
        />
    </div>
    <!-- Actions -->
    <div class="form-actions">
      <BouncingButton type="button" color="#e57373" :width="60" @click="$emit('close-form')">Cancel</BouncingButton>
      <BouncingButton v-if="operationType === OperationType.ADD" :width="60" @click="addCategory">Save</BouncingButton>
      <BouncingButton v-if="operationType === OperationType.UPDATE" :width="60" @click="updateCategory">Save</BouncingButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BouncingButton from "./BouncingButton.vue";
import { Category } from "../types";
import { OperationType } from "./OperationType";
import { useCategoryMutations } from "../composables/useCategories";

const { addCategory: useAddcategory, updateCategory: useUpdateCategory } = useCategoryMutations();

const props = withDefaults(
  defineProps<{
    category?: Category;
    index?: number;
    operationType?: OperationType;
  }>(),
  {
    category: () => ({
      id: undefined,
      name: "",
      description: "",
    }),
    transactionIndex: undefined,
    operationType: OperationType.ADD,
  },
);

const categoryName = ref(props.category.name);
const categoryDescription = ref(props.category.description);

const emits = defineEmits<{
(event: "add-category", category: Omit<Category, 'id'>): void;
(event: "update-category", category: Category): void;
(event: "close-form"): void;
}>();

const itemDialog = ref(false);

const addCategory = async () => {
  const newCategory: Omit<Category, "id"> = {
    name: categoryName.value,
    description: categoryDescription.value,
  }
  await useAddcategory(newCategory);
  closeForm();
}

const updateCategory = async () => {
  const updatedCategory: Category = {
    id: props.category.id,
    name: categoryName.value,
    description: categoryDescription.value,
  }
  await useUpdateCategory(updatedCategory);
  closeForm();
}

const closeForm = () => {
  emits('close-form');
}

// const deleteCategory = (index: number) => {
//     const usedCategory = store.categories.find(t => t.id == store.categories[index].id);
//     if (usedCategory === undefined){
//         store.categories.splice(index, 1); 
//     } else {
//         alert(`This category cannot be deleted since it is being used. Some transaction must be assigned to it.`)
//     }
// }

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