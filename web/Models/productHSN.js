import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
    domain: { type: String, required: true },
    products: [
      {
        name: { type: String, required: true },
        productId: { type: String, required: true, unique: true },
        HSN: { type: String, required: true },
        GST: { type: String, required: true },
      },
    ],
  });
  
  // Create the Product model
  const Product = mongoose.model('Product', productSchema);

  export default Product;