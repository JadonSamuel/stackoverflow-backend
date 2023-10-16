// routes/checkout.js
import express from "express";
import { Router } from "express";
import Stripe from "stripe"; // Import the Stripe library

const router = Router();
const stripe = process.env.STRIPE_PRIVATE_KEY;

const storeItems = new Map([
  [1, { priceInRupees: 0, name: "Free Plan" }],
  [2, { priceInRupees: 100, name: "Silver Plan" }],
  [3, { priceInRupees: 1000, name: "Gold Plan" }],
]);

// Create the checkout session route
router.post("/create-checkout-session", async (req, res) => {
  console.log("Reached /create-checkout-session route");
  try {
    const session = await stripe.checkout.sessions.create({
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
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
