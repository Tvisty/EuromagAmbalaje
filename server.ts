import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripeClient = new Stripe(key, { apiVersion: '2023-10-16' });
  }
  return stripeClient;
}

async function startServer() {
  const app = express();
  
  app.use(express.json());

  // Stripe Checkout Endpoint
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { items, orderId, customerEmail } = req.body;
      const stripe = getStripe();
      const origin = process.env.APP_URL || req.headers.origin || `http://localhost:${PORT}`;

      const lineItems = items.map((item: any) => ({
        price_data: {
          currency: 'ron',
          product_data: {
            name: item.productTitle,
            description: Object.entries(item.selectedOptions || {}).map(([k, v]) => `${k}: ${v}`).join(', ') || undefined,
          },
          unit_amount: Math.round((item.totalPrice / item.quantity) * 100), // Stripe expects amounts in bani (cents)
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        customer_email: customerEmail,
        success_url: `${origin}/?payment=success&orderId=${orderId}`,
        cancel_url: `${origin}/?payment=cancel&orderId=${orderId}`,
        metadata: {
          orderId: orderId
        }
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Stripe error:', error.message);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
