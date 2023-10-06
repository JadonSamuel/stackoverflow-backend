import express from "express";
import { Router } from "express";
import LoginHistory from "../models/loginhistory";

const router = Router();

router.post("/login-history", async (req, res) => {
  try {
    // Create a new login history entry and save it to the database
    const loginHistory = new LoginHistory({
      // Extract data from the request body or headers
      userAgent: req.body.userAgent,
      browser: req.body.browser,
      os: req.body.os,
    });
    await loginHistory.save();

    res.status(200).json({ message: "Login history recorded." });
  } catch (error) {
    console.error("Error recording login history:", error);
    res.status(500).json({ error: "Failed to record login history." });
  }
});

export default router;
