// import { useContext } from 'react';
import { Link } from 'react-router-dom';
// import { AuthContext } from '../../../../context/authContext';
import styles from '../banner.module.css';
import { useMe } from '../../../../domain/queries/useMe';
import { useLogoutMutation } from '../../../../domain/mutations/useLogoutMutation';
export default function Navigation({ isOpen }) {
  // const { isLoggedin, logout } = useContext(AuthContext);
  const { data: loginStatus } = useMe();
  const { mutate: logout } = useLogoutMutation({
    onSuccess: (data) => console.log(data.message),
    onError: (error) => console.log('problem logging out', error.message),
  });
  async function handleLogout() {
    logout();
    // try {
    //   const message = await logout();
    //   if (message) {
    //     console.log(message);
    //   } else {
    //     console.log('problem logging out');
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  }
  return (
    <nav
      className={`${styles['header-menu']} ${isOpen ? styles.open : ''}`}
      aria-label="Main menu"
    >
      {loginStatus?.isLoggedIn ? (
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
