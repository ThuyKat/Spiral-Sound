import { apiClient } from './client';

export const getProducts = (queryParams) =>
  apiClient(`/api/products?${queryParams}`);
