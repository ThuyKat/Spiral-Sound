import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../api/auth';

export const useLoginMutation = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ username, password }) => login(username, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['cart-count'] });
      onSuccess?.();
    },
    onError,
  });
};
