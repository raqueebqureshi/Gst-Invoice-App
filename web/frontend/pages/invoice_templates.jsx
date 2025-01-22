import React, { useState, useEffect } from "react";
import { Page, Layout, FooterHelp, Link, Spinner } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { MediaCardExample2 } from "../components/MediaCard";
import invoice1 from "../assets/invoice.png";
import invoice2 from "../assets/invoice2.png";
import invoice3 from "../assets/invoice3.png";
import { useNavigate } from "react-router-dom";
import ToastNotification from "../components/ToastNotification"; // Import the ToastNotification component


import CustomizeTemplatePage from "./cutomizeTemplatePage";
import UpgradeBanner from "../components/UpgradePlanBanner";


export default function Orders() {
 const [storeDomain, setStoreDomain] = useState();
 const [shopId, setShopId] = useState(null);
 const [loading, setLoading] = useState(true);
 const navigate = useNavigate(); // Initialize useNavigate
 const [showToast, setShowToast] = useState(false);
 const [toastMessage, setToastMessage] = useState("");
 const [isSubscribed, setIsSubscribed] = useState(false);


 useEffect(() => {
   if (showToast) {
     setTimeout(() => {
       setShowToast(!showToast);
     }, 3000);
   }
 }, [showToast]);


 const [selectedTemplate, setSelectedTemplate] = useState(); // Default to template 1


 // Fetch the store domain
 useEffect(() => {
   // console.log("Fetching store details...");
   fetch("/api/2024-10/shop.json", {
     method: "GET",
     headers: { "Content-Type": "application/json" },
   })
     .then((response) => response.json())
     .then((data) => {
       // console.log("Store data fetched:", data.data.data[0]);
       if (data.data.data && data.data.data.length > 0) {
         // Access the domain from the correct property
         setStoreDomain(data.data.data[0].domain);
         setShopId(data.data.data[0].id);
         // console.log("Store domain set:", data.data.data[0].domain);
       }
       // console.log("store domain:", storeDomain)
     })
     .catch((error) => {
       // console.log("Error fetching store details:", error)
     });
   
 }, []);

 useEffect(() => {
  if(shopId)
  {fetch(`/api/fetch-store-profile?shopId=${shopId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data && data.profile) {
        const profileData = data.profile;
        // console.log("profileData", profileData);
        

  localStorage.setItem("planInfo", JSON.stringify(data.profile.plans));
  localStorage.setItem("proplan", JSON.stringify('1'));
  localStorage.setItem("businessplan", JSON.stringify('2'));

  const storedResponse = JSON.parse(localStorage.getItem("planInfo"));
  const proPlanResponse = JSON.parse(localStorage.getItem("proplan"));
  const businessPlanResponse = JSON.parse(localStorage.getItem("businessplan"));
  // console.log('storedResponse',storedResponse); 
  const currentPlanId = storedResponse.planId.toString();
  // Compare the numeric part with the plans
  if (currentPlanId === proPlanResponse || currentPlanId === businessPlanResponse) {
    setIsSubscribed(true);
    // console.log(
    //   "Current Plan:",
    //   proPlanResponse === currentPlanId ? `Pro: ${proPlanResponse}` : `Business: ${businessPlanResponse}`
    // );
  } else {
    setIsSubscribed(false);
  }
      }
    })
    .catch((error) => {
      console.error("Error fetching store profile:", error);
    });
  
  
  }

}, [shopId]);


 useEffect(() => {
   if (storeDomain) {
     fetch(`/api/get-invoice-template?storeDomain=${storeDomain}`)
       .then((response) => response.json())
       .then((data) => {
         if (data.storeInvoiceTemplate) {
           // console.log("Fetched template ID from DB:",  data.storeInvoiceTemplate);
           setSelectedTemplate(data.storeInvoiceTemplate); // Store template ID for comparison or other use
           setLoading(false);
         }
       })
       .catch((error) => console.error("Error fetching template ID:", error));
   }
 }, [storeDomain]);


 // Function to handle invoice template selection
 const handleSelectTemplate = (templateId) => {
   // console.log("Selected template:", templateId);
   if (storeDomain) {
     fetch("/api/update-invoice-template", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         storeDomain,
         invoiceTemplate: templateId,
       }),
     })
       .then((response) => response.json())
       .then((data) => {
         // console.log("API response for updating template:", data);
         setSelectedTemplate(data.storeInvoiceTemplate); // Update selected template state
         setShowToast(true);
         setToastMessage("Templated Selected");
       })
       .catch((error) => console.error("Error updating template:", error));
   } else {
     // console.log("Store domain not available; cannot update template");
   }
 };


 return (
   <>
     {loading ? (
       <div style={{ display: "flex", justifyContent: "center", marginTop: "200px" }}>
         <Spinner accessibilityLabel="Loading Spinner" size="large" />
       </div>
     ) : (
       <Page fullWidth>
         <TitleBar title="Invoice Templates" />


         <Layout>
           <div style={{ paddingTop: "20px", display: "flex", flexDirection: "column", gap: "10px", width: "90%" }}>
             {!isSubscribed && <UpgradeBanner msg={"Upgrade your plan to access and customized multiple templates."} buttonOn={true} />}
           </div>
           <p style={{ paddingTop: "20px", textAlign: "start", width: "90%", fontWeight: "600" }}>
             Available Invoice Templates
           </p>
           <div
               style={{
                 paddingTop: "10px",
                 display: "flex",
                 flexDirection: "column",
                 gap: "20px",
                 width: "90%",
                 opacity: isSubscribed ? "1" : "0.5", // Reduce opacity when disabled
                 pointerEvents: isSubscribed ? "auto" : "none", // Disable interaction when not subscribed
               }}
             >
                 <MediaCardExample2
               // imageSrc="assets/invoice.png"
               imageSrc={invoice1}
               title="Plain"
               // primaryAction=" Customize available soon.."
               secondaryAct={() => {
                 // console.log("Navigating to Customize Template Page");
                 navigate("/customizeTemplatePage", {
                   state: {
                     templateId: 1,
                   },
                 }); // Navigate to the CustomizeTemplatePage
               }}
               isSelected={selectedTemplate === "1"} // Set isSelected based on selectedTemplate
               onSelect={() => {
                 // console.log("Bold template select button clicked");
                 if (selectedTemplate !== "1") handleSelectTemplate("1");
               }}
               description="Make a statement without overwhelming your clients. Elegant invoice design."
             />
               <MediaCardExample2
                 imageSrc={invoice2}
                 title="Classic"
                 secondaryAct={() => {
                   if (isSubscribed) {
                     navigate("/customizeTemplatePage", {
                       state: {
                         templateId: 2,
                       },
                     });
                   }
                 }}
                 isSelected={selectedTemplate === "2"} // Set isSelected based on selectedTemplate
                 onSelect={() => {
                   if (isSubscribed && selectedTemplate !== "2") handleSelectTemplate("2");
                 }}
                 description="Our elegant invoice showcases a simple design."
               />
               <MediaCardExample2
                 imageSrc={invoice3}
                 title="Decent"
                 secondaryAct={() => {
                   if (isSubscribed) {
                     navigate("/customizeTemplatePage", {
                       state: {
                         templateId: 3,
                       },
                     });
                   }
                 }}
                 isSelected={selectedTemplate === "3"} // Set isSelected based on selectedTemplate
                 onSelect={() => {
                   if (isSubscribed && selectedTemplate !== "3") handleSelectTemplate("3");
                 }}
                 description="Designed for professionals, this sleek invoice exudes competence and confidence, leaving a lasting impression."
               />
             </div>
         </Layout>
         <FooterHelp style={{ marginTop: "40px" }}>
           Didn't find what you were looking for? Reach out to support at{" "}
           <Link url="mailto:support@delhidigital.co">support@delhidigital.co</Link>
         </FooterHelp>
         {showToast && (
           <div
             style={{
               position: "fixed",
               bottom: "20px",
               right: "20px",
               zIndex: 9999,
             }}
           >
             <ToastNotification message={toastMessage} duration={3000} />
           </div>
         )}
       </Page>
     )}
   </>
 );
}



