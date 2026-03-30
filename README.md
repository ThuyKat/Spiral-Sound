# Spiral Sounds

An online vinyl record store built with an Express.js backend and two frontend versions: the original vanilla JavaScript implementation and a migrated React version.

---

## What This Project Is About

Spiral Sounds lets users browse a catalogue of vinyl records, add them to a cart, and check out securely via Stripe. It includes user authentication, session management, and a webhook handler to fulfil orders after payment.

The project has two frontend implementations — the original plain HTML/JS version and a React migration — kept together to document the progression.

---

## Project Structure

```
spiral-sounds/
├── backend/
│   ├── controllers/          # Route handler logic
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── meController.js
│   │   ├── payController.js
│   │   └── productsController.js
│   ├── db/
│   │   └── db.js             # SQLite connection helper
│   ├── middleware/
│   │   └── requireAuth.js    # Session auth guard
│   ├── routes/               # Express routers
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── me.js
│   │   ├── payment.js
│   │   └── products.js
│   ├── static/
│   │   └── images/           # Served as /images
│   ├── server.js
│   ├── package.json
│   └── .env                  # Not committed — see Environment Variables
│
├── frontend/                 # Original vanilla JS frontend
│   ├── css/
│   ├── js/
│   │   ├── authUI.js
│   │   ├── cart.js
│   │   ├── cartService.js
│   │   ├── index.js
│   │   ├── login.js
│   │   ├── logout.js
│   │   ├── menu.js
│   │   ├── productService.js
│   │   ├── productUI.js
│   │   └── signup.js
│   ├── index.html
│   ├── cart.html
│   ├── login.html
│   ├── signup.html
│   └── success.html
│
└── frontend/frontend-react/  # Migrated React frontend
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   └── shared/
    │   │       ├── banner/
    │   │       │   ├── cartIcon/
    │   │       │   └── navigation/
    │   │       ├── footer/
    │   │       └── header/
    │   ├── context/
    │   │   ├── authContext.jsx
    │   │   └── cartContext.jsx
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   └── useCartCount.js
    │   ├── pages/
    │   │   ├── Cart/
    │   │   ├── Home/
    │   │   │   ├── genre/
    │   │   │   └── productlist/
    │   │   ├── Login/
    │   │   ├── PageNotFound/
    │   │   └── Signup/
    │   ├── App.jsx
    │   └── main.jsx
    ├── vite.config.js
    └── package.json
```

---

## Frontend — Original (Vanilla JS)

Built with plain HTML, CSS, and vanilla JavaScript (ES modules). No frameworks.

- `index.html` — product catalogue
- `cart.html` — cart page with checkout button
- `login.html` / `signup.html` — authentication forms
- `success.html` — shown after successful Stripe payment

State lived in the DOM. Navigation caused full page reloads. Shared UI (banner, header, footer) was duplicated across every HTML file.

---

## Frontend — React Migration

Built with **React 19**, **React Router v7**, and **Vite**. CSS Modules used for component-level styles.

### Routing

React Router replaces file-based navigation. A `Layout` component wraps all routes via `<Outlet />`, keeping the banner, header, and footer mounted across navigation.

```
Layout
├── Banner
├── Header
├── <Outlet />   ← current page renders here
└── Footer
```

### State management

| Concern | Solution |
|---|---|
| Auth state (current user, login, logout) | `AuthContext` + `useAuth` hook |
| Cart count (shared between banner and product list) | `CartContext` + `useCartCount` hook |
| Mobile menu toggle | Local state lifted to `Banner`, passed to `Navigation` as prop |

`useAuth` manages session state — calls `/api/auth/me` on mount to restore the session from the cookie. `AuthContext` owns the `login()` and `logout()` actions and updates state directly via `setUser`.

`useCartCount` runs inside `CartContextProvider` as a single instance. Both `CartIcon` and `ProductList` consume from the same context, so calling `refresh()` in one component updates the count for both.

### Vite dev proxy

The Vite dev server proxies `/api` and `/images` to `http://localhost:8000`, so the backend runs separately and no CORS configuration is needed during development.

---

## Backend

Built with **Express.js** and **Node.js**.

| Route | Description |
|---|---|
| `POST /api/auth/signup` | Register a new user |
| `POST /api/auth/login` | Login and create session |
| `POST /api/auth/logout` | Destroy session |
| `GET /api/auth/me` | Return current logged-in user |
| `GET /api/products` | Fetch all products |
| `GET /api/cart` | Get current user's cart |
| `POST /api/cart/add` | Add item to cart |
| `DELETE /api/cart/:id` | Remove item from cart |
| `DELETE /api/cart/all` | Clear entire cart |
| `POST /api/checkout/create-checkout-session` | Create Stripe hosted checkout session |
| `POST /api/checkout/webhook` | Handle Stripe webhook events |

Session-based authentication is handled with `express-session`. Protected routes use the `requireAuth` middleware which checks for a `userId` on the session.

---

## Database

**SQLite** via the `sqlite` and `sqlite3` packages.

Tables:
- `users` — stores user accounts (hashed passwords via bcrypt)
- `products` — vinyl record catalogue
- `cart_items` — links users to products with quantity

---

## Functionalities

- Browse vinyl record catalogue
- User signup and login with hashed passwords
- Session-based authentication (protected cart routes)
- Add and remove items from cart
- Cart total calculated server-side
- Stripe hosted checkout — redirect to Stripe's payment page
- Webhook receives `checkout.session.completed` event to fulfil orders
- Success page after payment

---

## Stripe Integration

See [STRIPE.md](STRIPE.md) for the full step-by-step integration guide.

---

## React Migration Write-up

See [ARTICLE.md](ARTICLE.md) for a detailed write-up on what changed and why — covering routing, shared UI, the custom hook trap, Context, and the auth pattern.

---

## Environment Variables

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `CLIENT_URL` | Base URL of your app e.g. `http://localhost:8000` |

Never commit `.env` to version control.

---

## Running Locally

**Backend**

```bash
cd backend
npm install
npm start
```

Server runs at `http://localhost:8000`.

**React frontend**

```bash
cd frontend/frontend-react
npm install
npm run dev
```

Vite dev server runs at `http://localhost:5173` and proxies API calls to the backend.

**Vanilla JS frontend**

Open `frontend/index.html` directly in a browser, or serve it statically from the backend.

---

## Testing the App

A test account is pre-seeded in the database:

| Field | Value |
|---|---|
| Username | `test` |
| Password | `test` |

1. Start the backend and either frontend
2. Go to `/login` and sign in with the credentials above
3. Browse the catalogue and add items to your cart
4. To test Stripe checkout, use card number `4242 4242 4242 4242` with any future expiry and any CVC
