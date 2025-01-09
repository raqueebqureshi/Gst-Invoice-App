import express from "express";
import {
  insertProductIntoDB,
  updateProductsInDB,
  getAndHSNValuesFromDB,
} from "../controllers/productsController.js"; // Import the products controller
import {
  getTemplateSettings,
  updateTemplateSettings,
} from "../controllers/InvoiceTemplateController.js";
import {
  updateStoreProfile,
  fetchShopProfile,
} from "../controllers/storeProfileController.js";
import {
  saveSMTPConfig,
  getSMTPConfig,
  updateSMTPConfig,
  checkForStatus,
  changeSendByOwnEmail,
  changeSendByAppEmail,
  changeSendOnOrderPlaced,
} from "../controllers/smtpController.js"; // Import the SMTP controller

import {
  uploadLogo,
  removeLogo,
  uploadSignature,
  removeSignature,
} from "../controllers/UploadBrandLogoController.js"; // Import the Upload Logo and image controller
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

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
router.put("/api/update-store-data", updateStoreProfile);

//for the fetchstoreprofile
router.get("/api/fetch-store-profile", fetchShopProfile);






// Define the POST route to save SMTP configuration
router.post("/api/smtp/save", saveSMTPConfig);
// Define the GET route to get SMTP configuration
router.get("/api/smtp/get", getSMTPConfig);
// Define the PUT route to update SMTP configuration
router.put("/api/smtp/update", updateSMTPConfig);
// for checking the status of the smtp
router.get("/api/check-status", checkForStatus);

// Route to update sendByOwnEmail
router.post("/api/change-send-by-own-email", changeSendByOwnEmail);

// Route to update sendByAppEmail
router.post("/api/change-send-by-app-email", changeSendByAppEmail);

// Route to update sendOnOrderPlaced
router.post("/api/change-send-on-order-placed", changeSendOnOrderPlaced);






//upload logo for store
router.post("/api/upload-logo", upload.single("logo"), uploadLogo);
// removing the logo
router.put("/api/remove-logo", removeLogo);

// Upload Signature Route
router.post("/api/upload-signature", upload.single("signature"), uploadSignature);

// Remove Signature Route
router.post("/api/remove-signature", removeSignature);

export default router;
