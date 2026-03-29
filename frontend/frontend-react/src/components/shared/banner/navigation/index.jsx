import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../../context/authContext';
import styles from '../banner.module.css';
export default function Navigation({ isOpen }) {
  const { isLoggedin, logout } = useContext(AuthContext);

  async function handleLogout() {
    try {
      const message = await logout();
      if (message) {
        console.log(message);
      } else {
        console.log('problem logging out');
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <nav
      className={`${styles['header-menu']} ${isOpen ? styles.open : ''}`}
      aria-label="Main menu"
    >
      {isLoggedin ? (
        <button className="main-btn" id="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      ) : (
        <>
          <Link to="/login" id="login">
            Log in
          </Link>
          <Link to="/signup" id="signup">
            Sign up
          </Link>
        </>
      )}
      <form role="search">
        <label htmlFor="search-input" className="visually-hidden">
          Search products
        </label>
        <input
          type="text"
          placeholder="Search..."
          id="search-input"
          autoComplete="off"
        />
      </form>
    </nav>
  );
}
