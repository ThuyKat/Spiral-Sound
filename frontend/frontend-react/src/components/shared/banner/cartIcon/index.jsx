// import { useContext } from 'react';
// import { CartContext } from '../../../../context/cartContext';
// import { AuthContext } from '../../../../context/authContext';
import { Link } from 'react-router-dom';
import cartImage from '../../../../assets/cart.png';
import styles from './cartIcon.module.css';
import { useCartCount } from '../../../../domain/queries/useCartCount';
import { useMe } from '../../../../domain/queries/useMe';

export default function CartIcon() {
  // const { cartCount } = useContext(CartContext);
  // const { isLoggedin } = useContext(AuthContext);
  const { data: cartCountData } = useCartCount();
  const { data: user } = useMe();
  // if (!isLoggedin) return null;
  if (!user?.isLoggedIn) return null;
  return (
    <Link to="/cart" className={styles['cart-banner-link']} id="cart-icon">
      <img src={cartImage} alt="cart" />
      {cartCountData?.totalItems ?? 0}
    </Link>
  );
}
