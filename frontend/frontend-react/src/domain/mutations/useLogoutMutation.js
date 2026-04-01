import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../api/auth';

export const useLogoutMutation = ({ onSuccess, onError } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], { isLoggedIn: false });
      queryClient.cancelQueries({ queryKey: ['me'] });
      queryClient.removeQueries({ queryKey: ['cart'] });
      queryClient.removeQueries({ queryKey: ['cart-count'] });
      onSuccess?.(data);
    },
    onError,
  });
};
