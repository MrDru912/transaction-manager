import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { categoryApi } from '../api/categories';
import { computed } from 'vue';

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: () => [...categoryKeys.lists()] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};

// Get all categories
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: categoryApi.getAllCategories,
  });
}

// Get single category
export function useCategory(id: number) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryApi.getCategoryById(id),
    enabled: !!id,
  });
}

// Create category
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
}

// Delete category
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
    },
  });
}

// Unified composable
export function useCategoryManager() {
  const categories = useCategories();

  return {
    // data
    categories: categories.data,
    // loading states
    isLoading: categories.isLoading,
    // errors
    error: categories.error,
    // actions
  };
}

export function useCategoryMutations() {
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  return {
    // data
    // loading states
    isLoading: computed(() => createMutation.isPending.value || updateMutation.isPending.value || deleteMutation.isPending),
    // actions
    addCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
  };
}
