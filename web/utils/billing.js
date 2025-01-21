// utils/billing.js
import { Shopify } from "@shopify/shopify-api";

export const requestBilling = async (session, planDetails) => {
  const returnUrl = `${process.env.HOST}/auth/callback`;
  
  const subscriptionData = {
    recurring_application_charge: {
      name: planDetails.name,
      price: planDetails.price,
      return_url: returnUrl,
      test: true, // Set to false in production
      capped_amount: planDetails.cappedAmount || null,
      terms: planDetails.terms || "",
      trial_days: planDetails.trialDays || 0,
    },
  };

  const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

  const response = await client.post({
    path: "recurring_application_charges",
    data: subscriptionData,
    type: Shopify.Clients.Rest.DataType.JSON,
  });

  return response.recurring_application_charge.confirmation_url;
};
