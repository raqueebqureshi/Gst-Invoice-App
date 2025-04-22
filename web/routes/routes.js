import express from "express";
import {
  insertProductIntoDB,
  updateProductsInDB,
  getAndHSNValuesFromDB,
  getProducts,
  getAllProducts,
} from "../controllers/productsController.js"; // Import the products controller
import {
  getTemplateSettings,
  updateTemplateSettings,
} from "../controllers/InvoiceTemplateController.js";
import {
  updateStoreProfile,
  fetchShopProfile,
  updateTotalInvoiceSent,
  updateTotalInvoiceDownload,
  updateTotalInvoicePrint,
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

import { sendInvoiceAndUpload, uploadMiddleware } from "../controllers/sendInvoiceAndUpload.js";

import {
  sendTestEmailFromCustomerSMTP,
  sendTestEmailFromAppSMTP,
} from "../controllers/sendTestEmail.js";

import { handleBillingConfirmation } from '../controllers/Plans_billing.js'
import { getLastMonthOrderCount, getOrders } from "../controllers/ordersController.js";
import { changeTaxByApp , changeIsTaxIncluded } from "../controllers/taxController.js";





const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Define the POST route to add or update products
router.post("/api/add-store-products", insertProductIntoDB);
// Update product API
router.post("/api/products/update", updateProductsInDB);

// Fetch GST values for products
router.get("/api/products/gsthsn", getAndHSNValuesFromDB);

router.get("/api/products/getProducts", getProducts);

router.get("/api/products/getAllProducts", getAllProducts);





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
router.put("/api/remove-signature", removeSignature);



//send invoice pdf upload aws
router.post("/api/send-invoice", uploadMiddleware, sendInvoiceAndUpload);



//send test email to customer using smtp

// Route to send test email using customer's SMTP settings
router.post("/api/send-test-email-customer-smtp", sendTestEmailFromCustomerSMTP);

// Route to send test email using app's default SMTP settings
router.post("/api/send-test-email-app-smtp", sendTestEmailFromAppSMTP);



//get billing 
router.get('/api/billing/confirm', handleBillingConfirmation);

//paginated request 
router.get("/api/fetch-orders", getOrders);

// last month order count
router.get("/api/last-month-order-count", getLastMonthOrderCount);


// Update total invoice sent
router.put("/api/update-total-invoice-sent", updateTotalInvoiceSent);

// Update total invoice download
router.put("/api/update-total-invoice-downaload", updateTotalInvoiceDownload);

// Update total invoice sent
router.put("/api/update-total-invoice-print", updateTotalInvoicePrint);



//taxation
router.put("/api/update-tax-settings", changeTaxByApp);
router.put("/api/update-tax-included", changeIsTaxIncluded);



export default router;
