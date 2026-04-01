import { useQuery } from '@tanstack/react-query';
import { getCart } from '../api/cart';

export const useCart = () =>
  useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const data = await getCart();
      return data.items;
    },
  });
