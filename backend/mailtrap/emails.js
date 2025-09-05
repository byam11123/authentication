// Import email templates and Mailtrap configuration
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

/**
 * Sends email verification message to user
 * @param {string} email - Recipient's email address
 * @param {string} verificationToken - 6-digit verification code
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    // Send verification email with token inserted into template
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken,
      ),
      category: "Email Verification",
    });

    console.log("Verification email sent successfully", response);
  } catch (error) {
    console.log("Error while sending verification email", error);
    throw new Error(`Error while sending verification email: ${error}`);
  }
};

/**
 * Sends welcome email to user after successful verification
 * @param {string} email - Recipient's email address
 * @param {string} name - Recipient's name
 * @returns {Promise<void>}
 */
export const sendWelcomeEmail = async (email, name) => {
  const recipients = [{ email }];

  try {
    // Send welcome email using Mailtrap template
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      template_uuid: "e3127173-4479-42ba-9cb2-c933dca2b37a",
      template_variables: {
        company_info_name: "Authentic Company",
        name: name,
      },
    });
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.log(`Error while sending welcome email : ${error}`);
  }
};

/**
 * Sends password reset email with reset link
 * @param {string} email - Recipient's email address
 * @param {string} resetURL - Full URL for password reset
 * @returns {Promise<void>}
 */
export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    // Send password reset email with custom reset URL
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });

    console.log("Password reset email sent successfully", response);
  } catch (error) {
    console.log("Error while sending password reset email", error);
    throw new Error(`Error while sending password reset email: ${error}`);
  }
};

/**
 * Sends confirmation email after successful password reset
 * @param {string} email - Recipient's email address
 * @returns {Promise<void>}
 */
export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    // Send password reset confirmation email
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });
    console.log("Password reset success email sent successfully", response);
  } catch (error) {
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};
