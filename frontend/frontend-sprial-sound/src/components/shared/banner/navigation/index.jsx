export default function Navigation() {
  return (
    <nav class="header-menu" aria-label="Main menu">
      <a href="/login.html" id="login">
        Log in
      </a>
      <a href="/signup.html" id="signup">
        Sign up
      </a>
      <button class="main-btn" id="logout-btn">
        Log out
      </button>
      <form role="search">
        <label for="search-input" class="visually-hidden">
          Search products
        </label>
        <input
          type="text"
          placeholder="Search..."
          id="search-input"
          autocomplete="off"
        />
      </form>
    </nav>
  );
}
