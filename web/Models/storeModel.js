import mongoose from 'mongoose';

// Store model
const storeSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  storeDomain: { type: String, required: true, unique: true },
  storeEmail: { type: String, required: true },
  storeAddress1: String,
  storeCity: String,
  storeCountryName: String,
  storeInvoiceTemplate: { type: String, default: "1" },
  storeProductCount: { type: String, default: "" }
});

// Create the Store model
const Stores = mongoose.models.Stores || mongoose.model("Stores", storeSchema);

// Export default
export default Stores;
