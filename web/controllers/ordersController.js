import express from "express";
import axios from "axios";
import shopify from "../shopify.js";

const router = express.Router();
const SHOPIFY_API_VERSION = "2025-01"; // Shopify API version

export const getOrders = async (req, res) => {
  try {

    
    const session = res.locals.shopify.session;
    const accessToken = session.accessToken; 
 

    const { shop, page_info } = req.query;
    const limit = 25; // Shopify allows a max of 25 per page

    if (!shop) {
      return res.status(400).json({ message: "Shop domain is required" });
    }

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized: Access token missing" });
    }

    const SHOPIFY_ACCESS_TOKEN = accessToken;
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





export const getLastMonthOrderCount = async (req, res) => {
  try {
    // ✅ Validate session
    const session = res.locals.shopify.session;
    if (!session) {
      console.error("❌ No session found");
      return res.status(401).json({ message: "Unauthorized: Session is missing" });
    }

    // ✅ Shopify GraphQL Client
    const client = new shopify.api.clients.Graphql({ session });

    // ✅ Get the current date
const now = new Date();

console.log('✅ now:', now);

// ✅ Get last month's first day (1st of last month)
const lastMonthStart = new Date(now.getUTCFullYear(), now.getUTCMonth() - 1, 1, 0, 0, 0, 0);

// ✅ Get last month's last day (end of last month)
const lastMonthEnd = new Date(now.getUTCFullYear(), now.getUTCMonth(), 0, 23, 59, 59, 999);

// ✅ Convert to Shopify's ISO 8601 format (UTC format)
const formattedStartDate = lastMonthStart.toISOString();
const formattedEndDate = lastMonthEnd.toISOString();

console.log(`📆 Fetching orders from ${formattedStartDate} to ${formattedEndDate}`);

    // ✅ Shopify GraphQL Query
    const query = `
      query OrdersLastMonth($first: Int, $query: String) {
        orders(first: $first, query: $query) {
          edges {
            node {
              id
            }
          }
          pageInfo {  
            hasNextPage
          }
        }
      }
    `;

    let lastMonthOrderCount = 0;
    let hasNextPage = true;
    let afterCursor = null;

    // ✅ Loop to fetch all orders (pagination handling)
    while (hasNextPage) {
      const response = await client.query({
        data: {
          query,
          variables: {
            first: 250, // Max allowed orders per request
            query: `created_at:>=${formattedStartDate} created_at:<=${formattedEndDate}`,
          },
        },
      });

      // ✅ Validate response
      if (!response.body || !response.body.data || !response.body.data.orders) {
        throw new Error("Invalid response structure");
      }

      // ✅ Count orders
      const ordersBatch = response.body.data.orders.edges;
      lastMonthOrderCount += ordersBatch.length;

      // ✅ Pagination Handling
      hasNextPage = response.body.data.orders.pageInfo.hasNextPage;
      afterCursor = hasNextPage ? ordersBatch[ordersBatch.length - 1].cursor : null;
    }

    console.log(`✅ Total Orders Last Month: ${lastMonthOrderCount}`);
    
    // ✅ Return JSON response
    res.status(200).json({
      success: true,
      lastMonthOrderCount,
    });

  } catch (error) {
    console.error("❌ Error fetching last month's order count:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch last month's order count.",
      error: error.message,
    });
  }
};




export default router;
