import express from "express";
import stripe from "stripe";
const router = express.Router();

// Initialize the Stripe API with your private key
const stripeClient = new stripe(process.env.STRIPE_PRIVATE_KEY);

const storeItems = new Map([
  [1, { priceInRupees: 0, name: "Free Plan" }],
  [2, { priceInRupees: 100, name: "Silver Plan" }],
  [3, { priceInRupees: 1000, name: "Gold Plan" }],
]);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        const storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInRupees * 100, // Convert rupees to paise,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
