import { useState, useEffect } from 'react';
export default function useCartCount(initialValue = 0) {
  const [cartCount, setCartCount] = useState(initialValue);
  const refresh = async () => {
    const res = await fetch('/api/cart/cart-count', { credentials: 'include' });
    if (!res.ok) return;
    const data = await res.json();
    setCartCount(data.totalItems ?? 0);
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, []);

  return [cartCount, refresh];
}
