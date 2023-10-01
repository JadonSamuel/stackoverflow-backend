import crypto from "crypto";

// Generate a random 256-bit (32-byte) secret key
const secretKey = crypto.randomBytes(32);

console.log("Generated Secret Key:", secretKey.toString("hex"));
