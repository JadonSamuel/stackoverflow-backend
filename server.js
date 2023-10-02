import express from "express"
import stripe from "stripe";(
  "YOUR_STRIPE_SECRET_KEYsk_test_51NwljDSGiJ8RpF7xGHzy2zurxX83JbwDkiLEr91DhIPuIdlodkD3WqVyOXpLv84jhMqY1P2ZPUYEHaSgsTLMgWDA00fPks3w21"
);

const app = express();
const port = 4000;

const YOUR_DOMAIN = "http://localhost:4000";

app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const lookupKey = req.body.lookup_key;

  try {
    const prices = await stripe.prices.list({
      lookup_keys: [lookupKey],
      expand: ["product"],
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      success_url: `${YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    res.redirect(303, session.url);
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

app.post("/create-portal-session", async (req, res) => {
  const session_id = req.body.session_id;

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer,
      return_url: YOUR_DOMAIN,
    });

    res.redirect(303, portalSession.url);
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});

app.post("/webhook", async (req, res) => {
  const webhookSecret ="https://279b-183-82-178-128.ngrok.io";

  const sigHeader = req.get("Stripe-Signature");
  const payload = req.rawBody;

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sigHeader, webhookSecret);
  } catch (error) {
    res.status(400).send("Webhook Error: " + error.message);
    return;
  }

  const eventType = event.type;
  const dataObject = event.data.object;

  if (eventType === "customer.subscription.deleted") {
    console.log("Subscription canceled:", event.id);
  }

  if (eventType === "customer.subscription.updated") {
    console.log("Subscription updated:", event.id);
  }

  if (eventType === "customer.subscription.created") {
    console.log("Subscription created:", event.id);
  }

  if (eventType === "customer.subscription.trial_will_end") {
    console.log("Subscription trial will end:", event.id);
  }

  res.json({ status: "success" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
