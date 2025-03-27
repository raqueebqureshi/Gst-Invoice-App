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


// export const getProducts = async (req, res) => {
//   try {
//     // const session = res.locals.shopify.session;


//     // if (!session) {
//     //   return res.status(401).json({ message: "Unauthorized: Session is missing" });
//     // }


//     const { afterCursor } = req.query;
//     const limit = 25; // Adjust as needed


//     // ✅ FIX: Correct way to create Shopify GraphQL client
//     const client = new shopify.api.clients.Graphql({
//       session: res.locals.shopify.session,
//     });


//     // ✅ FIX: Corrected the request syntax
//     const response = await client.query({
//       data: `{
//         products(first: ${limit}, after: ${afterCursor ? `"${afterCursor}"` : null}) {
//           edges {
//             node {
//               id
//               title
//               handle
//               status
//               images(first: 1) { # ✅ Fetch product images (get first image)
//               edges {
//               node {
//               originalSrc # ✅ Fetch image URL
//               altText # ✅ Alternative text for the image
//             }
//           }
//         }
//               description
//               createdAt
//             }
//             cursor
//           }
//           pageInfo {
//             hasNextPage
//             hasPreviousPage
//           }
//         }
//       }`,
//     });


//     // ✅ Check if response structure is correct
//     if (!response || !response.body || !response.body.data || !response.body.data.products) {
//       throw new Error("Invalid API response structure");
//     }


//     // ✅ Extract product data
//     const products = response.body.data.products.edges.map((edge) => edge.node);
//     const pageInfo = response.body.data.products.pageInfo;
//     const nextCursor = pageInfo.hasNextPage
//       ? response.body.data.products.edges[response.body.data.products.edges.length - 1].cursor
//       : null;


//     console.log(`✅ Fetched ${products.length} products, Next Cursor: ${nextCursor}`);


//     res.json({
//       products,
//       nextCursor,
//       pageInfo,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching products:", error.message || error);
//     res.status(500).json({
//       message: "Failed to fetch products.",
//       error: error.message || error,
//     });
//   }
// };


// export const getProducts = async (req, res) => {
//   try {
//     const session = res.locals.shopify.session;


//     if (!session) {
//       return res.status(401).json({ message: "Unauthorized: Session is missing" });
//     }


//     const { afterCursor, beforeCursor } = req.query;
//     const limit = 25; // Adjust as needed


//     // ✅ FIX: Correct way to create Shopify GraphQL client
//     const client = new shopify.api.clients.Graphql({ session });


//     // ✅ FIX: Corrected the request syntax with both forward & backward pagination
//     const response = await client.query({
//       data: `{
//         products(${afterCursor ? `first: ${limit}, after: "${afterCursor}"` : beforeCursor ? `last: ${limit}, before: "${beforeCursor}"` : `first: ${limit}`}) {
//           edges {
//             node {
//               id
//               title
//               handle
//               status
//               images(first: 1) {
//                 edges {
//                   node {
//                     originalSrc
//                     altText
//                   }
//                 }
//               }
//               description
//               createdAt
//             }
//             cursor
//           }
//           pageInfo {
//             hasNextPage
//             hasPreviousPage
//           }
//         }
//       }`,
//     });


//     // ✅ Check if response structure is correct
//     if (!response || !response.body || !response.body.data || !response.body.data.products) {
//       throw new Error("Invalid API response structure");
//     }


//     // ✅ Extract product data
//     const products = response.body.data.products.edges.map((edge) => edge.node);
//     const pageInfo = response.body.data.products.pageInfo;


//     // ✅ Get nextCursor & previousCursor
//     const nextCursor = pageInfo.hasNextPage
//       ? response.body.data.products.edges[response.body.data.products.edges.length - 1].cursor
//       : null;


//     const previousCursor = pageInfo.hasPreviousPage
//       ? response.body.data.products.edges[0].cursor
//       : null;


//     console.log(`✅ Fetched ${products.length} products`);
//     console.log(`➡️ Next Cursor: ${nextCursor}`);
//     console.log(`⬅️ Previous Cursor: ${previousCursor}`);


//     res.json({
//       products,
//       nextCursor,
//       previousCursor, // ✅ Include previous cursor
//       pageInfo,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching products:", error.message || error);
//     res.status(500).json({
//       message: "Failed to fetch products.",
//       error: error.message || error,
//     });
//   }
// };


export const getProducts = async (req, res) => {
 try {
   const session = res.locals.shopify.session;


   if (!session) {
     return res.status(401).json({ message: "Unauthorized: Session is missing" });
   }


   const { afterCursor, beforeCursor } = req.query;
   const limit = 250; // Adjust as needed


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
             tags
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
       tags: productNode.tags,
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


export const getAllProducts = async (req, res) => {
 try {
   const session = res.locals.shopify.session;


   if (!session) {
     return res.status(401).json({ message: "Unauthorized: Session is missing" });
   }


   const client = new shopify.api.clients.Graphql({ session });
   const limit = 250; // Maximum number of products per request (Shopify's limit)
   let allProducts = [];
   let hasNextPage = true;
   let afterCursor = null;


   // Function to fetch products with cursor handling
   const fetchProducts = async (cursor) => {
     const query = `{
       products(first: ${limit}${cursor ? `, after: "${cursor}"` : ''}) {
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
             tags
           }
           cursor
         }
         pageInfo {
           hasNextPage
         }
       }
     }`;


     const response = await client.query({ data: query });


     if (!response || !response.body || !response.body.data || !response.body.data.products) {
       throw new Error("Invalid API response structure");
     }


     const products = response.body.data.products.edges.map((edge) => ({
       id: edge.node.id.split("/").pop(),
       title: edge.node.title,
       handle: edge.node.handle,
       status: edge.node.status,
       images: edge.node.images.edges.map((imgEdge) => imgEdge.node),
       description: edge.node.description,
       createdAt: edge.node.createdAt,
       tags: edge.node.tags,
     }));


     // Add fetched products to allProducts array
     allProducts.push(...products);


     // Check if more pages are available
     hasNextPage = response.body.data.products.pageInfo.hasNextPage;


     if (hasNextPage) {
       afterCursor = response.body.data.products.edges.at(-1).cursor;
     }
   };


   // Fetch all products with pagination handling
   while (hasNextPage) {
     await fetchProducts(afterCursor);
   }


   res.json({
     success: true,
     products: allProducts,
     count: allProducts.length,
   });
 } catch (error) {
   console.error("❌ Error fetching all products:", error.message || error);
   res.status(500).json({
     success: false,
     message: "Failed to fetch all products.",
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







// import Product from "../Models/productHSN.js";
// import shopify from "../shopify.js";
// import { shopifyApi } from "@shopify/shopify-api";

// /**
//  * Insert or update products in the database for a specific store.
//  */
// export const insertProductIntoDB = async (req, res) => {
//   const { storeDomain, email, products } = req.body;
//   console.log("body", req.body);

//   if (!storeDomain || !email || !products || !Array.isArray(products)) {
//     return res.status(400).json({
//       message: "Invalid request. Please provide storeDomain, email, and products.",
//     });
//   }

//   try {
//     let existingStore = await Product.findOne({ storeDomain });

//     if (existingStore) {
//       // Merge new products with existing ones, ensuring no duplicates
//       const existingProductIds = new Set(
//         existingStore.products.map((product) => {
//           // console.log("product.id", product.productId);
//           return product.productId;
//         })
//       );
//       const uniqueNewProducts = products.filter((product) => {
//         // console.log('!existingProductIds.has(product.productId)', !existingProductIds.has(product.productId.toString()));
//         // console.log('product', product);
//         // console.log('existingProductIds',existingProductIds);
//         // console.log('product.productId.toString()', typeof product.productId.toString());
//         return !existingProductIds.has(product.productId.toString());
//       });

//       // Add unique new products to the existing products array
//       existingStore.products.push(...uniqueNewProducts);

//       await existingStore.save();

//       return res.status(200).json({
//         message: "Products updated successfully with unique new products.",
//         store: existingStore,
//       });
//     } else {
//       // Create a new store with the provided data
//       const newStore = new Product({
//         storeDomain,
//         email,
//         products,
//       });
//       await newStore.save();

//       return res.status(201).json({
//         message: "Products saved successfully.",
//         store: newStore,
//       });
//     }
//   } catch (error) {
//     console.error("Error saving products:", error);
//     return res.status(500).json({
//       message: "Internal server error.",
//       error: error.message,
//     });
//   }
// };


// export const getProducts = async (req, res) => {
//   try {
//     const session = res.locals.shopify.session;

//     if (!session) {
//       return res.status(401).json({ message: "Unauthorized: Session is missing" });
//     }

//     const { afterCursor, beforeCursor } = req.query;
//     const limit = 25; // Adjust as needed

//     const client = new shopify.api.clients.Graphql({ session });

//     // ✅ Updated Query - Keep as is
//     const response = await client.query({
//       data: `{
//         products(${afterCursor ? `first: ${limit}, after: "${afterCursor}"` : beforeCursor ? `last: ${limit}, before: "${beforeCursor}"` : `first: ${limit}`}) {
//           edges {
//             node {
//               id
//               title
//               handle
//               status
//               images(first: 1) {
//                 edges {
//                   node {
//                     originalSrc
//                     altText
//                   }
//                 }
//               }
//               description
//               createdAt
//               tags
//             }
//             cursor
//           }
//           pageInfo {
//             hasNextPage
//             hasPreviousPage
//           }
//         }
//       }`,
//     });

//     // ✅ Ensure the response structure is correct
//     if (!response || !response.body || !response.body.data || !response.body.data.products) {
//       throw new Error("Invalid API response structure");
//     }

//     // ✅ Extract product data & remove "gid://shopify/Product/"
//     const products = response.body.data.products.edges.map((edge) => {
//       const productNode = edge.node;
//       return {
//         id: productNode.id.split("/").pop(), // ✅ Extract only numeric part from ID
//         title: productNode.title,
//         handle: productNode.handle,
//         status: productNode.status,
//         images: productNode.images.edges.map((imgEdge) => imgEdge.node),
//         description: productNode.description,
//         createdAt: productNode.createdAt,
//         tags: productNode.tags,
//       };
//     });

//     const pageInfo = response.body.data.products.pageInfo;

//     const nextCursor = pageInfo.hasNextPage
//       ? response.body.data.products.edges[response.body.data.products.edges.length - 1].cursor
//       : null;

//     const previousCursor = pageInfo.hasPreviousPage
//       ? response.body.data.products.edges[0].cursor
//       : null;

//     // console.log(`✅ Fetched ${products.length} products`);

//     res.json({
//       products,
//       nextCursor,
//       previousCursor,
//       pageInfo,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching products:", error.message || error);
//     res.status(500).json({
//       message: "Failed to fetch products.",
//       error: error.message || error,
//     });
//   }
// };

// /**
//  * Update HSN and GST for specific products in a store.
//  */
// export const updateProductsInDB = async (req, res) => {
//   const { storeDomain, email, products } = req.body;

//   console.log("Request Body:", req.body);

//   // Validate the input
//   if (!storeDomain || !email || !products || !Array.isArray(products)) {
//     return res.status(400).json({
//       message: "Invalid request. Please provide storeDomain, email, and products.",
//     });
//   }

//   try {
//     // Find the store by storeDomain and email
//     const store = await Product.findOne({ storeDomain, email });

//     if (!store) {
//       return res.status(404).json({
//         message: "Store not found or invalid email.",
//       });
//     }

//     // Iterate over the products to update HSN and GST
//     products.forEach((updateData) => {
//       const product = store.products.find(
//         (p) => p.productId === String(updateData.id) // Ensure type match by converting `id` to String
//       );

//       if (product) {
//         console.log("Matched Product:", product); // Debug log
//         // Update fields and mark as modified
//         product.set("hsn", updateData.HSN || product.hsn);
//         product.set("gst", updateData.GST || product.gst);
//       } else {
//         console.warn("No match found for productId:", updateData.id); // Debug log
//       }
//     });

//     // Save the updated store to the database
//     await store.save();

//     console.log("Updated Store:", store); // Debug log
//     return res.status(200).json({
//       message: "Products updated successfully.",
//       store,
//     });
//   } catch (error) {
//     console.error("Error updating products:", error);
//     return res.status(500).json({
//       message: "Internal server error.",
//       error: error.message,
//     });
//   }
// };

// /**
//  * Fetch GST values for all products of a specific store.
//  */
// export const getAndHSNValuesFromDB = async (req, res) => {
//   const { storeDomain, email } = req.query;

//   console.log("Fetch GST Request Query:", req.query);

//   // Validate input
//   if (!storeDomain || !email) {
//     return res.status(400).json({
//       message: "Invalid request. Please provide storeDomain and email.",
//     });
//   }

//   try {
//     // Find the store by storeDomain and email
//     const store = await Product.findOne({ storeDomain, email });

//     if (!store) {
//       return res.status(404).json({
//         message: "Store not found or invalid email.",
//       });
//     }

//     // Extract productId, productName, and gst from each product
//     const gstValues = store.products.map((product) => ({
//       productId: product.productId,
//       productName: product.productName,
//       gst: product.gst,
//       hsn: product.hsn,
//     }));

//     // Return the GST values
//     return res.status(200).json({
//       message: "GST values fetched successfully.",
//       gstValues,
//     });
//   } catch (error) {
//     console.error("Error fetching GST values:", error);
//     return res.status(500).json({
//       message: "Internal server error.",
//       error: error.message,
//     });
//   }
// };
