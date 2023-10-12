import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import connectDB from "./connectMongoDb.js";
import mongoose from "mongoose";
import stripe from "stripe";
import chatbotRoutes from "./routes/chatbot.js";
import otpRoutes from "./routes/otp.js"

import i18n from "i18n"; // Import i18n for internationalization support

dotenv.config();
connectDB();

const app = express();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Initialize Stripe with your secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeInstance = stripe(stripeSecretKey);

// Define your MongoDB schema and model for subscriptions here
const subscriptionSchema = new mongoose.Schema({
  plan: String,
  paymentMethodId: String,
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

const loginHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ipAddress: String,
  browser: String,
  os: String,
  timestamp: { type: Date, default: Date.now },
});

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);



// Define the Stripe payment route
app.post("/subscribe", async (req, res) => {
  const { plan, paymentMethodId } = req.body;

  try {
    // Create a customer and subscribe them to the chosen plan using Stripe
    const customer = await stripeInstance.customers.create({
      payment_method: paymentMethodId,
      email: "jadonlsamuel51@gmail.com", // Replace with the user's email
    });

    const subscription = await stripeInstance.subscriptions.create({
      customer: customer.id,
      items: [{ plan: `process.env.PLAN_ID${plan.toUpperCase()}` }],
    });

    // Save the subscription data in MongoDB
    const newSubscription = new Subscription({ plan, paymentMethodId });
    await newSubscription.save();

    res.json({ message: "Subscription successful!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Subscription failed." });
  }
});



app.use("/", (req, res) => {
  res.send("This is a stack overflow clone API");
});

app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/otp", otpRoutes);

const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.CONNECTION_URL;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })
  )
  .catch((err) => console.log(err.message));
