import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import connectDB from "./connectMongoDb.js";
import mongoose from "mongoose";
import stripe from "stripe";

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

// Configure i18n for internationalization
i18n.configure({
  locales: ["en", "fr", "hi"], // Define the supported languages
  directory: "./locales", // Directory where your translation files are stored
  defaultLocales: "en", // Set the default language
  cookie: "lang", // Name of the cookie to store the user's selected language
});

app.use(i18n.init); // Initialize i18n middleware

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

// OTP Authentication Route
app.post("/authenticate", (req, res) => {
  // Implement your OTP authentication logic here
  // Check the OTP provided by the user against the stored OTP
  // If authentication is successful, you can set a flag in the user's session or respond accordingly
  // Return an appropriate response
});

// Chatbot Route
app.post("/chatbot", (req, res) => {
  // Implement your chatbot logic here
  // Retrieve the user's message from req.body.message
  // Process the message and generate a response
  // Return the response as JSON
});

app.use("/", (req, res) => {
  res.send("This is a stack overflow clone API");
});

app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);

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
