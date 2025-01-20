import SMTPConfig from "../Models/SMTPConfig.js";

// Save SMTP configuration
export const saveSMTPConfig = async (req, res) => {
  try {
    const { shopId, ...smtpData } = req.body;
    console.log("req.body", req.body);

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

// Update only boolean for sendByOwnEmail
export const changeSendByOwnEmail = async (req, res) => {
  try {
    const { shopId, sendByOwnEmail } = req.body;
    console.log("req.body", req.body);

    if (!shopId || sendByOwnEmail === undefined) {
      return res.status(400).json({ error: "Shop ID and sendByOwnEmail are required." });
    }

    const updatedConfig = await SMTPConfig.findOneAndUpdate(
      { shopId },
      { "smtpData.sendByOwnEmail": sendByOwnEmail },
      { new: true }
    );

    if (!updatedConfig) {
      return res.status(404).json({ error: "SMTP configuration not found for this shop." });
    }

    res.status(200).json({
      message: "SMTP configuration updated successfully.",
      updatedConfig: {
        shopId: updatedConfig.shopId,
        sendByOwnEmail: updatedConfig.smtpData.sendByOwnEmail,
      },
    });
  } catch (error) {
    console.error("Error updating sendByOwnEmail:", error);
    res.status(500).json({ error: "An error occurred while updating the SMTP configuration." });
  }
};

// Update only boolean for sendByAppEmail
export const changeSendByAppEmail = async (req, res) => {
  try {
    const { shopId, sendByAppEmail } = req.body;

    if (!shopId || sendByAppEmail === undefined) {
      return res.status(400).json({ error: "Shop ID and sendByAppEmail are required." });
    }

    const updatedConfig = await SMTPConfig.findOneAndUpdate(
      { shopId },
      { "smtpData.sendByAppEmail": sendByAppEmail },
      { new: true }
    );

    if (!updatedConfig) {
      return res.status(404).json({ error: "SMTP configuration not found for this shop." });
    }

    res.status(200).json({
      message: "SMTP configuration updated successfully.",
      updatedConfig: {
        shopId: updatedConfig.shopId,
        sendByAppEmail: updatedConfig.smtpData.sendByAppEmail,
      },
    });
  } catch (error) {
    console.error("Error updating sendByAppEmail:", error);
    res.status(500).json({ error: "An error occurred while updating the SMTP configuration." });
  }
};

// Update only boolean for sendOnOrderPlaced
export const changeSendOnOrderPlaced = async (req, res) => {
  try {
    const { shopId, sendOnOrderPlaced } = req.body;

    if (!shopId || sendOnOrderPlaced === undefined) {
      return res.status(400).json({ error: "Shop ID and sendOnOrderPlaced are required." });
    }

    const updatedConfig = await SMTPConfig.findOneAndUpdate(
      { shopId },
      { "smtpData.sendOnOrderPlaced": sendOnOrderPlaced },
      { new: true }
    );

    if (!updatedConfig) {
      return res.status(404).json({ error: "SMTP configuration not found for this shop." });
    }

    res.status(200).json({
      message: "SMTP configuration updated successfully.",
      updatedConfig: {
        shopId: updatedConfig.shopId,
        sendOnOrderPlaced: updatedConfig.smtpData.sendOnOrderPlaced,
      },
    });
  } catch (error) {
    console.error("Error updating sendOnOrderPlaced:", error);
    res.status(500).json({ error: "An error occurred while updating the SMTP configuration." });
  }
};

// Get SMTP configuration
export const getSMTPConfig = async (req, res) => {
  try {
    const { shopId } = req.query;

    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required." });
    }

    const smtpConfig = await SMTPConfig.findOne({ shopId });
    if (!smtpConfig) {
      return res.status(404).json({ error: "SMTP configuration not found." });
    }

    res.status(200).json({ smtpData: smtpConfig.smtpData });
  } catch (error) {
    console.error("Error fetching SMTP configuration:", error);
    res.status(500).json({ error: "An error occurred while fetching the SMTP configuration." });
  }
};

// Check for boolean statuses
export const checkForStatus = async (req, res) => {
  try {
    const { shopId } = req.query;

    if (!shopId) {
      return res.status(400).json({ error: "Shop ID is required." });
    }

    const checkTureFalse = await SMTPConfig.findOne({ shopId });
    if (!checkTureFalse) {
      return res.status(404).json({ error: "SMTP configuration not found for the given shop ID." });
    }

    res.status(200).json({
      sendByOwnEmail: checkTureFalse.smtpData.sendByOwnEmail,
      sendByAppEmail: checkTureFalse.smtpData.sendByAppEmail,
      sendOnOrderPlaced: checkTureFalse.smtpData.sendOnOrderPlaced,
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
    console.log("updatedSettings", updatedSettings, "shopId", shopId);

    if (!shopId || !updatedSettings) {
      return res.status(400).json({ error: "Shop ID and updated settings are required." });
    }

    // Find the existing SMTP configuration
    const existingConfig = await SMTPConfig.findOne({ shopId });
    if (!existingConfig) {
      return res.status(404).json({ error: "SMTP configuration not found for the given shop ID." });
    }

    // Merge existing smtpData with updated settings
    const mergedData = {
      ...existingConfig.smtpData.toObject(), // Convert Mongoose object to plain object
      ...updatedSettings,
    };

    // Update the database
    const smtpConfig = await SMTPConfig.findOneAndUpdate(
      { shopId },
      { $set: { smtpData: mergedData } },
      { new: true }
    );

    res.status(200).json({
      message: "SMTP Configuration updated successfully.",
      updatedConfig: smtpConfig,
    });
  } catch (error) {
    console.error("Error updating SMTP configuration:", error);
    res.status(500).json({ error: "An error occurred while updating the SMTP configuration." });
  }
};






























// // Save SMTP configuration
// export const saveSMTPConfig = async (req, res) => {

//   try {
//     const { shopId, ...smtpData } = req.body;
//     console.log("req.body", req.body);

//     // Ensure shopId is provided
//     if (!shopId) {
//       return res.status(400).json({ error: "Shop ID is required." });
//     }

//     // Check if configuration for the shop already exists
//     const existingConfig = await SMTPConfig.findOne({ shopId });
//     if (existingConfig) {
//       return res.status(400).json({ error: "SMTP configuration already exists for this shop." });
//     }

//     // Save new SMTP configuration
//     const smtpConfig = new SMTPConfig({ shopId, ...smtpData });
//     await smtpConfig.save();

//     res.status(201).json({ message: "SMTP Configuration saved successfully." });
//   } catch (error) {
//     console.error("Error saving SMTP configuration:", error);
//     res.status(500).json({ error: "An error occurred while saving the SMTP configuration." });
//   }
// };

// //update only boolean for sendByOwnEmail
// export const changeSendByOwnEmail = async (req, res) => {
//   try {
//     const { shopId, sendByOwnEmail } = req.body;
//     console.log('req.body', req.body);
//     // Ensure shopId and sendByOwnEmail are provided
//     if (!shopId || sendByOwnEmail === undefined) {
//       return res.status(400).json({ error: "Shop ID and sendByOwnEmail are required." });
//     }

//     // Update only the sendByOwnEmail field in the database
//     const updatedConfig = await SMTPConfig.findOneAndUpdate(
//       { shopId }, // Find by shopId
//       { "smtpData.sendByOwnEmail": sendByOwnEmail }, // Update only the sendByOwnEmail field
//       { new: true } // Return the updated document
//     );

//     // If no configuration is found
//     if (!updatedConfig) {
//       return res.status(404).json({ error: "SMTP configuration not found for this shop." });
//     }

//     // Respond with the updated configuration
//     res.status(200).json({
//       message: "SMTP configuration updated successfully.",
//       updatedConfig: {
//         shopId: updatedConfig.shopId,
//         sendByOwnEmail: updatedConfig.smtpData.sendByOwnEmail,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating sendByOwnEmail:", error);
//     res.status(500).json({ error: "An error occurred while updating the SMTP configuration." });
//   }
// };

// // update only boolean for sendByAppEmail 
// export const changeSendByAppEmail = async (req, res) => {
//   try {
//     const { shopId, sendByAppEmail } = req.body;

//     // Ensure shopId and sendByAppEmail are provided
//     if (!shopId || sendByAppEmail === undefined) {
//       return res.status(400).json({ error: "Shop ID and sendByAppEmail are required." });
//     }

//     // Update only the sendByAppEmail field in the database
//     const updatedConfig = await SMTPConfig.findOneAndUpdate(
//       { shopId }, // Find by shopId
//       { "smtpData.sendByAppEmail": sendByAppEmail }, // Update only the sendByAppEmail field
//       { new: true } // Return the updated document
//     );

//     // If no configuration is found
//     if (!updatedConfig) {
//       return res.status(404).json({ error: "SMTP configuration not found for this shop." });
//     }

//     // Respond with the updated configuration
//     res.status(200).json({
//       message: "SMTP configuration updated successfully.",
//       updatedConfig: {
//         shopId: updatedConfig.shopId,
//         sendByAppEmail: updatedConfig.smtpData.sendByAppEmail,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating sendByAppEmail:", error);
//     res.status(500).json({ error: "An error occurred while updating the SMTP configuration." });
//   }
// };

// // update only boolean for sendOnOrderPlaced
// export const changeSendOnOrderPlaced = async (req, res) => {
//   try {
//     const { shopId, sendOnOrderPlaced } = req.body;

//     // Ensure shopId and sendOnOrderPlaced are provided
//     if (!shopId || sendOnOrderPlaced === undefined) {
//       return res.status(400).json({ error: "Shop ID and sendOnOrderPlaced are required." });
//     }

//     // Update only the sendOnOrderPlaced field in the database
//     const updatedConfig = await SMTPConfig.findOneAndUpdate(
//       { shopId }, // Find by shopId
//       { "smtpData.sendOnOrderPlaced": sendOnOrderPlaced }, // Update only the sendOnOrderPlaced field
//       { new: true } // Return the updated document
//     );

//     // If no configuration is found
//     if (!updatedConfig) {
//       return res.status(404).json({ error: "SMTP configuration not found for this shop." });
//     }

//     // Respond with the updated configuration
//     res.status(200).json({
//       message: "SMTP configuration updated successfully.",
//       updatedConfig: {
//         shopId: updatedConfig.shopId,
//         sendOnOrderPlaced: updatedConfig.smtpData.sendOnOrderPlaced,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating sendOnOrderPlaced:", error);
//     res.status(500).json({ error: "An error occurred while updating the SMTP configuration." });
//   }
// };


// // Get SMTP configuration
// export const getSMTPConfig = async (req, res) => {
//   try {
//     const { shopId } = req.query;

//     if (!shopId) {
//       return res.status(400).json({ error: "Shop ID is required." });
//     }

//     const smtpConfig = await SMTPConfig.findOne({ shopId });
//     if (!smtpConfig) {
//       return res.status(404).json({ error: "SMTP configuration not found." });
//     }

//     // Decrypt the password
//     const [iv, encryptedPassword] = smtpConfig.smtpData.password.split(":");
//     const algorithm = "aes-256-cbc";
//     const secretKey = process.env.ENCRYPTION_SECRET_KEY;
//     const decipher = crypto.createDecipheriv(
//       algorithm,
//       Buffer.from(secretKey),
//       Buffer.from(iv, "hex")
//     );

//     let decryptedPassword = decipher.update(encryptedPassword, "hex", "utf8");
//     decryptedPassword += decipher.final("utf8");

//     // Include decrypted password in response
//     res.status(200).json({
//       smtpData: {
//         ...smtpConfig.smtpData.toObject(),
//         password: decryptedPassword,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching SMTP configuration:", error);
//     res.status(500).json({ error: "An error occurred while fetching the SMTP configuration." });
//   }
// };


// // Get SMTP configuration
// export const checkForStatus = async (req, res) => {
//   try {
//     const { shopId } = req.query;

//     // Ensure shopId is provided
//     if (!shopId) {
//       return res.status(400).json({ error: "Shop ID is required." });
//     }

//     // Fetch configuration for the shop
//     const checkTureFalse = await SMTPConfig.findOne({ shopId });
//     if (!checkTureFalse) {
//       return res.status(404).json({ error: "SMTP configuration not found for the given shop ID." });
//     }

//     res.status(200).json({
//       sendByOwnEmail: checkTureFalse.smtpData.sendByOwnEmail,
//       sendByAppEmail: checkTureFalse.smtpData.sendByAppEmail,
//       sendOnOrderPlaced: checkTureFalse.smtpData.sendOnOrderPlaced,
//     });
//   } catch (error) {
//     console.error("Error fetching SMTP configuration:", error);
//     res.status(500).json({ error: "An error occurred while fetching the SMTP configuration." });
//   }
// };


// // Update SMTP configuration
// export const updateSMTPConfig = async (req, res) => {
//   try {
//     const { shopId, updatedSettings } = req.body;

//     // Ensure shopId and updated settings are provided
//     if (!shopId || !updatedSettings) {
//       return res.status(400).json({ error: "Shop ID and updated settings are required." });
//     }

//     // Find and update the configuration
//     const smtpConfig = await SMTPConfig.findOneAndUpdate(
//       { shopId },
//       { $set: updatedSettings },
//       { new: true } // Return the updated document
//     );

//     if (!smtpConfig) {
//       return res.status(404).json({ error: "SMTP configuration not found for the given shop ID." });
//     }

//     res.status(200).json({
//       message: "SMTP Configuration updated successfully.",
//       updatedConfig: smtpConfig,
//     });
//   } catch (error) {
//     console.error("Error updating SMTP configuration:", error);
//     res.status(500).json({ error: "An error occurred while updating the SMTP configuration." });
//   }
// };

// // Verify and decrypt password (example endpoint)
// export const verifyPassword = async (req, res) => {
//   try {
//     const { shopId, password } = req.body;

//     // Ensure shopId and password are provided
//     if (!shopId || !password) {
//       return res.status(400).json({ error: "Shop ID and password are required." });
//     }

//     // Fetch configuration
//     const smtpConfig = await SMTPConfig.findOne({ shopId });
//     if (!smtpConfig) {
//       return res.status(404).json({ message: "SMTP configuration not found." });
//     }

//     // Verify the password
//     const isMatch = await bcrypt.compare(password, smtpConfig.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid password." });
//     }

//     res.status(200).json({ message: "Password is correct." });
//   } catch (error) {
//     console.error("Error verifying password:", error);
//     res.status(500).json({ error: "An error occurred while verifying the password." });
//   }
// };
