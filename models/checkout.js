import mongoose from "mongoose";

const checkoutSchema = mongoose.Schema({
  // Define the fields you want to store for checkout sessions
  sessionId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalPrice: { type: Number, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Checkout = mongoose.model("Checkout", checkoutSchema);

export default Checkout;
