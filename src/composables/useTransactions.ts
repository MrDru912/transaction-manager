import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { transactionApi } from '../api/transactions';
import { computed } from 'vue';

// Query Keys
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: () => [...transactionKeys.lists()] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: number) => [...transactionKeys.details(), id] as const,
};

// Get all transactions
export function useTransactions() {
  return useQuery({
    queryKey: transactionKeys.list(),
    queryFn: transactionApi.getAllTransactions,
  });
}

// Get single transaction
export function useTransaction(id: number) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionApi.getTransactionById(id),
    enabled: !!id,
  });
}

// Create transaction
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.list() });
    },
  });
}

// Delete transaction
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.list() });
    },
  });
}

// Add to your transactions composable
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.list() });
    },
  });
}

export function useTransactionManager() {
  const transactions = useTransactions();

  return {
    transactions: transactions.data,
    isLoading: computed(() =>
      transactions.isLoading.value
    ),
    error: transactions.error,
  };
}

export function useTransactionMutations() {
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  return {
    addTransaction: createMutation.mutateAsync,
    updateTransaction: updateMutation.mutateAsync,
    deleteTransaction: deleteMutation.mutateAsync,
    isLoading: computed(() => createMutation.isPending.value || updateMutation.isPending.value || deleteMutation.isPending),
  };
}
