// Import Mailtrap client and dotenv for environment variables
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Mailtrap client with API token from environment
export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

// Define sender information for outgoing emails
export const sender = {
  email: "hello@demomailtrap.co",  // Sender's email address
  name: "Mailtrap Test",           // Sender's display name
};
