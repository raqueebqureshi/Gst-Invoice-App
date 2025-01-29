import { DeliveryMethod } from "@shopify/shopify-api";

/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  /**
   * Customers can request their data from a store owner.
   */
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks/customers/data_request",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("CUSTOMERS_DATA_REQUEST payload:", payload);
    },
  },

  /**
   * Store owners can request that customer data is deleted.
   */
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks/customers/redact",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("CUSTOMERS_REDACT payload:", payload);
    },
  },

  /**
   * Triggered 48 hours after app uninstallation.
   */
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks/shop/redact",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("SHOP_REDACT payload:", payload);
    },
  },

  /**
   * Custom webhook for order creation.
   */
  "ORDERS_CREATE": {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks/orders/create",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("ORDERS_CREATE payload:", payload);

      // Add your order creation logic here
    },
  },

  /**
   * Custom webhook for app uninstallation.
   */
  "APP_UNINSTALLED": {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks/app/uninstalled",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log("APP_UNINSTALLED payload:", payload);

      // Cleanup logic, e.g., delete shop data from your database
    },
  },
};
