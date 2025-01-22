import React, { useState } from "react";
import { Banner, Button } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { NavMenu } from "@shopify/app-bridge-react";






const UpgradeBanner = ({title, msg, buttonTitle, buttonClick, buttonOn}) => {
 const [isBannerVisible, setIsBannerVisible] = useState(true); // State to control banner visibility
 const navigate = useNavigate();


 const handleUpgradeClick = () => {
   // Redirect to the plan page
   navigate("/plans_and_billings");
   <a href="/plans_and_billings"></a>
 };


 const handleDismiss = () => {
   setIsBannerVisible(false); // Hide the banner when dismissed
 };


 return (
   <>
     {isBannerVisible && (
      <Banner
      title={title || "Upgrade your plan"}
      status="warning"
      action={
        buttonOn
          ? {
              content: (
                <a href="/plans_and_billings" style={{ textDecoration: "none", color: "black" }}>
                  {buttonTitle || "Upgrade Plan"}
                </a>
              ),
              onAction: buttonClick || handleUpgradeClick,
            }
          : undefined // Ensure action is undefined if buttonOn is false
      }
      onDismiss={handleDismiss} // Dismiss the banner
    >
      <p>{msg || "Upgrade your plan to access additional features and unlock more tools for your business."}</p>
    </Banner>
    
     )}
   </>
 );
};


export default UpgradeBanner;



