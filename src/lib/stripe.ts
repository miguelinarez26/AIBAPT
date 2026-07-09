import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY is missing. Please add it to your environment variables in Vercel or .env.local');
}

// Inicializar la instancia de Stripe
export const stripe = new Stripe(stripeKey, {
  apiVersion: '2026-06-24.dahlia', // Usa la API version más reciente
  typescript: true,
});
