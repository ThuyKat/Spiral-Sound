import express from 'express';
import {
  createCheckoutSession,
  createPaymentIntent,
  webhookHandler,
} from '../controllers/payController.js';

export const paymentRouter = express.Router();

// ── Create a Payment Intent (for custom checkout UI) ──────────────────────
paymentRouter.post('/create-payment-intent', createPaymentIntent);

// ── Stripe Hosted Checkout Session ───────────────────────────────────────
paymentRouter.post('/create-checkout-session', createCheckoutSession);

// ── Webhook Handler ───────────────────────────────────────────────────────
paymentRouter.post('/webhook', webhookHandler);
