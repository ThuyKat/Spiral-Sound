import { useQuery } from '@tanstack/react-query';
import { getCartCount } from '../api/cart';

export const useCartCount = () =>
  useQuery({
    queryKey: ['cart-count'],
    queryFn: getCartCount,
  });
