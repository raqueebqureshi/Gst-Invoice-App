import SMTPConfig from "../Models/SMTPConfig.js";
import bcrypt from "bcrypt";

// Save SMTP configuration
export const saveSMTPConfig = async (req, res) => {
  
  try {
    const { shopId, ...smtpData } = req.body;

    // Ensure shopId is provided
    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required." });
    }

    // Check if configuration for the shop already exists
    const existingConfig = await SMTPConfig.findOne({ shopId });
    if (existingConfig) {
      return res.status(400).json({ error: "SMTP configuration already exists for this shop." });
    }

    // Save new SMTP configuration
    const smtpConfig = new SMTPConfig({ shopId, ...smtpData });
    await smtpConfig.save();

    res.status(201).json({ message: "SMTP Configuration saved successfully." });
  } catch (error) {
    console.error("Error saving SMTP configuration:", error);
    res.status(500).json({ error: "An error occurred while saving the SMTP configuration." });
  }
};

// Get SMTP configuration
export const getSMTPConfig = async (req, res) => {
  try {
    const { shopId } = req.query;

    // Ensure shopId is provided
    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required." });
    }

    // Fetch configuration for the shop
    const smtpConfig = await SMTPConfig.findOne({ shopId });
    if (!smtpConfig) {
      return res.status(404).json({ error: "SMTP configuration not found for the given shop ID." });
    }

    res.status(200).json({
      host: smtpConfig.host,
      port: smtpConfig.port,
      username: smtpConfig.username,
      fromEmail: smtpConfig.fromEmail,
      fromName: smtpConfig.fromName,
      sendByOwnEmail: smtpConfig.sendByOwnEmail,
      sendByAppEmail: smtpConfig.sendByAppEmail,
      emailFormat: smtpConfig.emailFormat,
      password: "********", // Mask the password for security
    });
  } catch (error) {
    console.error("Error fetching SMTP configuration:", error);
    res.status(500).json({ error: "An error occurred while fetching the SMTP configuration." });
  }
};

// Update SMTP configuration
export const updateSMTPConfig = async (req, res) => {
  try {
    const { shopId, updatedSettings } = req.body;

    // Ensure shopId and updated settings are provided
    if (!shopId || !updatedSettings) {
      return res.status(400).json({ error: "Shop ID and updated settings are required." });
    }

    // Find and update the configuration
    const smtpConfig = await SMTPConfig.findOneAndUpdate(
      { shopId },
      { $set: updatedSettings },
      { new: true } // Return the updated document
    );

    if (!smtpConfig) {
      return res.status(404).json({ error: "SMTP configuration not found for the given shop ID." });
    }

    res.status(200).json({
      message: "SMTP Configuration updated successfully.",
      updatedConfig: smtpConfig,
    });
  } catch (error) {
    console.error("Error updating SMTP configuration:", error);
    res.status(500).json({ error: "An error occurred while updating the SMTP configuration." });
  }
};

// Verify and decrypt password (example endpoint)
export const verifyPassword = async (req, res) => {
  try {
    const { shopId, password } = req.body;

    // Ensure shopId and password are provided
    if (!shopId || !password) {
      return res.status(400).json({ error: "Shop ID and password are required." });
    }

    // Fetch configuration
    const smtpConfig = await SMTPConfig.findOne({ shopId });
    if (!smtpConfig) {
      return res.status(404).json({ message: "SMTP configuration not found." });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, smtpConfig.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    res.status(200).json({ message: "Password is correct." });
  } catch (error) {
    console.error("Error verifying password:", error);
    res.status(500).json({ error: "An error occurred while verifying the password." });
  }
};
