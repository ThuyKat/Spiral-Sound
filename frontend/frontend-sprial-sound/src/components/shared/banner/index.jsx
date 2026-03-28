import Navigation from './navigation';
import image from '../../../assets/menu.svg';
import { useState } from 'react';
import CartIcon from './cartIcon';

export default function Banner() {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen(!isOpen);
  }
  return (
    <div className="top-banner" id="top-banner">
      <p id="greeting" className="top-banner-greeting"></p>
      <CartIcon />
      <button
        className="menu-toggle"
        aria-label="Toggle menu"
        onClick={handleToggle}
      >
        <img src={image} alt="" />
      </button>
      <Navigation isOpen={isOpen} />
    </div>
  );
}
