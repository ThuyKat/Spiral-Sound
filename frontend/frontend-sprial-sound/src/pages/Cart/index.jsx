import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './cart.module.css';
export default function Cart() {
  const ref = useRef(0);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [message, setMessage] = useState('');
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    async function fetchCartItems() {
      const res = await fetch('/api/cart/', { credentials: 'include' });

      if (!res.ok) {
        ref.current.disabled = true;
        ref.current.classList.add(styles.disabled);
        setIsUnauthorized(true);
        return;
      }

      const { items } = await res.json();
      setCartItems(items);
    }
    fetchCartItems();
  }, []);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  function handleRemoveItem(itemId) {
    async function removeItem(itemId) {
      try {
        const res = await fetch(`/api/cart/${itemId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (res.status === 204) {
          const updatedItems = cartItems.filter((item) => item.id !== itemId);
          setCartItems(updatedItems);
        } else {
          console.error('Error removing item:', await res.text());
        }
      } catch (err) {
        console.error('Error removing item:', err);
      }
    }
    removeItem(itemId);
  }
  async function handleCheckout() {
    ref.current.disabled = true;
    setMessage('Redirecting to payment...');

    try {
      const res = await fetch('/api/checkout/create-checkout-session', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Something went wrong.');
        ref.current.disabled = false;
        return;
      }

      // Redirect to Stripe's hosted checkout page
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      setMessage('Could not connect to payment service.');
      ref.current.disabled = false;
    }
  }
  return (
    <main className={styles['cart-main']}>
      <h2>Your Basket</h2>
      <ul id="cart-list">
        {cartItems.map((item) => {
          const itemTotal = item.price * item.quantity;
          return (
            <li key={item.cartItemId} className={styles['cart-item']}>
              <div>
                <strong>{item.title}: </strong>
                <button
                  data-id={item.cartItemId}
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.cartItemId)}
                >
                  🗑️
                </button>
              </div>
              <span>
                × {item.quantity} = ${itemTotal.toFixed(2)}
              </span>
            </li>
          );
        })}
      </ul>
      <p id="cart-total">Total: {cartTotal}</p>
      {isUnauthorized && (
        <p>
          Please <Link to="/login">log in</Link>.
        </p>
      )}
      {message && <p id="user-message">{message}</p>}
      <button
        className={styles['main-btn']}
        id="checkout-btn"
        ref={ref}
        onClick={handleCheckout}
        disabled={cartTotal < 0 ? true : false}
      >
        Checkout
      </button>
    </main>
  );
}
