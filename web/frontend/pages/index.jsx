import {
  Divider,
  Avatar,
  Page,
  FooterHelp,
  Link,
  Layout,
  AlphaCard,
  VerticalStack,
  Spinner,
} from "@shopify/polaris";
import { BannerEx } from "../components/Banner";
import { OrderTableEx } from "../components/IndexTable.jsx";
import "@shopify/polaris/build/esm/styles.css";
import "../styles.css";
import { use, useEffect, useState } from "react";
import { InvoiceTemplate2 } from "../invoiceTemplates/invoice-template2.jsx";
import { LegacyCard, EmptyState } from "@shopify/polaris";
import React from "react";
import { useNavigate } from "react-router-dom";



export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate
  const [shopDetails, setShopDetails] = useState([]);
  const [shopId, setshopId] = useState("");


  // Fetch all products
  // useEffect(() => {
  //   fetch("/api/2024-10/products.json", {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   })
  //     .then((request) => request.json())
  //     .then((response) => {
  //       // console.log("all products", response);
  //       setLoading(false); // Stop loading when data is fetched
  //     })
  //     .catch((error) => {
  //       // console.log(error);
  //       setLoading(false); // Stop loading on error
  //     });
  // }, []);

  // Fetch store details
  useEffect(() => {
    fetch("/api/2024-10/shop.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((request) => request.json())
      .then((response) => {
        if (response.data.length > 0) {
          // console.log("Store Details ", response.data);
          setLoading(false);
          setShopDetails(response.data[0]);
          setStoreName(response.data.data[0].name);
          setshopId(data.data.data[0].id);
          // console.log("store name : ", storeName);
           // Stop loading when data is fetched
        }
      })
      .catch((error) => console.log(error));

      

  }, []);


  useEffect(() => {
    if (shopId) {
      fetch(`/api/fetch-store-profile?shopId=${shopId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.profile) {
            setLoading(false);
            const profileData = data.profile;
            setShopProfile(profileData || {});
  
            // Fetch current plan ID and store as a string
            const currentPlanId = profileData.plans?.planId?.toString() || "";
  
            // Store plan details in localStorage
            localStorage.setItem("planInfo", JSON.stringify(profileData.plans));
            localStorage.setItem("currentPlan", currentPlanId); // Store only the plan ID as string
            // localStorage.setItem("proplan", "1"); // Hardcoded Pro Plan
            // localStorage.setItem("businessplan", "2"); // Hardcoded Business Plan
          }
        })
        .catch((error) => {
          console.error("Error fetching store profile:", error);
        });
    }
  }, [shopId]);



  return (
    <>
      <div>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "200px",
            }}
          >
            <Spinner accessibilityLabel="Loading Spinner" size="large" />
          </div>
        ) : (
          <Page fullWidth>
            <VerticalStack gap="10">
              <Layout>
                <Layout.Section>
                  <p
                    style={{
                      display: "flex",
                      gap: "20px",
                      cursor: "pointer",
                      float: "right",
                      textAlign: "center",
                      fontWeight: "600",
                      fontSize: "20px",
                    }}
                  >
                    {storeName}
                    <Avatar customer name="Farrah" />
                  </p>
                </Layout.Section>
              </Layout>

              <BannerEx />
              <Divider />
              <LegacyCard sectioned style={{ marginTop: "20px" }}>
                <EmptyState
                  heading="Before generating invoice please do fill your business info!"
                  action={{
                    content: "Get started",
                    onAction: () => {
                      navigate('/settings');
                      // Add your logic here, such as navigation
                    },
                  }}
                  secondaryAction={{
                    content: "Learn more",
                    url: "https://delhidigital.co",
                    onAction: () => {
                      // console.log("Learn more clicked");
                      // You can also handle navigation or additional logic here
                    },
                  }}
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <p>Manage your all invoicing in one place</p>
                 
                </EmptyState>
              </LegacyCard>
            </VerticalStack>

          </Page>
        )}
      </div>
    </>
  );
}
