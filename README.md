# Spiral Sounds

An online vinyl record store built with vanilla JavaScript on the frontend and Express.js on the backend, with Stripe hosted checkout for payment processing.

---

## What This Project Is About

Spiral Sounds lets users browse a catalogue of vinyl records, add them to a cart, and check out securely via Stripe. It includes user authentication, session management, and a webhook handler to fulfil orders after payment.

---

## Project Structure

```
spiral-sounds/
├── controllers/          # Route handler logic
│   ├── authController.js
│   ├── cartController.js
│   ├── meController.js
│   ├── payController.js
│   └── productsController.js
├── db/
│   └── db.js             # SQLite connection helper
├── middleware/
│   └── requireAuth.js    # Session auth guard
├── routes/               # Express routers
│   ├── auth.js
│   ├── cart.js
│   ├── me.js
│   ├── payment.js
│   └── products.js
├── public/               # Static frontend files
│   ├── css/
│   ├── images/
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
├── server.js
├── package.json
└── .env                  # Not committed — see Environment Variables
```

---

## Frontend

Built with plain HTML, CSS, and vanilla JavaScript (ES modules). No frameworks.

- `index.html` — product catalogue
- `cart.html` — cart page with checkout button
- `login.html` / `signup.html` — authentication forms
- `success.html` — shown after successful Stripe payment

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

## Environment Variables

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `CLIENT_URL` | Base URL of your app e.g. `http://localhost:8000` |

Never commit `.env` to version control.

---

## Running Locally

```bash
npm install
npm start
```

Server runs at `http://localhost:8000`.
