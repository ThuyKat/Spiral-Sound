import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeFromCart } from '../api/cart';

export const useRemoveFromCartMutation = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart-count'] });
      onSuccess?.();
    },
    onError,
  });
};
