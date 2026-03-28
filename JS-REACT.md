# Migrating Spiral Sounds from Vanilla JS to React

This document details the step-by-step process of converting the Spiral Sounds vinyl store from a plain HTML/JavaScript frontend to a React component-based architecture.

---

## Original Architecture (Vanilla JS)

The original app was a classic multi-page application with separate HTML files for each page and vanilla JavaScript modules wired up with `addEventListener`.

### File structure
```
frontend/
├── index.html          # Home page
├── login.html          # Login page
├── signup.html         # Signup page
├── cart.html           # Shopping cart page
├── success.html        # Payment success page
├── css/index.css       # Shared stylesheet
├── images/             # Product and brand images
└── js/
    ├── index.js        # App init and event listeners
    ├── menu.js         # Hamburger menu toggle
    ├── login.js        # Login form handling
    ├── signup.js       # Signup form handling
    ├── logout.js       # Logout functionality
    ├── authUI.js       # Auth state (greeting, show/hide menu items)
    ├── cart.js         # Cart page logic
    ├── cartService.js  # Cart operations (add, remove, fetch count)
    ├── productService.js # Product fetch with filters
    └── productUI.js    # Product rendering via innerHTML
```

### How it worked

Each HTML page loaded its own JS modules. State was managed by querying the DOM directly. Navigation between pages caused full page reloads.

**Example — Product rendering (productUI.js):**
```javascript
export function renderProducts(products) {
  const albumsContainer = document.getElementById('products-container')
  const cards = products.map((album) => `
    <div class="product-card">
      <img src="./images/${album.image}" alt="${album.title}">
      <h2>${album.title}</h2>
      <h3>${album.artist}</h3>
      <p>$${album.price}</p>
      <button class="main-btn add-btn" data-id="${album.id}">Add to Cart</button>
      <p class="genre-label">${album.genre}</p>
    </div>
  `).join('')
  albumsContainer.innerHTML = cards
  addBtnListeners()
}
```

**Example — Login handling (login.js):**
```javascript
signinForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const username = document.getElementById('signin-username').value.trim()
  const password = document.getElementById('signin-password').value.trim()
  const submitBtn = signinForm.querySelector('button')
  submitBtn.disabled = true
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    })
    if (res.ok) {
      window.location.href = '/'
    } else {
      errorMessage.textContent = 'Login failed. Please try again.'
    }
  } catch (err) {
    errorMessage.textContent = 'Unable to connect. Please try again.'
  } finally {
    submitBtn.disabled = false
  }
})
```

**Example — App init (index.js):**
```javascript
import { logout } from './logout.js'
import { checkAuth, renderGreeting, showHideMenuItems } from './authUI.js'
import { getProducts } from './productService.js'
import { renderProducts } from './productUI.js'
import { updateCartIcon } from './cartService.js'

document.getElementById('logout-btn').addEventListener('click', logout)

async function init() {
  const products = await getProducts()
  const name = await checkAuth()
  renderGreeting(name)
  renderProducts(products)
  showHideMenuItems(name)
  if (name) await updateCartIcon()
}

init()
```

---

## Step 1 — Project Restructure

The project was split into separate `backend/` and `frontend/` folders. The React app was bootstrapped with Vite inside `frontend/frontend-sprial-sound/`.

```
s03ir7pim0/
├── backend/            # Express + SQLite server (unchanged)
└── frontend/
    ├── frontend-sprial-sound/   # React app (new)
    └── (old HTML files kept for reference)
```

---

## Step 2 — Each HTML file becomes a Page component

The first insight: each `.html` file maps to a React **page component**. Pages live in `src/pages/` and are equivalent to the old HTML files.

| Old HTML file | New React page |
|---|---|
| `index.html` | `pages/Home/index.jsx` |
| `login.html` | `pages/Login/index.jsx` |
| `signup.html` | `pages/Signup/index.jsx` |
| `cart.html` | `pages/Cart/index.jsx` |
| _(no equivalent)_ | `pages/PageNotFound/index.jsx` |

React Router replaces the browser's page navigation. Instead of `window.location.href = '/login.html'`, you use `navigate('/login')`. Instead of `<a href="/cart.html">`, you use `<Link to="/cart">`. This keeps the app in memory and avoids full page reloads.

**App.jsx — routes map to pages:**
```jsx
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
```

---

## Step 3 — Identify shared UI across pages → shared components

Looking at the old HTML files, the same banner, header, and footer appeared on every page. These are extracted into `components/shared/`:

```
components/
├── Layout.jsx              # Wraps all pages: Banner + Header + Outlet + Footer
└── shared/
    ├── banner/index.jsx    # Top bar with menu toggle
    ├── header/index.jsx    # Logo and site title
    └── footer/index.jsx    # Footer
```

`Layout.jsx` uses React Router's `<Outlet />` which renders the current page's component — equivalent to the shared `<header>` and `<footer>` HTML that appeared on every page.

---

## Step 4 — Break Banner into smaller components

The Banner contained multiple responsibilities:
- A hamburger button to toggle the nav menu
- A nav menu with login/logout/signup links
- A cart icon link

Each became its own component:

```
banner/
├── index.jsx           # Owns isOpen state, renders CartIcon + button + Navigation
├── navigation/
│   └── index.jsx       # Nav links — shows Login/Signup or Logout depending on auth
└── cartIcon/
    └── index.jsx       # Cart icon with count — only renders when logged in
```

**Key decision:** The hamburger button and the nav it controls live in the same `Banner` component. `isOpen` state is lifted to `Banner` and passed down as a prop to `Navigation`:

```jsx
// Banner
const [isOpen, setIsOpen] = useState(false);
<Navigation isOpen={isOpen} />

// Navigation
<nav className={`header-menu ${isOpen ? 'open' : ''}`}>
```

This replaces the old `menu.js` which used `classList.toggle('open')` directly on the DOM element.

---

## Step 5 — Refactor event handlers into React functions

### Login form (`login.js` → `Login/index.jsx`)

The old code used `addEventListener('submit')` and read values with `document.getElementById`. In React, the form uses the `action` prop (React 19 FormData API) and `useRef` to disable the button:

```jsx
const ref = useRef();
const [error, setError] = useState('');

const handleSubmit = async (formData) => {
  ref.current.disabled = true;
  try {
    const res = await login(formData.get('username'), formData.get('password'));
    if (res.ok) navigate('/');
    else setError('Login failed. Please try again.');
  } catch (err) {
    setError('Unable to connect. Please try again.');
  } finally {
    ref.current.disabled = false;
  }
};

<form action={handleSubmit}>
  <button ref={ref}>Log In</button>
</form>
```

### Add to Cart button (`cartService.js` → `ProductList/index.jsx`)

The old code used `data-id` attributes and event delegation. React keeps the same `data-id` pattern but attaches `onClick` directly to each button:

```jsx
const handleAddToCart = async (event) => {
  const albumId = event.currentTarget.dataset.id;
  const res = await fetch('/api/cart/add', { ... });
  if (!res.ok) return navigate('/login');
  await refresh(); // updates cart count in Banner
};

<button data-id={album.id} onClick={handleAddToCart}>Add to Cart</button>
```

### Product list (`productUI.js` + `productService.js` → `ProductList/index.jsx`)

The old approach rendered HTML strings into `innerHTML`. React replaces this with JSX and `.map()`. URL query params (for genre filtering) are handled with `useSearchParams` — when params change, `useEffect` re-fetches:

```jsx
const [products, setProducts] = useState([]);
const [queryParams] = useSearchParams();

useEffect(() => {
  const getProducts = async () => {
    const res = await fetch(`/api/products?${queryParams}`);
    const data = await res.json();
    setProducts(data);
  };
  getProducts();
}, [queryParams]); // re-fetch when filters change

return products.map((album) => (
  <div className="product-card" key={album.id}>
    ...
  </div>
));
```

---

## Step 6 — The cart count problem → custom hook

After adding to cart, the cart icon in `Banner` needs to update. In the old app, `updateCartIcon()` was a module-level function that could be called from anywhere. In React, state doesn't cross component boundaries unless you explicitly share it.

The first attempt was a custom hook `useCartCount`:

```javascript
export default function useCartCount() {
  const [cartCount, setCartCount] = useState(0);

  const refresh = async () => {
    const res = await fetch('/api/cart/cart-count', { credentials: 'include' });
    if (!res.ok) return;
    const data = await res.json();
    setCartCount(data.totalItems ?? 0);
  };

  useEffect(() => { refresh(); }, []);
  return [cartCount, refresh];
}
```

**The problem:** every component that calls `useCartCount()` gets its own **isolated** state. So `ProductList` calling `refresh()` on its copy wouldn't update `CartIcon`'s copy — they're completely separate.

---

## Step 7 — Context solves the shared state problem

The fix: lift `cartCount` and `refresh` into a **Context provider** so all components read from the same source.

```jsx
// context/cartContext.jsx
const CartContext = createContext();

export default function CartContextProvider({ children }) {
  const [cartCount, refresh] = useCartCount(0);
  return (
    <CartContext.Provider value={{ cartCount, refresh }}>
      {children}
    </CartContext.Provider>
  );
}
```

Now both `CartIcon` and `ProductList` read from the same context:

```jsx
// CartIcon — reads cartCount
const { cartCount } = useContext(CartContext);

// ProductList — calls refresh after adding to cart
const { refresh } = useContext(CartContext);
await refresh(); // this now updates CartIcon too
```

The custom hook still exists but its state is owned by the context provider — components consume it via `useContext`, not by calling the hook directly.

---

## Step 8 — Auth state → AuthContext

The same shared-state problem applied to auth. Multiple components need to know if the user is logged in:
- `Navigation` — shows Login/Signup or Logout
- `CartIcon` — only renders when logged in

The old app used `authUI.js` which called `checkAuth()` and manipulated the DOM directly (`showHideMenuItems`). In React, auth state lives in `AuthContext`:

```jsx
// context/authContext.jsx
export default function AuthContextProvider({ children }) {
  const [isLoggedin, checkAuth, login, logout] = useAuth();
  return (
    <AuthContext.Provider value={{ isLoggedin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

`CartIcon` conditionally renders based on auth:
```jsx
const { isLoggedin } = useContext(AuthContext);
if (!isLoggedin) return null;
```

`Navigation` reads auth state to show the right links:
```jsx
const { isLoggedin, logout } = useContext(AuthContext);
{isLoggedin ? <button onClick={handleLogout}>Log out</button> : <Link to="/login">Log in</Link>}
```

---

## Step 9 — Move login/logout out of Login component into useAuth hook

Initially the `Login` component owned its own `fetch('/api/auth/login')` call. The problem: after a successful login, the `Navigation` and `CartIcon` components wouldn't know the user was now logged in — they'd still show the logged-out state until a page refresh.

The solution: move login/logout logic into `useAuth`, which owns the `user` state that feeds `AuthContext`. When `login()` succeeds, it calls `checkAuth()` to fetch the user name and updates state — which propagates to every component consuming `AuthContext`.

```javascript
// useAuth.js
async function login(username, password) {
  const res = await fetch('/api/auth/login', { ... });
  if (res.ok) {
    await checkAuth(); // fetches name from /api/auth/me, updates user state
    navigate('/');
  }
  return res;
}

async function logout() {
  const res = await fetch('/api/auth/logout', { method: 'POST', ... });
  if (res.ok) setUser(null); // clears user state → all consumers update
}
```

The `Login` component now just calls the context function and handles UI concerns:
```jsx
const { login } = useContext(AuthContext);

const handleSubmit = async (formData) => {
  const res = await login(username, password);
  if (!res.ok) setError('Login failed.');
  // navigation is handled inside login() in the hook
};
```

**Rule of thumb that emerged:** the hook/context owns data and API calls; the component owns UI state (error messages, disabled buttons, loading indicators).

---

## Step 9b — Refine: separate state from actions

After the initial migration, `useAuth` was doing two things at once: managing state (`useState`, `useEffect`) and defining actions (`login`, `logout`). This works but mixes concerns — hooks are for encapsulating state logic, not for owning API actions.

The cleaner separation:

- **`useAuth`** — only manages state. Runs `checkAuth` on mount, returns `{ user, setUser }`. Nothing else.
- **`AuthContext`** — owns the actions. Uses `setUser` from the hook to update state when login or logout completes.

```javascript
// useAuth.js — state only
export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) return setUser(null);
      const data = await res.json();
      setUser(data.isLoggedIn ? data.name : null);
    }
    checkAuth();
  }, []);

  return { user, setUser };
}
```

```jsx
// authContext.jsx — actions live here
export default function AuthContextProvider({ children }) {
  const { user, setUser } = useAuth();

  async function login(username, password) {
    const res = await fetch('/api/auth/login', { ... });
    if (res.ok) {
      const data = await res.json();
      setUser(data.name);
      navigate('/');
    }
    return res;
  }

  async function logout() {
    const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    if (res.ok) setUser(null);
  }

  return (
    <AuthContext.Provider value={{ isLoggedin: user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

Each piece now has one job. This is closer to how auth is structured in larger apps — or how auth libraries like NextAuth/Clerk expose a clean context surface while hiding the state management internally.

---

## Step 10 — Wrap contexts in Layout

Both contexts need to wrap all pages since `Banner` (inside `Layout`) and page components (inside `<Outlet />`) both need access. The providers are placed in `Layout.jsx`:

```jsx
export default function Layout() {
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <Banner />
        <Header />
        <main><Outlet /></main>
        <Footer />
      </CartContextProvider>
    </AuthContextProvider>
  );
}
```

`AuthContextProvider` wraps `CartContextProvider` because the cart is only relevant to logged-in users.

---

## Static assets

In the old app, images were served from `public/images/`. In the new setup:

- **Product images** (album covers, cart icon) → `backend/static/images/` served by Express at `/images/*`
- **UI assets** (logo, menu icon) → `frontend/src/assets/` bundled by Vite via import

Vite is configured to proxy both `/api` and `/images` requests to the backend:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:8000',
    '/images': 'http://localhost:8000',
  },
},
```

This means all fetch calls use relative paths (`/api/...`, `/images/...`) regardless of which port the dev server runs on.

---

## Summary: Key differences between old and new

| Concern | Vanilla JS | React |
|---|---|---|
| Rendering | `innerHTML` string templates | JSX + `.map()` |
| State | DOM as source of truth | `useState` / Context |
| Events | `addEventListener` | `onClick`, `action` props |
| Navigation | `window.location.href` | `useNavigate` / `<Link>` |
| Shared state | Module-level variables | Context API |
| Auth check | Called in each page's `init()` | `useEffect` in `useAuth` on mount |
| Cart update | `updateCartIcon()` called anywhere | `refresh()` from `CartContext` |
| Page structure | Repeated HTML in every `.html` file | `Layout.jsx` with `<Outlet />` |
