// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";  
import nodemailer from 'nodemailer';
import bodyPaser from 'body-parser';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Store from './Models/storeModel.js';
import connectDB from './database/db.js';
import routes from './routes/routes.js'; // Import the product routes
import InvoiceTemplate from './Models/InvoiceTemplateModel.js';

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

// Webhook HMAC Validation Middleware
const hmacValidation = (req, res, next) => {
  const hmac = req.headers['x-shopify-hmac-sha256'];
  const body = JSON.stringify(req.body);

  const hash = crypto
    .createHmac('sha256', SHOPIFY_SECRET)
    .update(body, 'utf8') // Only provide the data and the encoding
    .digest('base64');  // Get the final hash in base64

  if (hash === hmac) {
    return next(); // HMAC is valid, continue processing the request
  } else {
    console.error("Invalid HMAC - Unauthorized request.");
    return res.status(401).send('Unauthorized');
  }
};



//api to send shop data to db
// app.get(
//   shopify.config.auth.callbackPath,
//   shopify.auth.callback(),
//   async (req, res, next) => {
//     try {
//       const session = res.locals.shopify.session;

//       // Fetch shop information
//       const shopInfo = await shopify.api.rest.Shop.all({
//         session: session,
//       });

//       const shopDetails = shopInfo.data[0]; // Handle array or object

//       const {
//         name: storeName,
//         domain: storeDomain,
//         email: storeEmail,
//         address1: storeAddress1,
//         city: storeCity,
//         country_name: storeCountryName,

//       } = shopDetails;

//       // Check if the store already exists in the DB
//       let storeExists = await Store.findOne({ storeDomain });

//       if (!storeExists) {
//         // Create new store data
//         const newStore = new Store({
//           storeName,
//           storeDomain,
//           storeEmail,
//           storeAddress1,
//           storeCity,
//           storeCountryName
//         });

//         await newStore.save();
//         console.log("New store data saved to DB after app installation");
//       } else {
//         console.log("Store already exists in DB:", storeExists);
//       }


      

//       // Redirect to Shopify or app root
//       shopify.redirectToShopifyOrAppRoot()(req, res, next);
//     } catch (error) {
//       console.error("Error saving store data during app installation", error);
//       res.status(500).send("Failed to save store data after installation");
//     }
//   }
// );





//after app installation
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
        console.log(shopDetails)

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
          storeCountryName,
        });

        await newStore.save();
        console.log("New store data saved to DB after app installation");

        // Create a default invoice template for the new store
        const newInvoiceTemplate = new InvoiceTemplate({
          email: storeEmail,
          storeDomain,
          // Optionally set default values here if different from schema defaults
        });

        await newInvoiceTemplate.save();
        console.log("Invoice template created for the new store");
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




// webhooks for Compliance webhooks shopify 

// Customer Data Request Endpoint
app.post('/api/webhooks/customers/data_request', hmacValidation, async (req, res) => {
  try {
    const { shop_domain } = req.body;
    console.log(`Customer data request received for shop: ${shop_domain}`);

    // Fetch store data based on the storeDomain
    const storeData = await Store.findOne({ storeDomain: shop_domain });

    if (storeData) {
      res.status(200).json({
        message: 'Customer data request fulfilled',
        data: {
          storeName: storeData.storeName,
          storeDomain: storeData.storeDomain,
          storeEmail: storeData.storeEmail,
          storeAddress1: storeData.storeAddress1,
          storeCity: storeData.storeCity,
          storeCountryName: storeData.storeCountryName,
          storeInvoiceTemplate: storeData.storeInvoiceTemplate,
          storeProductCount: storeData.storeProductCount,
        },
      });
    } else {
      res.status(404).json({ message: 'Store not found' });
    }
  } catch (error) {
    console.error("Error handling customer data request webhook:", error);
    res.status(500).json({ message: 'Failed to process customer data request' });
  }
});

// Customer Data Erasure Endpoint
app.post('/api/webhooks/customers/redact',hmacValidation, async (req, res) => {
  try {
    const { shop_domain } = req.body;
    console.log(`Customer data erasure request received for shop: ${shop_domain}`);

    // Fetch store data to acknowledge what is being erased
    const storeData = await Store.findOne({ storeDomain: shop_domain });

    if (storeData) {
      res.status(200).json({
        message: 'Customer data erasure request acknowledged',
        data: {
          storeName: storeData.storeName,
          storeDomain: storeData.storeDomain,
          storeEmail: storeData.storeEmail,
          storeAddress1: storeData.storeAddress1,
          storeCity: storeData.storeCity,
          storeCountryName: storeData.storeCountryName,
          storeInvoiceTemplate: storeData.storeInvoiceTemplate,
          storeProductCount: storeData.storeProductCount,
        },
      });
    } else {
      res.status(404).json({ message: 'Store not found' });
    }
  } catch (error) {
    console.error("Error handling customer data erasure webhook:", error);
    res.status(500).json({ message: 'Failed to process customer data erasure request' });
  }
});

// Shop Data Erasure Endpoint
app.post('/api/webhooks/shop/redact', hmacValidation,  async (req, res) => {
  try {
    const { shop_domain } = req.body;
    console.log(`Shop data erasure request received for shop: ${shop_domain}`);

    // Fetch and delete store data from MongoDB
    const storeData = await Store.findOneAndDelete({ storeDomain: shop_domain });

    if (storeData) {
      res.status(200).json({
        message: 'Shop data erased successfully',
        data: {
          storeName: storeData.storeName,
          storeDomain: storeData.storeDomain,
          storeEmail: storeData.storeEmail,
          storeAddress1: storeData.storeAddress1,
          storeCity: storeData.storeCity,
          storeCountryName: storeData.storeCountryName,
          storeInvoiceTemplate: storeData.storeInvoiceTemplate,
          storeProductCount: storeData.storeProductCount,
        },
      });
      console.log(`Store data erased for domain: ${shop_domain}`);
    } else {
      res.status(404).json({ message: 'Store not found' });
    }
  } catch (error) {
    console.error("Error handling shop data erasure webhook:", error);
    res.status(500).json({ message: 'Failed to process shop data erasure request' });
  }
});

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "8081", 
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

app.use(routes);


//fetch all products
app.get("/api/products/all", async (_req, res) => {
  const allProducts = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
  });

  res.status(200).send(allProducts);
});

//all custom routes
app.use(routes);



app.get("/api/2024-10/orders.json", async (req, res) => {
  let OrderAll = await shopify.api.rest.Order.all({
    session: res.locals.shopify.session,
    status: 'any',
    fulfillment_status: null,
  });
  // console.log(OrderAll); // Check the API response in the console
  res.status(200).send(OrderAll);
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
app.get("/api/2024-10/products.json", async (_req, res) => {
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
