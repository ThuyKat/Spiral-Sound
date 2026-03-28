import { useState, useEffect } from 'react';
export default function useCartCount(initialValue = 0) {
  const [cartCount, setCartCount] = useState(initialValue);
  useEffect(() => {
    refresh();
  }, []);
  const refresh = async () => {
    const res = await fetch('/api/cart', { credentials: 'include' });
    if (!res.ok) return;
    const data = await res.json();
    setCartCount(data.totalItems ?? 0);
  };

  return [cartCount, refresh];
}
