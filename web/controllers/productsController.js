import Product from "../Models/productHSN.js";
import shopify from "../shopify.js";
import { shopifyApi } from "@shopify/shopify-api";

/**
 * Insert or update products in the database for a specific store.
 */
export const insertProductIntoDB = async (req, res) => {
  const { storeDomain, email, products } = req.body;
  console.log("body", req.body);

  if (!storeDomain || !email || !products || !Array.isArray(products)) {
    return res.status(400).json({
      message: "Invalid request. Please provide storeDomain, email, and products.",
    });
  }

  try {
    let existingStore = await Product.findOne({ storeDomain });

    if (existingStore) {
      // Merge new products with existing ones, ensuring no duplicates
      const existingProductIds = new Set(
        existingStore.products.map((product) => {
          // console.log("product.id", product.productId);
          return product.productId;
        })
      );
      const uniqueNewProducts = products.filter((product) => {
        // console.log('!existingProductIds.has(product.productId)', !existingProductIds.has(product.productId.toString()));
        // console.log('product', product);
        // console.log('existingProductIds',existingProductIds);
        // console.log('product.productId.toString()', typeof product.productId.toString());
        return !existingProductIds.has(product.productId.toString());
      });

      // Add unique new products to the existing products array
      existingStore.products.push(...uniqueNewProducts);

      await existingStore.save();

      return res.status(200).json({
        message: "Products updated successfully with unique new products.",
        store: existingStore,
      });
    } else {
      // Create a new store with the provided data
      const newStore = new Product({
        storeDomain,
        email,
        products,
      });
      await newStore.save();

      return res.status(201).json({
        message: "Products saved successfully.",
        store: newStore,
      });
    }
  } catch (error) {
    console.error("Error saving products:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};


export const getProducts = async (req, res) => {
  try {
    const session = res.locals.shopify.session;

    if (!session) {
      return res.status(401).json({ message: "Unauthorized: Session is missing" });
    }

    const { afterCursor, beforeCursor } = req.query;
    const limit = 25; // Adjust as needed

    const client = new shopify.api.clients.Graphql({ session });

    // ✅ Updated Query - Keep as is
    const response = await client.query({
      data: `{
        products(${afterCursor ? `first: ${limit}, after: "${afterCursor}"` : beforeCursor ? `last: ${limit}, before: "${beforeCursor}"` : `first: ${limit}`}) {
          edges {
            node {
              id
              title
              handle
              status
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                    altText
                  }
                }
              }
              description
              createdAt
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }`,
    });

    // ✅ Ensure the response structure is correct
    if (!response || !response.body || !response.body.data || !response.body.data.products) {
      throw new Error("Invalid API response structure");
    }

    // ✅ Extract product data & remove "gid://shopify/Product/"
    const products = response.body.data.products.edges.map((edge) => {
      const productNode = edge.node;
      return {
        id: productNode.id.split("/").pop(), // ✅ Extract only numeric part from ID
        title: productNode.title,
        handle: productNode.handle,
        status: productNode.status,
        images: productNode.images.edges.map((imgEdge) => imgEdge.node),
        description: productNode.description,
        createdAt: productNode.createdAt,
      };
    });

    const pageInfo = response.body.data.products.pageInfo;

    const nextCursor = pageInfo.hasNextPage
      ? response.body.data.products.edges[response.body.data.products.edges.length - 1].cursor
      : null;

    const previousCursor = pageInfo.hasPreviousPage
      ? response.body.data.products.edges[0].cursor
      : null;

    // console.log(`✅ Fetched ${products.length} products`);

    res.json({
      products,
      nextCursor,
      previousCursor,
      pageInfo,
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error.message || error);
    res.status(500).json({
      message: "Failed to fetch products.",
      error: error.message || error,
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
      message: "Invalid request. Please provide storeDomain, email, and products.",
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
      message: "Products updated successfully.",
      store,
    });
  } catch (error) {
    console.error("Error updating products:", error);
    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/**
 * Fetch GST values for all products of a specific store.
 */
export const getAndHSNValuesFromDB = async (req, res) => {
  const { storeDomain, email } = req.query;

  console.log("Fetch GST Request Query:", req.query);

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
