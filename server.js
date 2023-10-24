import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./connectMongoDb.js";
import Stripe from "stripe";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import chatbotRoutes from "./routes/chatbot.js";
import otpRoutes from "./routes/otp.js";
import checkoutRoutes from "./routes/checkout.js";
import stripe from "stripe";
dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.use("/checkout", checkoutRoutes);

// Specific routes go here
app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/otp", otpRoutes);

// Catch-all route at the end
app.use("/", (req, res) => {
  res.send("This is a stack overflow clone API");
});

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
