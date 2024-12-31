import express from 'express';
import { insertProductIntoDB , updateProductsInDB , getAndHSNValuesFromDB  } from '../controllers/productsController.js'; // Import the controller
import { getTemplateSettings , updateTemplateSettings} from '../controllers/InvoiceTemplateController.js'; 
const router = express.Router();

// Define the POST route to add or update products
router.post('/api/add-store-products', insertProductIntoDB);
// Update product API
router.post('/api/products/update', updateProductsInDB);

// Fetch GST values for products
router.get("/api/products/gsthsn", getAndHSNValuesFromDB);

// Route to fetch template settings
router.post("/fetch-invoice-settings", getTemplateSettings);

// Route udpate invoice settings in db
router.put("/update-invoice-settings", updateTemplateSettings);

export default router;