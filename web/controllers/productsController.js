import Product from '../Models/productHSN.js';

/**
 * Insert or update products in the database for a specific store.
 */
export const insertProductIntoDB = async (req, res) => {
  const { storeDomain, email, products } = req.body;
  console.log("body", req.body)

  if (!storeDomain || !email || !products || !Array.isArray(products)) {
    return res.status(400).json({
      message: 'Invalid request. Please provide storeDomain, email, and products.',
    });
  }

  try {
    let existingStore = await Product.findOne({ storeDomain });

    if (existingStore) {
      existingStore.products = products;
      await existingStore.save();
      return res.status(200).json({
        message: 'Products updated successfully.',
        store: existingStore,
      });
    } else {
      const newStore = new Product({
        storeDomain,
        email,
        products,
      });
      await newStore.save();
      return res.status(201).json({
        message: 'Products saved successfully.',
        store: newStore,
      });
    }
  } catch (error) {
    console.error('Error saving products:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
};
