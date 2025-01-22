import { Page } from "@shopify/polaris";
import { Banner, Layout } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import { useEffect, useState } from "react";
import PricingPlans from "../components/PricingPlans";





export default function Plans() {
    const [planId, setplanId] = useState(null);
  // Fetch store details
  useEffect(() => {
    fetch("/api/2024-10/shop.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((request) => request.json())
      .then((response) => {
        // console.log("Store Details---!", response.data);
        if (response.data.data.length > 0) {
          // console.log("Store Details---", response.data.data[0]);
          // setShopDetails(response.data.data[0]);

          fetch(`/api/billing/confirm?shop=${response.data.data[0].domain}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
            .then((request) => request.json())
            .then((response) => {
              // console.log("plan---!", response);
              // const tempID = response.data.planId.split('/').pop();
              // console.log("tempID" ,tempID);
              const fetchedPlanId = response.updatedStore.plans.planId;
              setplanId(fetchedPlanId);
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <PricingPlans currentPlanId={planId} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
