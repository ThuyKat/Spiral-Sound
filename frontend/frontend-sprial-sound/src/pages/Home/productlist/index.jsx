import { useState, useEffect } from 'react';
export default function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(`/api/products?${queryParams}`);
        const data = res.json();
        setProducts(data);
      } catch (err) {
        console.log(err);
      }
    };
    getProducts();
  }, [products]);

  const handleAddToCart = async (event) => {
    const albumId = event.currentTarget.dataset.id;

    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId: albumId }),
      });

      if (!res.ok) {
        return (window.location.href = '/login.html');
      }

      await updateCartIcon();
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };
  return (
    <div class="products" id="products-container">
      {products.map((album) => {
        return (
          <div class="product-card">
            <img src="./images/${album.image}" alt={album.title} />
            <h2>${album.title}</h2>
            <h3>${album.artist}</h3>
            <p>$${album.price}</p>
            <button
              class="main-btn add-btn"
              data-id={album.id}
              onclick={handleAddToCart}
            >
              Add to Cart
            </button>
            <p class="genre-label">${album.genre}</p>
          </div>
        );
      })}
    </div>
  );
}
