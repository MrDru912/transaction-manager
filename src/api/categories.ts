import { apiClient } from './client';
import type { Category } from '../types/index';

export const categoryApi = {
  // GET /api/categories
  getAllCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/categories');
    return data;
  },

  // GET /api/categories/{id}
  getCategoryById: async (id: number): Promise<Category> => {
    const { data } = await apiClient.get<Category>(`/categories/${id}`);
    return data;
  },

  // POST /api/categories
  createCategory: async (category: Omit<Category, 'id'>): Promise<number> => {
    const { data } = await apiClient.post<number>('/categories', category);
    return data;
  },

  // PUT /api/categories/{id}
  updateCategory: async (category: Category): Promise<void> => {
    await apiClient.put(`/categories/${category.id}`, category);
  },

  // DELETE /api/categories/{id}
  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};