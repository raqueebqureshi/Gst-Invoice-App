// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";  
import nodemailer from 'nodemailer';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import crypto from 'crypto';
import Store from './Models/storeModel.js';
import connectDB from './database/db.js';
import routes from './routes/routes.js'; // Import the product routes
import InvoiceTemplate from './Models/InvoiceTemplateModel.js';
import StoreProfile from './Models/storeInfoModel.js';
import { shopifyApi } from "@shopify/shopify-api";
import { DeliveryMethod } from "@shopify/shopify-api";
import privacyWebhooks from "./privacy.js";
import SMTPConfig from "./Models/SMTPConfig.js";
dotenv.config();


const app = express();
app.use(express.json());


//connect to db
connectDB();


// Ensure that SHOPIFY_SECRET is defined
const SHOPIFY_SECRET = process.env.SHOPIFY_SECRET;
if (!SHOPIFY_SECRET) {
  console.error("SHOPIFY_SECRET is not defined. Please set the SHOPIFY_SECRET environment variable.");
  process.exit(1); // Stop execution if secret is not available
}


//webhooks
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({
    webhookHandlers: privacyWebhooks,
  })
);


app.post("/api/webhooks/orders/create", (req, res) => {
  console.log("Received orders/create webhook:", req.body);
  res.status(200).send("Webhook received.");
});

app.post("/api/webhooks/app/uninstalled", (req, res) => {
  console.log("Received app/uninstalled webhook:", req.body);
  // Add cleanup logic here
  res.status(200).send("Webhook received.");
});

app.post("/api/webhooks/customers/data_request", (req, res) => {
  console.log("Received app/customers/data_request.", req.body);
  // Add cleanup logic here
  res.status(200).send("Webhook received");
});
app.post("/api/webhooks/customers/redact", (req, res) => {
  console.log("Received app/customers/redact", req.body);
  // Add cleanup logic here
  res.status(200).send("Webhook received.");
});
app.post("/api/webhooks/shop/redact", (req, res) => {
  console.log("Received app/api/webhooks/shop/redact:", req.body);
  // Add cleanup logic here
  res.status(200).send("Webhook received.");
});


//installing app 
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
      console.log("Shop Details:", shopDetails);

      const {
        id: shopId,
        name: storeName,
        domain: storeDomain,
        email: storeEmail,
        address1: storeAddress1,
        city: storeCity,
        country_name: storeCountryName,
      } = shopDetails;

      // Check if the store already exists in the database
      let store = await Store.findOne({ storeDomain });

      if (!store) {
        // Create new store data
        store = new Store({
          shopId,
          storeName,
          storeDomain,
          storeEmail,
          storeAddress1,
          storeCity,
          storeCountryName,
        });

        await store.save();
        console.log("New store data saved to DB after app installation.");
      } else {
        console.log("Store already exists in DB:", store);
      }

      // Check if the store profile exists
      let storeProfile = await StoreProfile.findOne({ shopId });

      if (!storeProfile) {
        // Create a new store profile
        storeProfile = new StoreProfile({
          shopId,
          storeDomain,
          email: storeEmail,
          // Default values for the profile will come from the schema
        });

        await storeProfile.save();
        console.log("Store profile created for the store:", storeProfile);
      } else {
        console.log("Store profile already exists:", storeProfile);
      }

      // Check if the invoice template exists
      let invoiceTemplate = await InvoiceTemplate.findOne({ storeDomain, email: storeEmail });

      if (!invoiceTemplate) {
        // Create a default invoice template
        invoiceTemplate = new InvoiceTemplate({
          email: storeEmail,
          storeDomain,
          shopId,
          // Optionally set default values here if different from schema defaults
        });

        await invoiceTemplate.save();
        console.log("Invoice template created for the store:", invoiceTemplate);
      } else {
        console.log("Invoice template already exists:", invoiceTemplate);
      }


        // Check if the SMTP configuration exists
        let smtpConfig = await SMTPConfig.findOne({ shopId });

        if (!smtpConfig) {
          // Create a default SMTP configuration
          smtpConfig = new SMTPConfig({
            shopId,
            // Optionally set default values here if different from schema defaults
          });

          await smtpConfig.save();
          console.log("SMTP configuration created for the store:", smtpConfig);
        } else {
          console.log("SMTP configuration already exists:", smtpConfig);
        }

      // Redirect to Shopify or app root
      shopify.redirectToShopifyOrAppRoot()(req, res, next);
    } catch (error) {
      console.error("Error during app installation:", error);
      res.status(500).send("Failed to save store data after installation.");
    }
  }
);




//to update product count into db
app.put('/api/update-product-count', async (req, res) => {
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



// Update invoice template API
app.post('/api/update-invoice-template', async (req, res) => {
  const { storeDomain, invoiceTemplate } = req.body;
  console.log("Received request body:", req.body);

  if (!storeDomain || !invoiceTemplate) {
    res.status(400).json({ message: 'Missing storeDomain or invoiceTemplate' });
    return;
  }

  try {
    // Update the invoice template based on storeDomain
    let updatedStore = await Store.findOneAndUpdate(
      { storeDomain },
      { storeInvoiceTemplate: invoiceTemplate },
      { new: true } // Return the updated document
    );

    if (updatedStore) {
      console.log("Invoice template updated successfully:", updatedStore.storeInvoiceTemplate);
      res.status(200).json({
        message: "Invoice template updated successfully",
        storeInvoiceTemplate: updatedStore.storeInvoiceTemplate
      });
    } else {
      res.status(404).json({ message: "Store not found" });
    }
  } catch (error) {
    console.error("Error updating invoice template", error);
    res.status(500).json({ message: "Failed to update invoice template" });
  }
});



// Fetch invoice template ID based on storeDomain
app.get('/api/get-invoice-template', async (req, res) => {
  const { storeDomain } = req.query;
  console.log("Fetching invoice template for storeDomain:", storeDomain);

  if (!storeDomain) {
    res.status(400).json({ message: 'Missing storeDomain' });
    return;
  }

  try {
    // Query the database to find the store by storeDomain and retrieve the template ID
    const store = await Store.findOne({ storeDomain }, 'storeInvoiceTemplate');
    if (store) {
      console.log("Fetched invoice template:", store.storeInvoiceTemplate);
      res.status(200).json({ storeInvoiceTemplate: store.storeInvoiceTemplate });
    } else {
      res.status(404).json({ message: "Store not found" });
    }
  } catch (error) {
    console.error("Error fetching invoice template", error);
    res.status(500).json({ message: "Failed to fetch invoice template" });
  }
});




// api for send email to support
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other services like 'Yahoo', 'Outlook', etc.
  auth: {

    user: process.env.SUPPORT_EMAIL, // Your email
    pass: process.env.SUPPORT_PASSWORD, // Your email password or app password
  },
});


app.post('/api/send-email', (req, res) => {
  const { name, email, subject, message, storeDetails } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.SUPPORT_EMAIL,
    subject: `${subject} from ${name} / GST Invoice App`,
    text: `${message} \n\nStore Details:\n- Store Name: ${storeDetails.name}\n- Email: ${storeDetails.email}\n- Phone: ${storeDetails.phone}\n- Domain: ${storeDetails.domain}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ status: 'fail', error: error.message });
    }
    res.status(200).json({ status: 'success', message: 'Email sent successfully!' });
  });
}); 


const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "8081", 
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js




// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());

// Use the shop routes
app.use("/api/*", shopify.validateAuthenticatedSession());

//fetch all products
app.get("/api/2025-01/products.json", async (_req, res) => {
  const allProducts = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
  });

  res.status(200).send(allProducts);
});

app.use(routes);

app.get("/api/2024-10/orders.json", async (req, res) => {
  try {
  let OrderAll = await shopify.api.rest.Order.all({
    session: res.locals.shopify.session,
    status: 'any',
  });
  console.log("Fetched Orders:", OrderAll); 
  res.status(200).send(OrderAll);
} catch (error) {
  console.error("Error fetching orders:", error);
  res.status(500).send("Failed to fetch orders");
}
});


app.get("/api/2024-10/shop.json", async (req, res) => {
  try {
    const shopDetails = await shopify.api.rest.Shop.all({
      session: res.locals.shopify.session,
    });
    res.status(200).json({ data: shopDetails });
  } catch (error) {
    console.error("Error fetching shop details:", error); // Log the error
    res.status(500).json({ error: "Failed to fetch shop details" });
  }
});

//count of product
// app.get("/api/2024-10/products.json", async (_req, res) => {
//   const client = new shopify.api.clients.Graphql({
//     session: res.locals.shopify.session,
//   });

//   const countData = await client.request(`
//     query shopifyProductCount {
//       productsCount {
//         count
//       }
//     }
//   `);

//   res.status(200).send({ count: countData.data.productsCount.count });
// });

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

// @ts-ignore
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
