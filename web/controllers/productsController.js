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



/**
 * Update HSN and GST for specific products in a store.
 */
export const updateProductsInDB = async (req, res) => {
  const { storeDomain, email, products } = req.body;

  console.log("Request Body:", req.body);

  // Validate the input
  if (!storeDomain || !email || !products || !Array.isArray(products)) {
    return res.status(400).json({
      message: 'Invalid request. Please provide storeDomain, email, and products.',
    });
  }

  try {
    // Find the store by storeDomain and email
    const store = await Product.findOne({ storeDomain, email });

    if (!store) {
      return res.status(404).json({
        message: 'Store not found or invalid email.',
      });
    }

    // Iterate over the products to update HSN and GST
    products.forEach((updateData) => {
      const product = store.products.find(
        (p) => p.productId === String(updateData.id) // Ensure type match by converting `id` to String
      );

      if (product) {
        console.log("Matched Product:", product); // Debug log
        // Update fields and mark as modified
        product.set("hsn", updateData.HSN || product.hsn);
        product.set("gst", updateData.GST || product.gst);
      } else {
        console.warn("No match found for productId:", updateData.id); // Debug log
      }
    });

    // Save the updated store to the database
    await store.save();

    console.log("Updated Store:", store); // Debug log
    return res.status(200).json({
      message: 'Products updated successfully.',
      store,
    });
  } catch (error) {
    console.error('Error updating products:', error);
    return res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
};



/**
 * Fetch GST values for all products of a specific store.
 */
export const getAndHSNValuesFromDB = async (req, res) => {
  const { storeDomain, email } = req.query;

  // console.log("Fetch GST Request Query:", req.query);

  // Validate input
  if (!storeDomain || !email) {
    return res.status(400).json({
      message: "Invalid request. Please provide storeDomain and email.",
    });
  }

  try {
    // Find the store by storeDomain and email
    const store = await Product.findOne({ storeDomain, email });

    if (!store) {
      return res.status(404).json({
        message: "Store not found or invalid email.",
      });
    }

    // Extract productId, productName, and gst from each product
    const gstValues = store.products.map((product) => ({
      productId: product.productId,
      productName: product.productName,
      gst: product.gst,
      hsn: product.hsn,
    }));

    // Return the GST values
    return res.status(200).json({
      message: "GST values fetched successfully.",
      gstValues,
    });
  } catch (error) {
    console.error("Error fetching GST values:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

