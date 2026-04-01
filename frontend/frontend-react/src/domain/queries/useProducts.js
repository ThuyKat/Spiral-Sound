import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/product';

export const useProducts = (queryParams) =>
  useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => getProducts(queryParams),
  });
//React Query → calls queryFn → calls getProducts() → calls apiClient() → fetch()
//queryKey: a cache
/**
 * It's a cache identifier. React Query stores every response in a cache, and queryKey is the label for that cached result.
 * This means: "cache this result under the key ['products', '?genre=jazz']"

If two components both call useProducts(queryParams) with the same params, React Query sees the same key → returns the cached result → only one actual fetch happens.

If queryParams changes (user picks a different genre), the key changes → React Query sees a new key → fetches fresh data.
When you add to cart, you tell React Query:


queryClient.invalidateQueries({ queryKey: ['cart-count'] })
This means: "the cached data under 'cart-count' is now stale, refetch it". React Query then automatically re-runs the queryFn for anything using that key.

That's how the cart count in your header updates automatically when you add an item — without you manually calling refresh() and passing it through props.
 */
