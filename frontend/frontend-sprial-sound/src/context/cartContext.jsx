import { createContext } from 'react';
import useCartCount from '../hooks/useCartCount';

const CartContext = createContext();
export { CartContext };
export default function CartContextProvider({ children }) {
  const [cartCount, refresh] = useCartCount(0);

  return (
    <CartContext.Provider value={{ cartCount, refresh }}>
      {children}
    </CartContext.Provider>
  );
}
