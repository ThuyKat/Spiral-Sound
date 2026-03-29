# Stripe Integration — Step by Step

## Payment Flow

```
User clicks Checkout
    ↓
POST /api/checkout/create-checkout-session
    ↓
Backend reads cart from DB using session userId
Creates a Stripe checkout session with cart items
    ↓
Stripe returns a { url }
Frontend redirects user to that url → Stripe's hosted payment page
    ↓
User pays on Stripe's page
    ↓
Stripe does TWO things simultaneously and independently:

1. Redirects user to /success.html          2. Fires webhook to /api/checkout/webhook
   (happens immediately)                       (happens in the background)
         ↓                                               ↓
   User sees thank you page                  webhookHandler runs
   (no connection to webhook result)         updates DB, fulfils order
```

> **Important:** `success.html` is shown immediately after payment regardless of the webhook.
> Never rely on the redirect to confirm an order — always use the webhook as the source of truth.

---

### 1. Install Stripe and dotenv

```bash
npm install stripe dotenv
```

### 2. Create a success page

Create `public/success.html` — Stripe redirects here after a successful payment. This is a simple thank you page with a link back to the shop.

### 3. Set up environment variables

Create a `.env` file in the project root:

```
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
CLIENT_URL=http://localhost:8000
```

Get your keys from **Stripe Dashboard → Developers → API keys**.

In `server.js`, load `.env` at the very top before any other imports:

```js
import 'dotenv/config';
```

### 4. Initialise Stripe in the controller

In `controllers/payController.js`, import and initialise Stripe with your secret key:

```js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
```

### 5. Create a checkout session on the backend

In `controllers/payController.js`, the `createCheckoutSession` function reads the user's cart directly from the database using their session — **no cart data is sent from the frontend**, keeping prices trustworthy:

```js
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: cartItems.map(item => ({
    price_data: {
      currency: 'aud',
      product_data: { name: item.title },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  })),
  mode: 'payment',
  metadata: { userId: String(userId), tier: 'premium' },
  success_url: `${process.env.CLIENT_URL}/success.html`,
  cancel_url: `${process.env.CLIENT_URL}/cart.html`,
});

res.json({ url: session.url });
```

### 6. Redirect from the frontend

In `public/js/cart.js`, the checkout button click handler calls the backend and redirects to Stripe's hosted page:

```js
const res = await fetch('/api/checkout/create-checkout-session', {
  method: 'POST',
  credentials: 'include'
})
const { url } = await res.json()
window.location.href = url
```

### 7. Handle the webhook

In `server.js`, the raw body middleware must be registered **before** `express.json()`, otherwise Stripe's signature verification will fail:

```js
app.use('/api/checkout/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
```

In `controllers/payController.js`, the `webhookHandler` function verifies the event and handles it:

```js
event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

if (event.type === 'checkout.session.completed') {
  const { userId, tier } = event.data.object.metadata;
  // update database here
}
```

### 8. Test webhooks locally with Stripe CLI

```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:8000/api/checkout/webhook
```

The CLI prints your `whsec_...` secret — copy it into `.env` as `STRIPE_WEBHOOK_SECRET`.

### 9. Test a payment

Use Stripe's test cards (any future expiry date, any 3-digit CVC):

| Scenario | Card Number |
|---|---|
| Payment succeeds | `4242 4242 4242 4242` |
| Payment declined | `4000 0000 0000 0002` |
| Requires 3D Secure authentication | `4000 0025 0000 3155` |
