import express from "express";
import {
  insertProductIntoDB,
  updateProductsInDB,
  getAndHSNValuesFromDB,
} from "../controllers/productsController.js"; // Import the controller
import {
  getTemplateSettings,
  updateTemplateSettings,
} from "../controllers/InvoiceTemplateController.js";
import { createStoreProfile } from "../controllers/storeProfileController.js";
import {
  saveSMTPConfig,
  getSMTPConfig,
  updateSMTPConfig,
} from "../controllers/smtpController.js"; // Import the controller
const router = express.Router();

// Define the POST route to add or update products
router.post("/api/add-store-products", insertProductIntoDB);
// Update product API
router.post("/api/products/update", updateProductsInDB);

// Fetch GST values for products
router.get("/api/products/gsthsn", getAndHSNValuesFromDB);

// Route to fetch template settings
router.post("/api/fetch-invoice-settings", getTemplateSettings);

// Route udpate invoice settings in db
router.put("/api/update-invoice-settings", updateTemplateSettings);

// Define the POST route to create a store profile with the required fields
router.put("/api/add-store-data", createStoreProfile);

// Define the POST route to save SMTP configuration
router.post("/api/smtp/save", saveSMTPConfig);
// Define the GET route to get SMTP configuration
router.get("/api/smtp/get", getSMTPConfig);
// Define the PUT route to update SMTP configuration
router.put("/api/smtp/update", updateSMTPConfig);

export default router;
