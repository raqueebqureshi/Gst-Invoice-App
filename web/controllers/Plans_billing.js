import StoreProfile from "../Models/storeInfoModel.js";
import shopify from "../shopify.js"; // Your existing Shopify configuration

export const handleBillingConfirmation = async (req, res) => {
  const { shop } = req.query; // Extract shop domain from query params

  try {
      const session = res.locals.shopify.session;

    if (!session || !session.isActive()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized or invalid session.",
      });
    }
    // Create a Shopify GraphQL client using the session
    const client = new shopify.api.clients.Graphql({ session });

    // Fetch active subscriptions for the shop
   const response = await client.query({
  data: `{
    currentAppInstallation {
      activeSubscriptions {
        id
        name
        test
        createdAt
        currentPeriodEnd
        status
        lineItems {
          id
          plan {
            pricingDetails {
              ... on AppRecurringPricing {
                price {
                  amount
                  currencyCode
                }
                interval
              }
              ... on AppUsagePricing {
                cappedAmount {
                  amount
                  currencyCode
                }
                terms
              }
            }
          }
        }
      }
    }
  }`,
});

// console.log("response: ---- ", response.body.data.currentAppInstallation.activeSubscriptions[0].lineItems[0].plan.pricingDetails);
// console.log("response : ",  response.body.data.currentAppInstallation.activeSubscriptions[0]);


const subscription = response.body.data.currentAppInstallation.activeSubscriptions[0];

if (!subscription) {
  return res.status(404).json({ success: false, message: "No active subscription found.", planId: "0" });
}

const subscriptionName = subscription.name;

// Determine the plan ID based on the subscription name
let planId;
if (subscriptionName === "Pro") {
  planId = "1"; // Assign plan ID for Pro
} else if (subscriptionName === "Business") {
  planId = "2"; // Assign plan ID for Business
} else {
  planId = "0" //
  return res.status(400).json({ success: false, message: "Invalid subscription name." });
}

// Update the database with the plan details
const updatedStore = await StoreProfile.findOneAndUpdate(
  { storeDomain: shop },
  {
    "plans.planId": planId,
    "plans.planStartDate": subscription.createdAt,
  },
  { new: true }
);

if (updatedStore) {
  return res.status(200).json({
    success: true,
    message: "Plan details updated successfully.",
    updatedStore,
  });
} else {
  return res.status(500).json({ success: false, message: "Failed to update the plan details in the database." });
}

  } catch (error) {
    console.error("Error during billing confirmation:", error);
    res.status(500).json({ success: false, message: "Error confirming billing.", error });
  }
};
