import React, { useEffect, useState, useCallback, use,useReducer } from "react";
import {
 Button,
 Icon,
 AlphaCard,
 Popover,
 ActionList,
 RangeSlider,
 Checkbox,
 Select,
 TextField,
 Spinner,
} from "@shopify/polaris";




import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


import { RiAlignItemLeftLine } from "react-icons/ri";
import { FaInbox } from "react-icons/fa";




import { FaArrowLeft } from "react-icons/fa";




import { FaMoneyBills } from "react-icons/fa6";
import { HiOutlineReceiptTax } from "react-icons/hi";




import { BiStore } from "react-icons/bi";
import { LiaShippingFastSolid } from "react-icons/lia";




import { CiImageOn, CiHome  } from "react-icons/ci";










import { InvoiceTemplate1 } from "../invoiceTemplates/invoice-template1";
import { InvoiceTemplate2 } from "../invoiceTemplates/invoice-template2";
import { InvoiceTemplate3 } from "../invoiceTemplates/invoice-template3";


export default function CustomizeTemplate() {
 const navigate = useNavigate(); // Initialize useNavigate
 const [selectedFont, setSelectedFont] = useState("Roboto, sans-serif");
 const [storeDomain, setStoreDomain] = useState(null);
 const [shopId, setshopId] = useState("");
 const [email, setEmail] = useState(null);
 const location = useLocation();
 const { state } = location;
 const [shopDetails, setShopDetails] = useState([]);
 const {templateId} = state ||{};
 const [CurrentTemplate, setCurrentTemplate] = useState();




 const [showBrandingAndStyle, setShowBrandingAndStyle] = useState(false);
 const [showOverview, setShowOverview] = useState(false);
 const [showSupplier, setShowSupplier] = useState(false);
 const [showShipping, setShowShipping] = useState(false);
 const [showBilling, setShowBilling] = useState(false);
 const [GSTHSNCodes, setGSTHSNCodes] = useState([]);
 const [shopProfile, setShopProfile] = useState({});
 const [showLineItems, setShowLineItems] = useState(false);
 const [showTotal, setShowTotal] = useState(false);
 const [showFooter, setShowFooter] = useState(false);
 const [loading, setLoading] = useState(true);
 const [isSaving, setIsSaving] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [showDropdown, setShowDropdown] = useState(false);






 const [InvoiceSetting2, setInvoiceSetting2] = useState({
   branding: {
     showLogo: true,
     showSignature: true,
     primaryColor: "#000000",
     fontFamily: "Roboto",
   },
   overview: {
     documentTitle: "Tax Invoice",
     showOrderId: true,
     showInvoiceNumber: true,
     showOrderIdBarcode: false,
     customizeInvoiceNumber: false,
     issueDate: true,
     showTaxReverseText: false,
     showTrackingCompany: false,
     showTrackingNo: false,
     showTrackingBarcode: false,
     addNote: "",
     showDeliveryMethod: false,
   },
   supplier: {
     heading: "Supplier",
     showSupplier: true,
     supplier: "",
     showHeading: true,
     showBusinessName: true,
     showAddress: true,
     showApartment: false,
     showCity: true,
     showVATNumber: false,
     showRegisteredNumber: false,
     showEmail: true,
     showPhone: true,
     showGSTIN: false,
   },
   shipping: {
     showShipping: true,
     heading: "Ship To",
     showHeading: true,
     showFullName: true,
     showAddress1: true,
     showAddress2: false,
     showCompany: true,
     showCity: true,
     showZipPinCode: true,
     showState: true,
     showCountry: true,
     showEmail: true,
     showPhone: true,
     showGSTIN: false,
   },
   billing: {
     showBilling: true,
     heading: "Bill To",
     showHeading: true,
     showFullName: true,
     showAddress1: true,
     showAddress2: false,
     showCompany: true,
     showCity: true,
     showZipPinCode: true,
     showState: true,
     showCountry: true,
     showEmail: true,
     showPhone: true,
     showGSTIN: false,
   },
   lineItems: {
     showProductImage: false,
     showSKU: true,
     showVariantTitle: true,
     showQuantity: true,
     showHSN: false,
     showUnitRate: true,
     showTotalDiscount: false,
     showRateAsDiscountedPrice: false,
     showTaxAmount: true,
     showTotalPrice: true,
   },
   total: {
     showDiscount: true,
     showSubtotal: true,
     showShipping: true,
     showShippingGSTSplit: false,
     showRefunded: false,
     showTax: true,
     showOutstanding: false,
     showTotal: true,
   },
   footer: {
     socialNetworks: {
       showWebsite: false,
       showFacebook: false,
       showTwitter: false,
       showInstagram: false,
       showPinterest: false,
       showYoutube: false,
     },
     thankYouNote: "Thanks for your purchase",
     footerNote: "This is an electronically generated invoice, no signature is required",
   },
 });


 const demoOrder = [
   {
     line_items: [
       {
         id: 14846286201061,
         admin_graphql_api_id: "gid://shopify/LineItem/14846286201061",
         attributed_staffs: [],
         current_quantity: 1,
         fulfillable_quantity: 1,
         fulfillment_service: "manual",
         fulfillment_status: null,
         gift_card: false,
         grams: 4536,
         name: "The Complete Snowboard - Dawn",
         price: "699.95",
         price_set: {
           shop_money: { amount: "699.95", currency_code: "INR" },
           presentment_money: { amount: "699.95", currency_code: "INR" },
         },
         product_exists: true,
         product_id: 8961257668837,
         properties: [],
         quantity: 1,
         requires_shipping: true,
         sku: null,
         taxable: true,
         title: "The Complete Snowboard",
         total_discount: "0.00",
         total_discount_set: {
           shop_money: { amount: "0.00", currency_code: "INR" },
           presentment_money: { amount: "0.00", currency_code: "INR" },
         },
         variant_id: 46199772774629,
         variant_inventory_management: "shopify",
         variant_title: "Dawn",
         vendor: "Snowboard Vendor",
         tax_lines: [
           {
             channel_liable: false,
             price: "125.99",
             price_set: {
               shop_money: { amount: "125.99", currency_code: "INR" },
               presentment_money: { amount: "125.99", currency_code: "INR" },
             },
             rate: 0.18,
             title: "IGST",
           },
         ],
         duties: [],
         discount_allocations: [],
       },
     ],
     app_id: 1354745,
     billing_address: {
       first_name: "Soyal",
       address1: "Shalimar Garden",
       phone: "+917535964612",
       city: "Ghaziabad",
       zip: "201005",
       province: "Uttar Pradesh",
       country: "India",
       last_name: "KHan",
       address2: "876",
       company: "Delhi Digital co",
       latitude: 28.6904801,
       longitude: 77.3360364,
       name: "Soyal KHan",
       country_code: "IN",
       province_code: "UP",
     },
     browser_ip: "49.36.183.197",
     buyer_accepts_marketing: false,
     cancel_reason: null,
     cancelled_at: null,
     cart_token: null,
     checkout_token: "240ebd377238b76b9958cd5cbb270dba",
     client_details: {
       accept_language: null,
       browser_height: null,
       browser_ip: "49.36.183.197",
       browser_width: null,
       session_hash: null,
       user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
     },
     closed_at: null,
     confirmation_number: "WNNRARG2U",
     created_at: "2025-01-14T14:28:45-05:00",
     currency: "INR",
     current_subtotal_price: "699.95",
     current_total_discounts: "0.00",
     current_total_price: "825.94",
     current_total_tax: "125.99",
     customer: {
       first_name: "Soyal",
       last_name: "Khan",
       email: "soyal@delhidigital.co",
       phone: "+917535964612",
       verified_email: true,
       default_address: {
         address1: "Shalimar Garden",
         city: "Ghaziabad",
         province: "Uttar Pradesh",
         zip: "201005",
         country: "India",
         phone: "+917535964612",
         name: "Soyal KHan",
       },
     },
     email: "soyal@delhidigital.co",
     financial_status: "paid",
     id: 6137511936229,
     name: "#1031",
     order_number: 1031,
     processed_at: "2025-01-14T14:28:44-05:00",
     shipping_address: {
       first_name: "Soyal",
       address1: "Shalimar Garden",
       phone: "+917535964612",
       city: "Ghaziabad",
       zip: "201005",
       province: "Uttar Pradesh",
       country: "India",
       last_name: "KHan",
       address2: "876",
       company: "Delhi Digital co",
     },
     subtotal_price: "699.95",
     tags: "",
     total_discounts: "0.00",
     total_line_items_price: "699.95",
     total_price: "825.94",
     total_tax: "125.99",
     total_weight: 4536,
     updated_at: "2025-01-14T14:28:46-05:00",
   },
 ];


 const demoGST = [
   { productId: "123456789", productName: "bottle", gst: "12", hsn: "456789" },
   { productId: "234567890", productName: "Gift Card", gst: "12", hsn: "8961257668837" },
   { productId: "345678901", productName: "Gift Card (Copy)", gst: "18", hsn: "8961257668837" },
   { productId: "456789012", productName: "lalal", gst: "76", hsn: "8961257668837" },
   { productId: "567890123", productName: "lalal (Copy)", gst: "56", hsn: "8961257668837" },
   { productId: "678901234", productName: "new products", gst: "676", hsn: "8961257668837" },
   { productId: "789012345", productName: "Random", gst: "76", hsn: "8961257668837" },
   { productId: "890123456", productName: "rq", gst: "56", hsn: "8961257668837" },
   { productId: "901234567", productName: "Selling Plans Ski Wax (Copy)", gst: "65", hsn: "8961257668837" },
   { productId: "1012345678", productName: "Selling Plans Ski Wax (Copy) (Copy)", gst: "45", hsn: "8961257668837" },
   { productId: "1123456789", productName: "Selling Plans Ski Wax (Copy) (Copy) (Copy)", gst: "8", hsn: "78765" },
   {
     productId: "1223456789",
     productName: "Selling Plans Ski Wax (Copy) (Copy) (Copy) (Copy)",
     gst: "7",
     hsn: "45678",
   },
   { productId: "1323456789", productName: "The 3ajsdhfb", gst: "6", hsn: "9876" },
   { productId: "1423456789", productName: "The 3p Fulfilled Snowboard", gst: "5", hsn: "9876" },
   { productId: "1523456789", productName: "The 3p Fulfilled Snowboard (Copy)", gst: "4", hsn: "9876" },
   { productId: "1623456789", productName: "The Archived Snowboard", gst: "6", hsn: "456" },
   { productId: "1723456789", productName: "The Collection Snowboard: Hydrogen", gst: "5", hsn: "345678" },
   { productId: "1823456789", productName: "The Collection Snowboard: Liquid", gst: "8", hsn: "6666666" },
   { productId: "1923456789", productName: "The Collection Snowboard: Oxygen", gst: "5", hsn: "987654" },
   { productId: "2023456789", productName: "The Compare at Price Snowboard", gst: "8", hsn: "65432" },
   { productId: "2123456789", productName: "The Complete Snowboard", gst: "8", hsn: "5432" },
   { productId: "2223456789", productName: "The Draft Snowboard", gst: "5", hsn: "876543" },
   { productId: "2323456789", productName: "The Hidden Snowboard", gst: "4", hsn: "i765432" },
   { productId: "2423456789", productName: "The Inventory Not Tracked Snowboard", gst: "8", hsn: "23456789" },
   { productId: "2523456789", productName: "The Multi-location Snowboard", gst: "4", hsn: "345678" },
   { productId: "2623456789", productName: "The Multi-managed Snowboard", gst: "8", hsn: "87878" },
   { productId: "2723456789", productName: "The Out of Stock Snowboard", gst: "8", hsn: "565655" },
   { productId: "2823456789", productName: "The Videographer Snowboard", gst: "8", hsn: "34343" },
   { productId: "2923456789", productName: "very new", gst: "8", hsn: "878787" },
 ];


 const styles = {
   header: {
     display: "flex",
     alignItems: "center",
     justifyContent: "space-between",
     padding: "20px",
     borderBottom: "1px solid #dcdcde",
     backgroundColor: "#f6f6f7",
   },
   titleSection: {
     display: "flex",
     alignItems: "center",
     gap: "10px",
     fontSize: "16px",
     fontWeight: "600",
   },
   buttonSection: {
     display: "flex",
     alignItems: "center",
     gap: "10px",
   },
   container: {
     display: "grid",
     gridTemplateColumns: "1fr 2fr",
     gap: "20px",
     padding: "20px",
     backgroundColor: "#f6f6f7",
   },
   alphaCardCustomize: {
     borderRadius: "12px",
     padding: "20px",
     height: "fit-content",
     backgroundColor: "#ffffff",
   },
   alphaCardPreview: {
     borderRadius: "12px",
     padding: "20px",
     alignItems: "center",
     backgroundColor: "#ffffff",
   },
   sidebarTitle: {
     display: "grid",
     gridTemplateColumns: "1fr 6fr",
     fontSize: "16px",
     fontWeight: "600",
     paddingLeft: "0px",
     marginBottom: "20px",
   },
   menuItem: {
     display: "flex",
     alignItems: "center",
     justifyContent: "space-between",
     padding: "10px 1px",
     borderRadius: "5px",
     cursor: "pointer",
     transition: "background-color 0.2s",
     fontSize: "14px",
     fontWeight: "500",
   },
   menuItemHover: {
     backgroundColor: "#f1f3f5",
   },
   menuText: {
     display: "flex",
     alignItems: "center",
     gap: "10px",
   },


   previewContainer: {
     // border: "1px solid #dcdcde",
     // borderRadius: "8px",
     overflow: "hidden",
     display: "inline-flex", // Changed to "inline-flex" for child-based sizing
     justifyContent: "center",
     alignItems: "center",
     // boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
     // backgroundColor: "#f9fafb",
     width: "fit-content", // Automatically adjust width based on child content
     height: "fit-content", // Automatically adjust height based on child content
     // padding: "px", // Optional: Add padding to maintain spacing around content
   },


   button: {
     width: "120px",
     textAlign: "center",
   },
   colorOption: {
     display: "flex",
     alignItems: "center",
     padding: "10px",
     cursor: "pointer",
     borderRadius: "8px",
     transition: "background-color 0.3s",
   },
   colorOptionSelected: {
     backgroundColor: "#f1f3f5",
   },
   colorCircle: {
     width: "20px",
     height: "20px",
     borderRadius: "50%",
     marginRight: "10px",
   },
   colorLabel: {
     fontSize: "14px",
     fontWeight: "500",
   },
   dropdownContainer: {
     position: "relative",
     marginTop: "10px",
   },
   dropdownButton: {
     display: "flex",
     justifyContent: "space-between",
     alignItems: "center",
     padding: "10px",
     border: "1px solid #dcdcde",
     borderRadius: "10px",
     cursor: "pointer",
     backgroundColor: "#ffffff",
   },
   dropdownList: {
     position: "absolute",
     top: "72%", // Makes the list appear above the dropdown button
     left: "9%",
     backgroundColor: "#ffffff",
     border: "1px solid #dcdcde",
     borderRadius: "10px",
     boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
     zIndex: 9999,
     maxHeight: "200px",
     overflowY: "auto",
     minWidth: "240px", // Ensures dropdown has a default width
     padding: "10px 0", // Adds spacing within the dropdown for content
   },


   dropdownItem: {
     padding: "10px",
     cursor: "pointer",
     transition: "background-color 0.2s",
   },
   dropdownItemHover: {
     backgroundColor: "#f6f6f7",
   },
   dropdownItemSelected: {
     fontWeight: "bold",
   },
   // sidebarTitle: {
   //     display: "flex",
   //     alignItems: "center",
   //     gap: "10px",
   //     fontSize: "16px",
   //     fontWeight: "600",
   //     marginBottom: "20px",
   //   },
   //   menuItem: {
   //     display: "flex",
   //     alignItems: "center",
   //     justifyContent: "space-between",
   //     padding: "10px 15px",
   //     borderRadius: "5px",
   //     cursor: "pointer",
   //     transition: "background-color 0.2s",
   //     fontSize: "14px",
   //     fontWeight: "500",
   //   },
   //   menuItemHover: {
   //     backgroundColor: "#f1f3f5",
   //   },
   //   menuText: {
   //     display: "flex",
   //     alignItems: "center",
   //     gap: "10px",
   //   },
   sectionTitle: {
     fontWeight: "bold",
     margin: "20px 0 10px",
   },
 };


 const useForceUpdate = () => useReducer(() => ({}), {})[1];
 const forceUpdate = useForceUpdate();


 const updateInvoiceSetting2 = (section, key, value) => {
   setInvoiceSetting2((prevSettings) => ({
     ...prevSettings,
     [section]: {
       ...prevSettings[section],
       [key]: value, // Dynamically update the key-value pair in the specified section
     },
   }));
 };


 const updateSocialNetworkSetting = (key, value) => {
   setInvoiceSetting2((prevSettings) => ({
     ...prevSettings,
     footer: {
       ...prevSettings.footer,
       socialNetworks: {
         ...prevSettings.footer.socialNetworks,
         [key]: value, // Only update the specific social network key
       },
     },
   }));
 };


 // const handleSupplierCheckboxChange = (key) => {
 //   setSupplierSettings((prev) => ({
 //     ...prev,
 //     [key]: !prev[key],
 //   }));
 // };


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
         setShopDetails(response.data.data[0]);
         if (shopDetails.length > 0) {
           // console.log("shopDetails", shopDetails);
         }
         setStoreDomain(response.data.data[0].domain);
         setEmail(response.data.data[0].email);
         setshopId(response.data.data[0].id);
       }
     })
     .catch((error) => console.log(error));
 }, []);


 useEffect(() => {
   fetch(`/api/fetch-store-profile?shopId=${shopId}`, {
     method: "GET",
     headers: { "Content-Type": "application/json" },
   })
     .then((response) => response.json())
     .then((data) => {
       if (data && data.profile) {
         if (data && data.profile) {
           const profileData = data.profile;
           console.log("profileData", profileData);
           setShopProfile(profileData || {});
         }
         // console.log("Shop Profile Data",data.profile );


     //     const newCustomColor = data?.profile?.storeProfile?.brandColor || "#ff6600"; // Example custom color from API


     //     console.log('newCustomColor', newCustomColor); 
     // // Update the Custom color directly
     // const customOption = colorOptions.find((option) => option.value === "Custom");
     // console.log('customOption', customOption); 
     // if (customOption) customOption.color = newCustomColor;
    


     // forceUpdate(); // Force re-render after updating color
       }
     })
     .catch((error) => {
       console.error("Error fetching store profile:", error);
     });
 }, [shopId]);




 useEffect(() => {
   if (storeDomain) {
     fetch(`/api/get-invoice-template?storeDomain=${storeDomain}`)
       .then((response) => response.json())
       .then((data) => {
         if (data.storeInvoiceTemplate) {
           // setCurrentTemplate(data.storeInvoiceTemplate);
           //console.log("Current Template ID:", currentTemplateId);
           if(templateId){
             setCurrentTemplate(templateId);
           }else{
             setCurrentTemplate(data.storeInvoiceTemplate);
            
           }
         }
       })
       .catch((error) => console.error("Error fetching template ID:", error));
   }


  
 }, [storeDomain]);
 // console.log("templateId", templateId);


 const fetchInvoiceSettings = async () => {
   // console.log("Sending request to fetch invoice settings");


   return fetch("/api/fetch-invoice-settings", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ email: email, storeDomain: storeDomain }), // Replace with actual data
   })
     .then(async (response) => {
       if (!response.ok) {
         return response.text().then((errorText) => {
           throw new Error(errorText || `HTTP error! Status: ${response.status}`);
         });
       }
       return response.json();
     })
     .then((data) => {
       // setInvoiceSettings(data);
       const settings = data;
       console.log("Received response:", settings);
       // console.log("Received response:", JSON.stringify(settings));
       if (settings) {
         setInvoiceSetting2((prevState) => ({
           ...prevState,
           ...settings,
         }));


         console.log('settings.branding.fontFamily', settings.branding.fontFamily);
         const matchedFont = fontOptions.find(
           (font) => font.fontFamily === settings.branding.fontFamily
         );
         if (matchedFont) {
           setSelectedFont(matchedFont); // Set the label as selected font
         } else {
           setSelectedFont("Roboto, sans-serif"); // Default fallback
         }
         setLoading(false);
       }
     })
     .catch((error) => {
       console.error("Error fetching invoice settings:", error.message);
     });
 };




 useEffect(() => {
   if (storeDomain && email) {
     fetchInvoiceSettings();
   }
 }, [storeDomain, email]);


 // const fetchGSTHSNValues = async () => {
 //   try {
 //     if (!storeDomain || !email) {
 //       console.error("Missing storeDomain or email:", {
 //         storeDomain,
 //         email: email,
 //       });
 //       throw new Error("Invalid storeDomain or email.");
 //     }


 //     const url = `/api/products/gsthsn?storeDomain=${encodeURIComponent(
 //       storeDomain
 //     )}&email=${encodeURIComponent(email)}`;
 //     console.log("Fetching GST HSN Values with URL:", url);


 //     const response = await fetch(url);


 //     if (!response.ok) {
 //       throw new Error(
 //         `Failed to fetch GST values. Status: ${response.status}`
 //       );
 //     }


 //     const data = await response.json();
 //     console.log("Fetched GST Values:", data.gstValues);


 //     setGSTHSNCodes(data.gstValues);
 //   } catch (error) {
 //     console.error("Error fetching GST values:", error);
 //   }
 // };
 // Example usage:
 const handleShowToast = (message, isError) => {
   // console.log(`${isError ? "Error" : "Info"}: ${message}`);
 };


 useEffect(() => {
   // console.log("Invoice Settings", InvoiceSetting2);
 }, [InvoiceSetting2]);


 const updateInvoiceSettingAPI = async () => {
   // console.log({
   //   email: email,
   //   storeDomain: storeDomain,
   //   updatedSettings: invoiceSettings,
   // });
   // const updatedSettings = invoiceSettings;
   setIsSaving(true);
   return fetch("/api/update-invoice-settings", {
     method: "PUT",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       email: email,
       storeDomain: storeDomain,
       updatedSettings: InvoiceSetting2,
     }), // Replace with actual data
   })
     .then(async (response) => {
       if (!response.ok) {
         return response.text().then((errorText) => {
           throw new Error(errorText || `HTTP error! Status: ${response.status}`);
         });
       }
       return response.json();
     })
     .then((data) => {
       // setInvoiceSettings(data);
       const updateSettings = data;
       // console.log("Received updated response:", updateSettings);
       // navigate(-1);
       if (storeDomain && email) {
         fetchInvoiceSettings();
       }
       setIsSaving(false);
     })
     .catch((error) => {
       console.error("Error updating invoice settings:", error.message);
       setIsSaving(false);
     });
 };


 const renderInvoiceTemplate = (currentTemplate, shopdetails, order, gstcodes, shopProfile) => {
   switch (currentTemplate) {
     case 1:
       return (
         <InvoiceTemplate1
           shopdetails={[shopdetails]}
           orders={[order]}
           invoiceSettings={InvoiceSetting2}
           GSTHSNCodes={{ gstcodes }}
           shopProfile={shopProfile}
         />
       );
     case 2:
       return (
         <InvoiceTemplate2
           shopdetails={[shopdetails]}
           orders={[order]}
           invoiceSettings={InvoiceSetting2}
           GSTHSNCodes={{ gstcodes }}
           shopProfile={shopProfile}
         />
       );
     case 3:
       return (
         <InvoiceTemplate3
           shopdetails={[shopdetails]}
           orders={[order]}
           invoiceSettings={InvoiceSetting2}
           GSTHSNCodes={{ gstcodes }}
           shopProfile={shopProfile}
         />
       );
     default:
       console.error("Invalid template ID:", currentTemplate);
       return null; // Return null if no valid template is found
   }
 };


  const colorOptions = [
   { label: "Gray", value: "Gray", color: "#535151" },
   { label: "Black", value: "Black", color: "#000000" },
   { label: "Purple", value: "Purple", color: "#800080" },
   { label: "Dark Green", value: "Dark Green", color: "#006400" },
   { label: "Dark Blue", value: "Dark Blue", color: "#00008b" },
   { label: "Navy Blue", value: "Navy Blue", color: "#001f3f" },
   // { label: "Custom", value: "Custom", color: "#0f0" },
 ];






const menuItems = [
 {
   icon: <CiImageOn />,
   label: "Branding and Style",
   onClick: () => setShowBrandingAndStyle(true),
 },
 {
   icon: <CiHome />,
   label: "Overview",
   onClick: () => setShowOverview(true),
 },




 {
   icon: <BiStore/>,
   label: "Supplier",
   onClick: () => setShowSupplier(true),
 },
 {
   icon: <LiaShippingFastSolid/>,
   label: "Shipping",
   onClick: () => setShowShipping(true),
 },
 {
   icon: <FaMoneyBills/>,
   label: "Billing",
   onClick: () => setShowBilling(true),
 },
 {
   icon: <RiAlignItemLeftLine />
   ,
   label: "Line items",
   onClick: () => setShowLineItems(true),
 },
 // {
 //   icon: TextMajor,
 //   label: "Additional text",
 //   onClick: () => setShowAdditionalText(true),
 // },
 { icon: <HiOutlineReceiptTax/>,
   label: "Total", onClick: () => setShowTotal(true) },
 { icon: <FaInbox />
   , label: "Other", onClick: () => setShowFooter(true) },
];






 const handleColorSelect = (value) => {
   updateInvoiceSetting2("branding", "primaryColor", value);
   // console.log(
   // "invoiceSettings.branding.primaryColor",
   // invoiceSettings.branding.primaryColor
   // );
   // setPrimaryColor(value);
 };


 const fontOptions = [
   {
     label: "Roboto",
     preview: "Almost before we knew it.",
     fontFamily: "Roboto, sans-serif", // Clean, modern sans-serif
   },
   {
     label: "Merriweather",
     preview: "Almost before we knew it.",
     fontFamily: "Merriweather, serif", // Classic, formal serif font
   },


   {
     label: "Fira Code",
     preview: "Almost before we knew it.",
     fontFamily: "Fira Code, monospace", // Excellent for code-like styling
   },
   {
     label: "Montserrat",
     preview: "Almost before we knew it.",
     fontFamily: "Montserrat, sans-serif", // Clean and modern styling
   }
  
 ];


 const handleFontSelect = (font) => {
   setSelectedFont(font); // Set selected font label
   updateInvoiceSetting2("branding", "fontFamily", font.fontFamily); // Update font in branding
   setShowDropdown(false);
 };


 return (
   <div
     style={{
       paddingLeft: "50px",
       paddingRight: "50px",
       backgroundColor: "#f6f6f7",
       height: "100vh",
     }}
   >
     {" "}
     {/* Added padding */}
     <div style={styles.header}>
       <div style={styles.titleSection}>
         <div
           style={{
             cursor: "pointer", // Changes the cursor to a pointer
             display: "flex", // Ensures proper alignment
             alignItems: "center",
             justifyContent: "center",
             width: "24px", // Defines a clickable area
             height: "24px",
           }}
           onClick={() => {
             // console.log("Back button clicked");
             navigate(-1);
           }}
         >
           <FaArrowLeft/>
         </div>
         <span>Customize template</span>
       </div>


       <div style={styles.buttonSection}>
         {/* <Popover
           active={popoverActive}
           activator={
             <Button onClick={togglePopoverActive}>Actions</Button>
           }
           onClose={togglePopoverActive}
         >
           <ActionList
             items={[
               { content: 'Action 1' },
               { content: 'Action 2' },
             ]}
           />
         </Popover> */}
         <Button primary onClick={() => updateInvoiceSettingAPI()} disabled={isSaving}>
           {isSaving ? "Saving..." : "Save Template"}
         </Button>
       </div>
     </div>
     <div style={styles.container}>
       <div>
         <AlphaCard style={styles.alphaCardCustomize}>
           {showBrandingAndStyle ? (
             <div>
               <div style={styles.sidebarTitle}>
                 <div
                   style={{
                     cursor: "pointer", // Ensure the cursor changes to a pointer on hover
                     display: "flex", // Flex for alignment
                     alignItems: "center",
                     justifyContent: "center",
                     width: "24px", // Set a clickable area
                     height: "24px",
                   }}
                   onClick={() => {
                     // console.log("Back arrow clicked");
                     setShowBrandingAndStyle(false);
                   }}
                 >
                   <FaArrowLeft/>
                 </div>


                 <span>Branding and Style</span>
               </div>
               {showDropdown && (
                 <div
                   style={{
                     ...styles.dropdownList,
                   }}
                 >
                   {fontOptions.map((font) => (
                     <div
                       key={font.label}
                       style={{
                         fontFamily: font.fontFamily,
                         backgroundColor: selectedFont === font ? "#ddd" : "#fff",
                         padding: "8px 12px",
                         // border: "1px solid #ccc",
                         marginBottom: "5px",
                         cursor: "pointer",
                       }}
                       onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f6f6f7")}
                       onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                       onClick={() => handleFontSelect(font)}
                     >
                       <div>
                         <strong>{font.label}</strong>
                         <p
                           style={{
                             margin: 0,
                             fontFamily: font.fontFamily,
                             fontSize: "14px",
                             color: "#666666",
                           }}
                         >
                           {font.preview}
                         </p>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
               <div>
               <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between",  gap: "10px"}}>
 <Checkbox
   label="Show logo"
   checked={InvoiceSetting2.branding.showLogo} // Bind the state to the checkbox
   onChange={(newChecked) => updateInvoiceSetting2("branding", "showLogo", newChecked)} // Update state on change
 />
 <Checkbox
   label="Show Signature"
   checked={InvoiceSetting2.branding.showSignature} // Bind the state to the checkbox
   onChange={(newChecked) => updateInvoiceSetting2("branding", "showSignature", newChecked)} // Update state on change
 />
</div>


                 {/* <p style={{ margin: "10px 0", fontWeight: "bold" }}>
                   Logo size
                 </p>
                 <RangeSlider
                   min={0}
                   max={100}
                   value={logoSize}
                   onChange={(value) => setLogoSize(value)}
                 />
                 <p style={{ marginTop: "10px" }}>{logoSize}px</p> */}


                 <p style={{ margin: "10px 0", fontWeight: "bold" }}>Primary color</p>
                 <hr />
                 <div>
                   {colorOptions.map((option) => (
                     <div
                       key={option.value}
                       style={{
                         ...styles.colorOption,
                         ...(InvoiceSetting2.branding.primaryColor === option.color ? styles.colorOptionSelected : {}),
                       }}
                       onClick={() => handleColorSelect(option.color)}
                     >
                       <div
                         style={{
                           ...styles.colorCircle,
                           backgroundColor: option.color,
                         }}
                       ></div>
                       <span style={styles.colorLabel}>{option.label}</span>
                     </div>
                   ))}
                 </div>
                 <p style={{ margin: "10px 0", fontWeight: "bold" }}>Header</p>


                 <hr />
                 <p style={{ margin: "10px 0" }}>Font Family</p>
                 <div style={styles.dropdownContainer}>
                   <div style={styles.dropdownButton} onClick={() => setShowDropdown((prev) => !prev)}>
                     {selectedFont.label}
                     <span>▼</span>
                   </div>


                   {/* <p style={{ marginTop: "20px" }}>Font size</p>
                   <RangeSlider
                     min={10}
                     max={20}
                     value={fontSize}
                     onChange={(value) => setFontSize(value)}
                   />
                   <p style={{ marginTop: "10px" }}>{fontSize}px</p> */}
                 </div>
               </div>
             </div>
           ) : showOverview ? (
             <div>
               <div style={styles.sidebarTitle}>
                 <div
                   style={{
                     cursor: "pointer", // Ensure the cursor changes to a pointer on hover
                     display: "flex", // Flex for alignment
                     alignItems: "center",
                     justifyContent: "center",
                     width: "24px", // Set a clickable area
                     height: "24px",
                   }}
                   onClick={() => {
                     // console.log("Back arrow clicked");
                     setShowOverview(false);
                   }}
                 >
                   <FaArrowLeft/>
                 </div>


                 <span>Overview</span>
               </div>
               <div>
                 <strong style={{ marginBottom: "10px" }}>Document title</strong>


                 <div
                   style={{
                     marginTop: "10px",
                     display: "flex",
                     flexDirection: "column", // Align items vertically
                     gap: "10px", // Add spacing between items
                   }}
                 >
                   {Object.keys(InvoiceSetting2.overview)
                     .filter(
                       (key) =>
                         ![
                           "addNote",
                           "showDeliveryMethod",
                           "customizeInvoiceNumber",
                           "showOrderIdBarcode",
                           "showTrackingBarcode",
                           "showTrackingCompany",
                           "showTrackingNo",
                           "showTaxReverseText",
                           "showOrderId",
                         ].includes(key)
                     ) // Filter out unwanted fields
                     .map((key) =>
                       typeof InvoiceSetting2.overview[key] === "boolean" ? (
                         <Checkbox
                           key={key}
                           label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                           checked={InvoiceSetting2.overview[key]}
                           onChange={() => updateInvoiceSetting2("overview", key, !InvoiceSetting2.overview[key])}
                         />
                       ) : (
                         <TextField
                           key={key}
                           value={InvoiceSetting2.overview[key]}
                           onChange={(value) => updateInvoiceSetting2("overview", key, value)}
                           placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                         />
                       )
                     )}
                 </div>
               </div>
             </div>
           ) : showSupplier ? (
             <div>
               <div style={styles.sidebarTitle}>
                 <div
                   style={{
                     cursor: "pointer", // Pointer for hover effect
                     display: "flex", // Flex for alignment
                     alignItems: "center",
                     justifyContent: "center",
                     width: "24px", // Clickable area
                     height: "24px",
                   }}
                   onClick={() => {
                     // console.log("Back arrow clicked");
                     setShowSupplier(false);
                   }}
                 >
                   <FaArrowLeft/>
                 </div>
                 <span>Supplier</span>
               </div>
               <div>
                 <div
                   style={{
                     marginTop: "10px",
                     display: "flex",
                     flexDirection: "column", // Align items vertically
                     gap: "10px", // Add spacing between items
                   }}
                 >
                   {Object.keys(InvoiceSetting2.supplier)
                     .filter(
                       (key) =>
                         ![
                           "showApartment",
                           "showBusinessName",
                           "showRegisteredNumber",
                           "showVATNumber",
                           "supplier",
                         ].includes(key)
                     ) // Filter out unwanted fields
                     .map((key) =>
                       typeof InvoiceSetting2.supplier[key] === "boolean" ? (
                         <Checkbox
                           key={key}
                           label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                           checked={InvoiceSetting2.supplier[key]}
                           onChange={() => updateInvoiceSetting2("supplier", key, !InvoiceSetting2.supplier[key])}
                         />
                       ) : (
                         <>
                           <strong style={{ marginBottom: "0px" }}>Heading</strong>
                           <TextField
                             key={key}
                             value={InvoiceSetting2.supplier[key]}
                             onChange={(value) => updateInvoiceSetting2("supplier", key, value)}
                             placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                           />
                         </>
                       )
                     )}
                 </div>
               </div>
             </div>
           ) : showShipping ? (
             <div>
               <div style={styles.sidebarTitle}>
                 <div
                   style={{
                     cursor: "pointer", // Pointer for hover effect
                     display: "flex", // Flex for alignment
                     alignItems: "center",
                     justifyContent: "center",
                     width: "24px", // Clickable area
                     height: "24px",
                   }}
                   onClick={() => {
                     // console.log("Back arrow clicked");
                     setShowShipping(false);
                   }}
                 >
                   <FaArrowLeft/>
                 </div>
                 <span>Shipping</span>
               </div>
               <div>
                 <div
                   style={{
                     marginTop: "20px",
                     display: "flex",
                     flexDirection: "column", // Align items vertically
                     gap: "10px", // Add spacing between items
                   }}
                 >
                   {Object.keys(InvoiceSetting2.shipping)
                     .filter((key) => !["showAddress2", "showGSTIN"].includes(key)) // Filter out unwanted fields
                     .map((key) =>
                       typeof InvoiceSetting2.shipping[key] === "boolean" ? (
                         <Checkbox
                           key={key}
                           label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                           checked={InvoiceSetting2.shipping[key]}
                           onChange={() => updateInvoiceSetting2("shipping", key, !InvoiceSetting2.shipping[key])}
                         />
                       ) : (
                         <>
                           <strong style={{ marginBottom: "0px" }}>Heading</strong>
                           <TextField
                             key={key}
                             value={InvoiceSetting2.shipping[key]}
                             onChange={(value) => updateInvoiceSetting2("shipping", key, value)}
                             placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                           />
                         </>
                       )
                     )}
                 </div>
               </div>
             </div>
           ) : showBilling ? (
             <div>
               <div style={styles.sidebarTitle}>
                 <div
                   style={{
                     cursor: "pointer", // Pointer for hover effect
                     display: "flex", // Flex for alignment
                     alignItems: "center",
                     justifyContent: "center",
                     width: "24px", // Clickable area
                     height: "24px",
                   }}
                   onClick={() => {
                     // console.log("Back arrow clicked");
                     setShowBilling(false);
                   }}
                 >
                   <FaArrowLeft/>
                 </div>
                 <span>Billing</span>
               </div>
               <div>
                 <div
                   style={{
                     marginTop: "20px",
                     display: "flex",
                     flexDirection: "column", // Align items vertically
                     gap: "10px", // Add spacing between items
                   }}
                 >
                   {Object.keys(InvoiceSetting2.billing)
                     .filter((key) => !["showAddress2", "showGSTIN"].includes(key)) // Filter out unwanted fields
                     .map((key) =>
                       typeof InvoiceSetting2.billing[key] === "boolean" ? (
                         <Checkbox
                           key={key}
                           label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                           checked={InvoiceSetting2.billing[key]}
                           onChange={() => updateInvoiceSetting2("billing", key, !InvoiceSetting2.billing[key])}
                         />
                       ) : (
                         <>
                           <strong style={{ marginBottom: "0px" }}>Heading</strong>
                           <TextField
                             key={key}
                             value={InvoiceSetting2.billing[key]}
                             onChange={(value) => updateInvoiceSetting2("billing", key, value)}
                             placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                           />
                         </>
                       )
                     )}
                 </div>
               </div>
             </div>
           ) : showLineItems ? (
             <div>
               <div style={styles.sidebarTitle}>
                 <div
                   style={{
                     cursor: "pointer",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     width: "24px",
                     height: "24px",
                   }}
                   onClick={() => {
                     // console.log("Back arrow clicked");
                     setShowLineItems(false);
                   }}
                 >
                   <FaArrowLeft/>
                 </div>
                 <span>Line items</span>
               </div>
               <div>
                 <p style={{ marginBottom: "10px", fontWeight: "bold" }}>General</p>
                 <div
                   style={{
                     marginTop: "10px",
                     display: "flex",
                     flexDirection: "column",
                     gap: "10px",
                   }}
                 >
                   {Object.keys(InvoiceSetting2.lineItems)
                     .filter(
                       (key) =>
                         !["showProductImage", "showRateAsDiscountedPrice", "showSKU", "showTotalDiscount"].includes(
                           key
                         )
                     ) // Filter out unwanted fields
                     .map((key) =>
                       typeof InvoiceSetting2.lineItems[key] === "boolean" ? (
                         <Checkbox
                           key={key}
                           label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                           checked={InvoiceSetting2.lineItems[key]}
                           onChange={() => updateInvoiceSetting2("lineItems", key, !InvoiceSetting2.lineItems[key])}
                         />
                       ) : (
                         <>
                           <strong style={{ marginBottom: "0px" }}>Heading</strong>
                           <TextField
                             key={key}
                             value={InvoiceSetting2.lineItems[key]}
                             onChange={(value) => updateInvoiceSetting2("lineItems", key, value)}
                             placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                           />
                         </>
                       )
                     )}
                 </div>
               </div>
             </div>
           ) : showTotal ? (
             <div>
               <div style={styles.sidebarTitle}>
                 <div
                   style={{
                     cursor: "pointer",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     width: "24px",
                     height: "24px",
                   }}
                   onClick={() => {
                     // console.log("Back arrow clicked");
                     setShowTotal(false);
                   }}
                 >
                   <FaArrowLeft/>
                 </div>
                 <span>Total</span>
               </div>
               <div>
                 <div
                   style={{
                     marginTop: "20px",
                     display: "flex",
                     flexDirection: "column",
                     gap: "10px",
                   }}
                 >
                   {Object.keys(InvoiceSetting2.total)
                     .filter(
                       (key) =>
                         ![
                           "showShippingGSTSplit",
                           "showShipping",
                           "showRefunded",
                           "showOutstanding",
                           "showDiscount",
                         ].includes(key)
                     ) // Filter out unwanted fields
                     .map((key) =>
                       typeof InvoiceSetting2.total[key] === "boolean" ? (
                         <Checkbox
                           key={key}
                           label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                           checked={InvoiceSetting2.total[key]}
                           onChange={() => updateInvoiceSetting2("total", key, !InvoiceSetting2.total[key])}
                         />
                       ) : (
                         <>
                           <strong style={{ marginBottom: "0px" }}>Heading</strong>
                           <TextField
                             key={key}
                             value={InvoiceSetting2.total[key]}
                             onChange={(value) => updateInvoiceSetting2("total", key, value)}
                             placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                           />
                         </>
                       )
                     )}
                 </div>
                 {/* <p style={{ margin: "20px 0", fontWeight: "bold" }}>
                   Table note
                 </p>
                 <TextField
                   value={tableNote}
                   onChange={(value) => setTableNote(value)}
                   placeholder="Eg. All prices will be calculated in INR"
                 /> */}
               </div>
             </div>
           ) : showFooter ? (
             <div>
               <div style={styles.sidebarTitle}>
                 <div
                   style={{
                     cursor: "pointer",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     width: "24px",
                     height: "24px",
                   }}
                   onClick={() => setShowFooter(false)}
                 >
                   <FaArrowLeft/>
                 </div>
                 <span>Others</span>
               </div>
               <div>
                 <p style={{ marginBottom: "10px" }}>
                 To display your signature and update social media <strong>links</strong>, please visit the{" "}
                   <a href="/settings" style={{ color: "#0070f3", textDecoration: "underline" }}>
                    Profile settings
                   </a>
                 </p>
                


                 <div>
                   <div
                     style={{
                       marginTop: "20px",
                       display: "flex",
                       flexDirection: "column",
                       gap: "10px",
                     }}
                   >
                     {Object.keys(InvoiceSetting2.footer.socialNetworks)
                       .filter((key) => !["showWebsite"].includes(key)) // Filter out unwanted fields
                       .map((key) =>
                         typeof InvoiceSetting2.footer.socialNetworks[key] === "boolean" ? (
                           <Checkbox
                             key={key}
                             label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                             checked={InvoiceSetting2.footer.socialNetworks[key]}
                             onChange={() =>
                               updateSocialNetworkSetting(key, !InvoiceSetting2.footer.socialNetworks[key])
                             }
                           />
                         ) : (
                           <>
                             <strong style={{ marginBottom: "0px" }}>Heading</strong>
                             <TextField
                               key={key}
                               value={InvoiceSetting2.footer.socialNetworks[key]}
                               onChange={(value) => updateSocialNetworkSetting(key, value)}
                               placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                             />
                           </>
                         )
                       )}
                   </div>
                   {/* <p style={{ margin: "20px 0", fontWeight: "bold" }}>
                   Table note
                 </p>
                 <TextField
                   value={tableNote}
                   onChange={(value) => setTableNote(value)}
                   placeholder="Eg. All prices will be calculated in INR"
                 /> */}
                 </div>


                 <p style={{ marginTop: "20px", fontWeight: "bold" }}>Thank you note</p>
                 <TextField
                   multiline={4}
                   maxLength={1000}
                   value={InvoiceSetting2.footer.thankYouNote}
                   onChange={(value) => updateInvoiceSetting2("footer", "thankYouNote", value)}
                   placeholder="Enter your thank you note"
                 />


                 <p style={{ marginTop: "20px", fontWeight: "bold" }}>Customer note</p>
                 <TextField
                   multiline={4}
                   maxLength={1000}
                   value={InvoiceSetting2.footer.footerNote}
                   onChange={(value) => updateInvoiceSetting2("footer", "footerNote", value)}
                   placeholder="Enter footer note"
                 />
               </div>
             </div>
           ) : (
             <div>
               <div style={styles.sidebarTitle}>Customize</div>
               <div>
                 {menuItems.map((item, index) => (
                   <div
                     key={index}
                     style={styles.menuItem}
                     onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f3f5")}
                     onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                     onClick={item.onClick}
                   >
                     <div style={styles.menuText}>
                       {/* Render the icon */}
                       {item.icon}
                       {item.label}
                     </div>
                     <span>›</span>
                   </div>
                 ))}
               </div>
             </div>
           )}
         </AlphaCard>
       </div>


       <div style={{ display: "flex", justifyContent: "center" }}>
         <AlphaCard style={styles.alphaCardPreview}>
           <div style={styles.sidebarTitle}>Preview</div>
           {loading ? (
             <div style={{ display: "flex", justifyContent: "center", marginTop: "150px" }}>
               <Spinner accessibilityLabel="Loading Spinner" size="large" />
             </div>
           ) : (
             <div style={styles.previewContainer}>
               {/* <span>Template preview</span> */}
               <div
                 style={{
                   padding: "0px",
                   overflowY: "auto",
                   overflowX: "auto",
                   maxHeight: "100%",
                 }}
               >
                 {(shopDetails.id && <>{renderInvoiceTemplate(Number(CurrentTemplate), shopDetails, demoOrder[0], demoGST, shopProfile)}</>) ||
                   "No template available"}
               </div>
             </div>
           )}
         </AlphaCard>
       </div>
     </div>
   </div>
 );
}



