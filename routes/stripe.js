import stripe from "stripe";
import express from "express";
const app = express();
app.use(express.static("public"));

const YOUR_DOMAIN = "http://localhost:5000";
const PORT = 5000;

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Replace with the actual Price ID from your Stripe Dashboard
        price: "price_1234567890",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_8a2bf96df965b6366af4e5f34f6658efc0d033cbedd2c3394ee76cca8ad39ef5";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);
