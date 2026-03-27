import Stripe from 'stripe';
import { getDBConnection } from '../db/db.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createCheckoutSession = async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: 'Not logged in' });

  try {
    const db = await getDBConnection();
    const cartItems = await db.all(
      `SELECT ci.quantity, p.title, p.price
       FROM cart_items ci JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = ?`,
      [userId]
    );

    if (!cartItems.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: 'aud',
          product_data: { name: item.title },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      metadata: { userId: String(userId), tier: 'premium' },
      success_url: `${process.env.CLIENT_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart.html`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body required
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const intent = event.data.object;
      console.log('Payment succeeded:', intent.id);
      // TODO: fulfill order, update DB, send confirmation email
      break;
    }
    case 'payment_intent.payment_failed': {
      const intent = event.data.object;
      console.log('Payment failed:', intent.last_payment_error?.message);
      break;
    }
    case 'checkout.session.completed': {
      const session = event.data.object;
      const { userId, tier } = session.metadata;
      // const db = await getDBConnection();
      // await db.run('UPDATE users SET tier = ? WHERE id = ?', [tier, userId]);
      console.log(`User ${userId} upgraded to ${tier}`);
      break;
    }
  }

  res.json({ received: true });
};

// THIS IS ONLY FOR CUSTOM PAYMENT FORM

// export const createPaymentIntent = async (req, res) => {
//   const { amount, currency = 'aud', metadata = {} } = req.body;

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(amount * 100), // Stripe uses cents
//       currency,
//       metadata, // e.g. { orderId: '123', userId: '456' }
//       automatic_payment_methods: { enabled: true },
//     });

//     res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
