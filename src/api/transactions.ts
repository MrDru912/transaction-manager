import { apiClient } from './client';
import type { Transaction } from '../types/index';
import { tr } from 'vuetify/locale';
import { TransactionDTO } from '../types/dto';

const dtoToTransaction = (dto: TransactionDTO): Transaction => ({
  ...dto,
  createdAt: new Date(dto.createdAt),
})


export const transactionApi = {

  // GET /api/transactions
  getAllTransactions: async (): Promise<Transaction[]> => {
    const { data } = await apiClient.get<TransactionDTO[]>('/transactions');
        return data.map(dtoToTransaction);

  },

  // GET /api/transactions/{id}
  getTransactionById: async (id: number): Promise<Transaction> => {
    const { data } = await apiClient.get<TransactionDTO>(`/transactions/${id}`);
    return dtoToTransaction(data);
  },

  // POST /api/transactions
  createTransaction: async (transaction: Omit<Transaction, 'id'>): Promise<number> => {
    const { data } = await apiClient.post<number>('/transactions', transaction);
    return data;
  },

  // PUT /api/transactions/{id}
  updateTransaction: async (transaction: Transaction): Promise<void> => {
    await apiClient.put(`/transactions/${transaction.id}`, transaction);
  },

  // DELETE /api/transactions/{id}
  deleteTransaction: async (id: number): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },
};