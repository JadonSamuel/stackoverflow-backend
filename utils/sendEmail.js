import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI; // Replace with your redirect URI

// Create an OAuth2 client
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Generate a URL for user consent
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline", // Request a refresh token
  scope: ["https://www.googleapis.com/auth/gmail.send"], // Scopes for Gmail API
});

// Redirect the user to `authUrl` for consent

// Handle the callback after user grants consent and returns to your redirect URI
async function handleCallback(code) {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  // Now, `oAuth2Client` can be used to send emails using the Gmail API
}

// This function sends an email using the Gmail API
async function sendEmail(mailOptions) {
  try {
    // Ensure that you have obtained and set the access token using oAuth2Client
    // You can use oAuth2Client to make requests to the Gmail API here
    // Example:
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    await gmail.users.messages.send({ userId: "me", resource: message });

    return;
  } catch (error) {
    throw error;
  }
}

export default sendEmail;

