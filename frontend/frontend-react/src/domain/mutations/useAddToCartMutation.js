import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCart } from '../api/cart';

export const useAddToCartMutation = ({ onError } = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['cart-count'] });
    },
    onError,
  });
};
// mutation — runs only when you call mutate()
/**
 * user clicks button
  → mutate(albumId)
    → mutationFn(albumId) → addToCart(albumId) → fetch POST /api/cart/add
      → onSuccess → invalidateQueries(['cart-count'])
        → useCartCount reruns its queryFn → fetch GET /api/cart/cart-count
          → header updates automatically

 */
