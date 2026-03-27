import Navigation from './navigation';
import image from '../../assets/menu.svg';

export default function Banner() {
  return (
    <div class="top-banner" id="top-banner">
      <p id="greeting" class="top-banner-greeting"></p>
      <a href="/cart.html" id="cart-banner" class="cart-banner-link"></a>
      <button class="menu-toggle" aria-label="Toggle menu">
        <img src={image} alt="" />
      </button>
      <Navigation />
    </div>
  );
}
