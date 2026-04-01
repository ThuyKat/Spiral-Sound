import { apiClient } from './client';

export const getMe = () => apiClient('/api/auth/me');

export const login = (username, password) =>
  apiClient('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

export const logout = () => apiClient('/api/auth/logout', { method: 'POST' });
