import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      line_items: [
        {
          price: "PRICE_ID_£19_SUBSCRIPTION",
          quantity: 1,
        },
      ],

      subscription_data: {
        trial_period_days: 7,
      },

      success_url: "https://tryairlo.com/#done",
      cancel_url: "https://tryairlo.com",
    });

    // Add £1 trial fee
    await stripe.invoiceItems.create({
      customer: session.customer,
      amount: 100, // £1 in pence
      currency: "gbp",
      description: "Airlo trial access",
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
