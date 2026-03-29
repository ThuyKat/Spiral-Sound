import Navigation from './navigation';
import image from '../../../assets/menu.svg';
import { useState } from 'react';
import CartIcon from './cartIcon';
import styles from './banner.module.css';

export default function Banner() {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen(!isOpen);
  }
  return (
    <div className={styles['top-banner']} id="top-banner">
      <p id="greeting" className={styles['top-banner-greeting']}></p>
      <CartIcon />
      <button
        className={styles['menu-toggle']}
        aria-label="Toggle menu"
        onClick={handleToggle}
      >
        <img src={image} alt="" />
      </button>
      <Navigation isOpen={isOpen} />
    </div>
  );
}
