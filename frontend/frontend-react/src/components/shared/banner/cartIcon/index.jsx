import { useContext } from 'react';
import { CartContext } from '../../../../context/cartContext';
import { AuthContext } from '../../../../context/authContext';
import { Link } from 'react-router-dom';
import cartImage from '../../../../assets/cart.png';
import styles from './cartIcon.module.css';
export default function CartIcon() {
  const { cartCount } = useContext(CartContext);
  const { isLoggedin } = useContext(AuthContext);
  if (!isLoggedin) return null;
  return (
    <Link to="/cart" className={styles['cart-banner-link']} id="cart-icon">
      <img src={cartImage} alt="cart" />
      {cartCount}
    </Link>
  );
}
