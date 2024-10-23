import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import { log } from "console";
import { useEffect } from "react";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import dotenv from 'dotenv';

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);





dotenv.config();

const app = express();
app.use(bodyParser.json());

// Dummy database (optional, if you want to store messages)
let messages = [];

// Endpoint to handle form submission and send an email
app.post('/api/contact_us', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Save form data (optional)
  messages.push({ name, email, subject, message });

  // Create transporter with Gmail service (you can use other email services as well)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.COMPANY_EMAIL, // Your email here
      pass: process.env.COMPANY_APP_PASSWORD, // Your app-specific password here
    },
  });

  // Email options
  const mailOptions = {
    from: email, // Sender's email (user's email)
    to: 'delhiappco@gmail.com', // The recipient's email (your company's email)
    subject: subject || 'New Contact Form Submission',
    text: `You have received a new message from ${name} (${email}):\n\n${message}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send({ error: 'Error sending email.' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send({ message: 'Form submitted and email sent successfully.' });
    }
  });
});

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

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());


//fetch all products
app.get("/api/products/all", async (_req, res) => {
  const allProducts = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
  });
  console.log("peoducts " + allProducts);

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
  console.log(OrderAll); // Check the API response in the console
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

app.listen(PORT);
