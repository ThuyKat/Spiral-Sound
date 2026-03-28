import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useCartCount from '../../../hooks/useCartCount';
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [queryParams, setQueryParams] = useSearchParams();
  const { refresh } = useCartCount();
  const navigate = useNavigate();
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(`/api/products?${queryParams}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.log(err);
      }
    };
    getProducts();
  }, [queryParams]);

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
        // return (window.location.href = '/login.html');
        return navigate('/login');
      }
      await refresh();
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };
  return (
    <div className="products" id="products-container">
      {products.map((album) => {
        return (
          <div className="product-card" key={album.id}>
            <img src={`/images/${album.image}`} alt={album.title} />
            <h2>{album.title}</h2>
            <h3>{album.artist}</h3>
            <p>${album.price}</p>
            <button
              className="main-btn add-btn"
              data-id={album.id}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <p className="genre-label">{album.genre}</p>
          </div>
        );
      })}
    </div>
  );
}
