// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
// db connection
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("Missing MONGODB_URI in environment variables.");
  process.exit(1); // Exit the process if the environment variable is not set
}

// Connecting to the database using the URI from the environment variable
mongoose.connect(mongoUri, { writeConcern: { w: "majority" } })
  .then((conn) => {
    console.log(`MongoDB Connected to: ${conn.connection.host}`);
  })
  .catch((error) => {
    console.error("DB connection failed", error);
  });



//store model
let storeSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  storeDomain: { type: String, required: true, unique: true },
  storeEmail: { type: String, required: true },
  storeAddress1: String,
  storeCity: String,
  storeCountryName: String,
  storeInvoiceTemplate: { type: String, default: "1" },
  storeProductCount: { type: String, default: "" }
});


let Store = mongoose.model("Stores", storeSchema);
//api to send data to db

app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  async (req, res, next) => {
    try {
      const session = res.locals.shopify.session;

      // Fetch shop information
      const shopInfo = await shopify.api.rest.Shop.all({
        session: session,
      });

      const shopDetails = shopInfo.data[0]; // Handle array or object

      const {
        name: storeName,
        domain: storeDomain,
        email: storeEmail,
        address1: storeAddress1,
        city: storeCity,
        country_name: storeCountryName,

      } = shopDetails;

      // Check if the store already exists in the DB
      let storeExists = await Store.findOne({ storeDomain });

      if (!storeExists) {
        // Create new store data
        const newStore = new Store({
          storeName,
          storeDomain,
          storeEmail,
          storeAddress1,
          storeCity,
          storeCountryName
        });

        await newStore.save();
        console.log("New store data saved to DB after app installation");
      } else {
        console.log("Store already exists in DB:", storeExists);
      }

      // Redirect to Shopify or app root
      shopify.redirectToShopifyOrAppRoot()(req, res, next);
    } catch (error) {
      console.error("Error saving store data during app installation", error);
      res.status(500).send("Failed to save store data after installation");
    }
  }
);

//to update product count into db
app.post('/api/update-product-count', async (req, res) => {
  console.log("Received request body:", req.body);

  const { storeDomain, productCount } = req.body || {};

  if (!storeDomain || !productCount) {
    res.status(400).json({ message: 'Missing storeDomain or productCount' }); 
    return;
  }

  try {
    // Retrieve session for the store
    const session = await shopify.api.session.customAppSession(storeDomain); // Fix: Use customAppSession

    // Update the store's product count in MongoDB
    let updatedStore = await Store.findOneAndUpdate(
      { storeDomain },
      { storeProductCount: productCount.toString() },  // Update with product count as string
      { new: true }  // Return the updated document
    );

    if (updatedStore) {
      res.status(200).json({
        message: "Product count updated successfully",
        storeProductCount: updatedStore.storeProductCount  // Send updated count to frontend
      });
    } else {
      res.status(404).json({ message: "Store not found" });
    }
  } catch (error) {
    console.error("Error updating product count", error);
    res.status(500).json({ message: "Failed to update product count" });
  }
});




const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;





// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js


// Use the shop routes
app.use("/api/*", shopify.validateAuthenticatedSession());




//fetch all products
app.get("/api/products/all", async (_req, res) => {
  const allProducts = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
  });
  // console.log("peoducts " + allProducts);

  res.status(200).send(allProducts);
});



//fetch orders

// app.get("/api/2024-10/orders.json", async (req, res) => {
//   let OrderAll = await shopify.api.rest.Order.all({
//       session: res.locals.shopify.session,
//   });
//   res.status(200).send(OrderAll);
// });
app.get("/api/2024-10/orders.json", async (req, res) => {
  let OrderAll = await shopify.api.rest.Order.all({
    session: res.locals.shopify.session,
    status: 'any',
    fulfillment_status: null,
  });
  // console.log(OrderAll); // Check the API response in the console
  res.status(200).send(OrderAll);
});


// fetch shop details
app.get("/api/shop/all", async (req, res) => {
  let shopInfo = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(shopInfo);
});

//count of product
app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  const countData = await client.request(`
    query shopifyProductCount {
      productsCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.productsCount.count });
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});