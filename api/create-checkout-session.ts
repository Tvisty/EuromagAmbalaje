import Stripe from 'stripe';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { items, orderId, customerEmail } = req.body;
    
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is missing. Check Vercel Environment Variables.');
    }
    
    const stripe = new Stripe(key, { apiVersion: '2023-10-16' as any });
    const origin = process.env.APP_URL || req.headers.origin || `https://${req.headers.host}`;

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'ron',
        product_data: {
          name: item.productTitle,
          description: Object.entries(item.selectedOptions || {}).map(([k, v]) => `${k}: ${v}`).join(', ') || undefined,
        },
        unit_amount: Math.round((item.totalPrice / item.quantity) * 100),
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

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Vercel error:', error.message);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
