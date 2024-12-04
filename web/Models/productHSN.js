import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  storeDomain: { type: String, required: true },
  email: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      productName: { type: String, required: true },
      hsn: { type: String, default: "" },
      gst: { type: String, default: "" },
    },
  ],
});

const Product = mongoose.model('Product', ProductSchema);

export default Product; // Default export