import { useContext } from 'react';
import { CartContext } from '../../../../context/cartContext';
import { AuthContext } from '../../../../context/authContext';
import { Link } from 'react-router-dom';
import cartImage from '../../../../assets/cart.png';
export default function CartIcon() {
  const { cartCount } = useContext(CartContext);
  const { isLoggedin } = useContext(AuthContext);
  if (!isLoggedin) return null;
  return (
    <Link to="/cart" className="cart-banner-link">
      <img src={cartImage} alt="cart" />
      {cartCount}
    </Link>
  );
}
