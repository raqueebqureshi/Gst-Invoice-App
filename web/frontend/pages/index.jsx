import { Divider, Avatar, Page, FooterHelp, Link, Layout, AlphaCard, VerticalStack, Spinner } from "@shopify/polaris";
import { BannerEx } from "../components/Banner";
import { OrderTableEx } from "../components/IndexTable.jsx";
import "@shopify/polaris/build/esm/styles.css";
import "../styles.css";
import { useEffect, useState } from "react";
import { InvoiceTemplate2 } from "../invoiceTemplates/invoice-template2.jsx";
import { LegacyCard, EmptyState } from "@shopify/polaris";
import React from "react";
import { useNavigate } from "react-router-dom";

import { Text } from "@shopify/polaris";
import { set } from "mongoose";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");
  const [shopId, setshopId] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [shopDetails, setShopDetails] = useState([]);
  const [shopProfile, setShopProfile] = useState({});


  
  useEffect(() => {

    const fetchShop = async () => {
      try {
        const response = await  fetch("/api/2024-10/shop.json", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          // Assuming data.orders contains the list of orders
          // console.log("shop data", data);
          setLoading(false);
          setshopId(data.data.data[0].id);
          setStoreName(data.data.data[0].name);

        } else {
          console.error("Failed to fetch orders:", response.statusText);
        }

      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchShop();   
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
            // localStorage.setItem("planInfo", JSON.stringify(profileData.plans));
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
            <VerticalStack gap="5">
              <Layout>
                <Layout.Section>
                  <p
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                      cursor: "pointer",
                      // float: "left",
                      textAlign: "center",
                      padding: "0px 10px",
                      fontWeight: "600",
                      fontSize: "20px",
                      alignItems: "center",
                    }}
                  >
                   Welcome {storeName ?"to "+storeName : ""}
                   {shopProfile?.images?.logoURL &&(<>
                    <img
                 src={
                   shopProfile?.images?.logoURL 
                 }
                 alt={""}
                 style={{
                   maxWidth: "45px",
                   maxHeight: "45px",
                   objectFit: "contain",
                   borderRadius: "50%",
                 }}
               />
                   </>)}
                    
                  </p>
                </Layout.Section>
              </Layout>
              {/* <div style={{ display: "flex", gap: "20px", width: "100%" }}>
                <div style={{ flex: 1 }}>
                  <AlphaCard>
                    <p style={{ fontSize: "25px", fontWeight: "600", textAlign: "center", marginBottom: "25px" }}>
                      Total Orders
                    </p>
                    <hr style={{ width: "50%" }} />
                    <p style={{ fontSize: "45px", fontWeight: "600", textAlign: "center", margin: "25px" }}>
                      {totalOrders||0}
                    </p>
                  </AlphaCard>
                </div>
                <div style={{ flex: 1 }}>
                  <AlphaCard>
                    <p style={{ fontSize: "25px", fontWeight: "600", textAlign: "center", marginBottom: "25px" }}>
                      Total Products
                    </p>
                    <hr style={{ width: "50%" }} />
                    <p style={{ fontSize: "45px", fontWeight: "600", textAlign: "center", margin: "25px" }}>
                      {totalProducts||0}
                    </p>
                  </AlphaCard>
                </div>
              </div> */}

              {/* <BannerEx /> */}
              {/* <Divider /> */}
              <LegacyCard sectioned style={{ marginTop: "0px" }}>
                <EmptyState
                  heading="Before generating invoice please do fill your business info!"
                  action={{
                    content: "Get started",
                    onAction: () => {
                      navigate("/settings");
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

            {/* <FooterHelp>
            Need Help{' '}
            <Link url="" removeUnderline>
              please click here
            </Link>
          </FooterHelp> */}
          </Page>
        )}
      </div>
    </>
  );
}
