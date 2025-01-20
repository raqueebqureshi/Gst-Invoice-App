import nodemailer from "nodemailer";
import SMTPConfig from "../Models/SMTPConfig.js"; // Assuming your model is here

// API to send test email using customer's SMTP settings
export const sendTestEmailFromCustomerSMTP = async (req, res) => {
  try {
    const { shopId, recipientEmail } = req.body;

    if (!shopId || !recipientEmail) {
      return res.status(400).json({ error: "Shop ID and recipient email are required." });
    }

    // Fetch SMTP configuration for the shop
    const shopSMTPConfig = await SMTPConfig.findOne({ shopId });
    if (!shopSMTPConfig || !shopSMTPConfig.smtpData.sendByOwnEmail) {
      return res.status(400).json({ error: "SMTP configuration not found or own email is not enabled." });
    }

    const smtpConfig = {
      host: shopSMTPConfig.smtpData.host,
      port: shopSMTPConfig.smtpData.port,
      secure: false, // Use `true` if a secure connection is required
      auth: {
        user: shopSMTPConfig.smtpData.username,
        pass: shopSMTPConfig.smtpData.password,
      },
    };

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport(smtpConfig);

    // Send test email
    await transporter.sendMail({
      from: `"${shopSMTPConfig.smtpData.fromName}" <${shopSMTPConfig.smtpData.fromEmail}>`,
      to: recipientEmail,
      subject: "Test Email from Customer's SMTP Settings",
      text: `This is a test email sent from the customer's own SMTP settings for shop ID: ${shopId}.`,
    });

    res.status(200).json({ message: "Test email sent successfully using customer's SMTP settings." });
  } catch (error) {
    console.error("Error sending test email from customer's SMTP settings:", error);
    res.status(500).json({ error: "Failed to send test email from customer's SMTP settings." });
  }
};

// API to send test email using app's default settings
export const sendTestEmailFromAppSMTP = async (req, res) => {
  try {
    const { recipientEmail } = req.body;

    if (!recipientEmail) {
      return res.status(400).json({ error: "Recipient email is required." });
    }

    const smtpConfig = {
      host: process.env.SUPPORT_EMAIL_HOST,
      port: process.env.SUPPORT_EMAIL_PORT,
      secure: false, // Use `true` if a secure connection is required
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_PASSWORD,
      },
    };

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport(smtpConfig);

    // Send test email
    await transporter.sendMail({
      from: `"App Support" <${smtpConfig.auth.user}>`,
      to: recipientEmail,
      subject: "Test Email from App's Default Settings",
      text: "This is a test email sent from the app's default SMTP settings.",
    });

    res.status(200).json({ message: "Test email sent successfully using app's default SMTP settings." });
  } catch (error) {
    console.error("Error sending test email from app's default SMTP settings:", error);
    res.status(500).json({ error: "Failed to send test email from app's default SMTP settings." });
  }
};
