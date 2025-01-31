import express from "express";
import axios from "axios";
import Store from "../Models/storeModel.js";

const router = express.Router();
const SHOPIFY_API_VERSION = "2025-01"; // Shopify API version

export const getOrders = async (req, res) => {
  try {
    const { shop, page_info } = req.query;
    const limit = 25; // Shopify allows a max of 25 per page

    if (!shop) {
      return res.status(400).json({ message: "Shop domain is required" });
    }

    // Get store access token from DB
    const store = await Store.findOne({ storeDomain: shop });
    if (!store || !store.accessToken) {
      return res.status(401).json({ message: "Unauthorized: Access token missing" });
    }

    const SHOPIFY_ACCESS_TOKEN = store.accessToken;
    const SHOPIFY_STORE_URL = shop;
    
    let url = `https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/orders.json?limit=${limit}`;

    // First request: Fetch all orders
    if (!page_info) {
      url += `&status=any&financial_status=any&fulfillment_status=any&created_at_min=2000-01-01T00:00:00Z&order=asc`;
    } else {
      // Paginated request: only use `page_info`
      url += `&page_info=${encodeURIComponent(page_info)}`;
    }

    console.log(`🔍 Fetching orders from URL: ${url}`);

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
    });

    const orders = response.data.orders || [];
    let nextPageInfo = null;
    let prevPageInfo = null;

    // Extract pagination info from Shopify response headers
    if (response.headers.link) {
      const links = response.headers.link.split(", ");
      links.forEach((link) => {
        if (link.includes('rel="next"')) {
          nextPageInfo = link.match(/page_info=([^&>]+)/)?.[1];
        }
        if (link.includes('rel="previous"')) {
          prevPageInfo = link.match(/page_info=([^&>]+)/)?.[1];
        }
      });
    }

    console.log(`✅ Fetched ${orders.length} orders, Next Page: ${nextPageInfo}`);

    res.json({
      orders,
      nextPageInfo,
      prevPageInfo,
    });

  } catch (error) {
    console.error("❌ Error fetching orders:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

export default router;
