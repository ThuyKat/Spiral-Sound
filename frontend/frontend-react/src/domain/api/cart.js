import { apiClient } from './client';

export const getCart = () => apiClient('/api/cart/');
export const addToCart = (productId) =>
  apiClient('/api/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  });
export const removeFromCart = (itemId) =>
  apiClient(`/api/cart/${itemId}`, { method: 'DELETE' });
export const getCartCount = () => apiClient('/api/cart/cart-count');
