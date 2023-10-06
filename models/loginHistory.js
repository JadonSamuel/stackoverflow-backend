// models/loginHistory.js
import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  userAgent: String,
  browser: String,
  os: String,
  timestamp: { type: Date, default: Date.now },
});

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);

export default LoginHistory;
