import express from 'express';
import { insertProductIntoDB } from '../controllers/productsController.js'; // Import the controller

const router = express.Router();

// Define the POST route to add or update products
router.post('/api/add-store-products', insertProductIntoDB);

export default router;