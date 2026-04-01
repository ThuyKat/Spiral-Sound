import { apiClient } from './client';

export const createCheckoutSession = () =>
  apiClient('/api/checkout/create-checkout-session', { method: 'POST' });
