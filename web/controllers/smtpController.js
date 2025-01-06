// controllers/smtpController.js
import SMTPConfig from '../Models/SMTPConfig.js';
import bcrypt from 'bcrypt';

// Save SMTP configuration
export const saveSMTPConfig = async (req, res) => {
  try {
    const smtpConfig = new SMTPConfig(req.body);
    await smtpConfig.save();
    res.status(201).json({ message: 'SMTP Configuration saved successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get SMTP configuration
export const getSMTPConfig = async (req, res) => {
  try {
    const { username, password } = req.query;

    const smtpConfig = await SMTPConfig.findOne({ username });
    if (!smtpConfig) {
      return res.status(404).json({ error: 'SMTP configuration not found for the given username.' });
    }

    if (password) {
      const isMatch = await smtpConfig.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
    }

    // Decrypt password for frontend display (not best practice, ensure secure channels)
    const decryptedPassword = password && smtpConfig.password ? password : '********';

    res.status(200).json({
      host: smtpConfig.host,
      port: smtpConfig.port,
      username: smtpConfig.username,
      fromEmail: smtpConfig.fromEmail,
      fromName: smtpConfig.fromName,
      enabled: smtpConfig.enabled,
      password: decryptedPassword, // Show placeholder or decrypted password
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update SMTP configuration
export const updateSMTPConfig = async (req, res) => {
  try {
    const { email, storeDomain, updatedSettings } = req.body;

    // Validate inputs
    if (!email || !storeDomain || !updatedSettings) {
      return res.status(400).json({ error: "Email, storeDomain, and updatedSettings are required" });
    }

    // Find and update the SMTP configuration for the given email and store domain
    const smtpConfig = await SMTPConfig.findOneAndUpdate(
      { fromEmail: email, host: storeDomain },
      { $set: updatedSettings },
      { new: true } // Return the updated document
    );

    if (!smtpConfig) {
      return res.status(404).json({ error: "SMTP configuration not found for the given email and store domain" });
    }

    // Respond with the updated configuration data
    res.status(200).json(smtpConfig);
  } catch (error) {
    console.error("Error updating SMTP configuration:", error);
    res.status(500).json({ error: "An error occurred while updating the SMTP configuration" });
  }
};

// Verify and decrypt password (example endpoint)
export const verifyPassword = async (req, res) => {
  try {
    const { username, password } = req.body;
    const smtpConfig = await SMTPConfig.findOne({ username });
    if (smtpConfig && await smtpConfig.matchPassword(password)) {
      res.status(200).json({ message: 'Password is correct.' });
    } else {
      res.status(401).json({ message: 'Invalid username or password.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
