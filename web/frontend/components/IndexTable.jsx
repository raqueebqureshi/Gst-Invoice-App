import React, { useEffect, useState, useCallback } from "react";
import { MdOutlineFileDownload, MdPrint } from "react-icons/md";
import { FaArrowAltCircleDown } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import ToastNotification from "../components/ToastNotification";
import {
  Pagination,
  Button,
  ButtonGroup,
  Spinner,
  AlphaCard,
  IndexTable,
  Text,
  Badge,
  Page,
  FooterHelp,
  Link,
  Toast,
  ActionList,
  Popover,
  Frame,
  SkeletonBodyText,
  SkeletonDisplayText,
  EmptyState,
  SkeletonPage,
  Layout,
  Banner,
} from "@shopify/polaris";

import { TbMailForward } from "react-icons/tb";

import ReactDOM from "react-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import { InvoiceTemplate1 } from "../invoiceTemplates/invoice-template1";
import { InvoiceTemplate2 } from "../invoiceTemplates/invoice-template2";
import { InvoiceTemplate3 } from "../invoiceTemplates/invoice-template3";
import { useIndexResourceState, Tooltip } from "@shopify/polaris";
import { all } from "axios";

const filterOrders = (orders, query) => {
  return orders.filter((order) => {
    const queryLower = query.toLowerCase();
    const orderNumberMatch = order.order_number.toString().includes(queryLower);
    const customerMatch =
      (order.customer?.first_name?.toLowerCase() || "").includes(queryLower) ||
      (order.customer?.last_name?.toLowerCase() || "").includes(queryLower);
    return orderNumberMatch || customerMatch;
  });
};

export function OrderTableEx({ value, shopdetails }) {
  //console.log("Shop Details:-----", shopdetails);
  const [sendingStatus, setSendingStatus] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [isPDFGenerating, setIsPDFGenerating] = useState(false);
  const [isPDFGeneratingBulk, setIsPDFGeneratingBulk] = useState(false);
  const [isPDFPrinting, setIsPDFPrinting] = useState(false);
  const [isPDFPrintingBulk, setIsPDFPrintingBulk] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [planId, setplanId] = useState(null);
  const [nextPageInfo, setNextPageInfo] = useState(null);
  const [prevPageInfo, setPrevPageInfo] = useState(null);
  const [limit, setLimit] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [selectedFont, setSelectedFont] = useState("Roboto, sans-serif");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [shopProfile, setShopProfile] = useState({});
  const [storeDomain, setStoreDomain] = useState(null);
  const [email, setEmail] = useState(null);
  const [GSTHSNCodes, setGSTHSNCodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sendingRowId, setSendingRowId] = useState(null);
  const [pdfGeneratingRowId, setPdfGeneratingRowId] = useState(null);
  const [printingRowId, setPrintingRowId] = useState(null);
  const [isEmailEnabled, setIsEmailEnabled] = useState(false);
  const [shopId, setShopId] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const itemsPerPage = 20;
 const [isAppTaxApplied, setIsAppTaxApplied] = useState(false);




  // Toggle individual order selection
  const handleOrderSelection = (id) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((orderId) => orderId !== id)
        : [...prevSelected, id]
    );
  };

  // Toggle all orders selection
  const handleSelectAll = () => {
    setSelectedOrders(
      allSelected ? [] : paginatedOrders.map((order) => order.id)
    );
  };
  // const [showToast, setShowToast] = useState({
  //   active: false,
  //   message: "",
  //   error: false,
  // });
  const [popoverActive, setPopoverActive] = useState({});
  const [InvoiceSetting2, setInvoiceSetting2] = useState({
    branding: {
      showLogo: true,
      primaryColor: "#000000",
      fontFamily: "Roboto",
    },
    overview: {
      documentTitle: "Tax Invoice",
      showOrderId: true,
      showInvoiceNumber: true,
      showOrderIdBarcode: true,
      customizeInvoiceNumber: true,
      issueDate: true,
      showTaxReverseText: true,
      showTrackingCompany: true,
      showTrackingNo: true,
      showTrackingBarcode: true,
      addNote: "",
      showDeliveryMethod: true,
    },
    supplier: {
      heading: "Supplier",
      showSupplier: true,
      supplier: "",
      showHeading: true,
      showBusinessName: true,
      showAddress: true,
      showApartment: true,
      showCity: true,
      showVATNumber: true,
      showRegisteredNumber: true,
      showEmail: true,
      showPhone: true,
      showGSTIN: true,
    },
    shipping: {
      showShipping: true,
      heading: "Ship To",
      showHeading: true,
      showFullName: true,
      showAddress1: true,
      showAddress2: true,
      showCompany: true,
      showCity: true,
      showZipPinCode: true,
      showState: true,
      showCountry: true,
      showEmail: true,
      showPhone: true,
      showGSTIN: true,
    },
    billing: {
      showBilling: true,
      heading: "Bill To",
      showHeading: true,
      showFullName: true,
      showAddress1: true,
      showAddress2: true,
      showCompany: true,
      showCity: true,
      showZipPinCode: true,
      showState: true,
      showCountry: true,
      showEmail: true,
      showPhone: true,
      showGSTIN: true,
    },
    lineItems: {
      showProductImage: true,
      showSKU: true,
      showVariantTitle: true,
      showQuantity: true,
      showHSN: true,
      showUnitRate: true,
      showTotalDiscount: true,
      showRateAsDiscountedPrice: true,
      showTaxAmount: true,
      showTotalPrice: true,
    },
    total: {
      showDiscount: true,
      showSubtotal: true,
      showShipping: true,
      showShippingGSTSplit: true,
      showRefunded: true,
      showTax: true,
      showOutstanding: true,
      showTotal: true,
    },
    footer: {
      socialNetworks: {
        showWebsite: true,
        showFacebook: true,
        showTwitter: true,
        showInstagram: true,
        showPinterest: true,
        showYoutube: true,
      },
      thankYouNote: "Thanks for your purchase",
      footerNote:
        "This is an electronically generated invoice, no signature is required",
    },
  });

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const response = await fetch("/api/2024-10/shop.json", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch store details");
        }

        const data = await response.json();
        // console.log("Store Details---!", data.data);

        if (data.data?.data?.length > 0) {
          const storeInfo = data.data.data[0];
          setShopId(storeInfo.id);
          setStoreDomain(storeInfo.domain);
          setEmail(storeInfo.email);

          try {
            const billingResponse = await fetch(
              `/api/billing/confirm?shop=${storeInfo.domain}`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              }
            );

            if (billingResponse.ok) {
              // console.log("Billing Confirmation Response:", billingResponse);
            } else {
              // console.error("Billing API error:", billingResponse.statusText);
            }
          } catch (error) {
            // console.error("Error fetching billing confirmation:", error);
          }
        }
      } catch (error) {
        setShowToast(true);
        setToastMessage("Internal Server Error 500");
        // console.error("Error fetching store details:", error);
      }
    };

    fetchStoreDetails();

    // Retrieve stored plans from localStorage
    const currentPlan = localStorage.getItem("currentPlan");
    const currentPlanId = currentPlan.toString();

    // Compare the numeric part with the plans
    if (currentPlanId === "1" || currentPlanId === "2") {
      setIsSubscribed(true);
      // console.log(
      //   "Current Plan:",
      //   proPlanResponse === currentPlanId ? `Pro: ${proPlanResponse}` : `Business: ${businessPlanResponse}`
      // );
    } else {
      setIsSubscribed(false);
    }
  }, [planId]);

  useEffect(() => {
    if (storeDomain) {
      fetch(`/api/get-invoice-template?storeDomain=${storeDomain}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.storeInvoiceTemplate) {
            setCurrentTemplateId(data.storeInvoiceTemplate);
            //console.log("Current Template ID:", currentTemplateId);
          }
        })
        .catch((error) => console.error("Error fetching template ID:", error));
    }
  }, [storeDomain]);

  const countInvoiceDownloads = async (shopId, incrementBy) => {
    try {
      const response = await fetch(
        `/api/update-total-invoice-downaload`,

        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shopId: shopId,
            incrementBy: incrementBy,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Invoice Downloads:", data);
    } catch (error) {
      console.error("Error fetching invoice downloads:", error);
    }
  };

  const countInvoicePrint = async (shopId, incrementBy) => {
    try {
      const response = await fetch(
        `/api/update-total-invoice-print`,

        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shopId: shopId,
            incrementBy: incrementBy,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Invoice Print:", data);
    } catch (error) {
      console.error("Error fetching invoice downloads:", error);
    }
  };

  const countInvoiceSent = async (shopId, incrementBy) => {
    try {
      const response = await fetch(
        `/api/update-total-invoice-sent`,

        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shopId: shopId,
            incrementBy: incrementBy,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Invoice Sent:", data);
    } catch (error) {
      console.error("Error fetching invoice downloads:", error);
    }
  };

  //fetching paginated orders
  const fetchOrders = async (pageInfo = null) => {
    setLoading(true);
    if (!storeDomain) return; // Ensure storeDomain is set before fetching

    setLoading(true);
    try {
      let url = `/api/fetch-orders?shop=${storeDomain}`;
      if (pageInfo) {
        url += `&page_info=${pageInfo}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
        // console.log('data:',data);
        setNextPageInfo(data.nextPageInfo);
        setPrevPageInfo(data.prevPageInfo);
        // setError(null); // Clear errors on success
        setLoading(false);
        setShowToast(true);
        setToastMessage("Orders Synced");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      // setError("Failed to fetch orders.");
      setLoading(false);
    }
  };

  const fetchLastMonthOrders = async () => {
    try {
      const response = await fetch(
        `/api/last-month-order-count?shop=${storeDomain}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (data.success) {
        // console.log("📦 Last month's order count:", data);
        return data.lastMonthOrderCount;
      } else {
        throw new Error("Failed to fetch order count");
      }
    } catch (error) {
      console.error("❌ Error fetching last month's order count:", error);
      return null;
    }
  };

  useEffect(() => {
    if (storeDomain) {
      fetchOrders();
    }
  }, [storeDomain]);

  // useEffect(() => {
  //   fetchLastMonthOrders();
  // });
  useEffect(() => {
    if (shopId) {
      fetch(`/api/fetch-store-profile?shopId=${shopId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.profile) {
            const profileData = data.profile;
            // console.log("profileData", profileData);
            setShopProfile(profileData || {});
            setIsAppTaxApplied(profileData?.taxes || false);
          }
        })
        .catch((error) => {
          console.error("Error fetching store profile:", error);
        });
    }
  }, [shopId]);
 
 
 
 
 

  useEffect(() => {
    setTimeout(() => {
      if (showToast) {
        setShowToast(false);
      }
    }, 3000);
  }, [showToast]);

  // const sendInvoiceToCustomer = async (
  //   orderDetails,
  //   shopDetails,
  //   invoiceSettings,
  //   customerEmail,
  //   gstcodes,
  //   currentTemplateId
  // ) => {
  //   try {
  //     setIsSending(true);
  //     // Fetch the generated PDF file as Blob
  //     const pdfBlob = await generatePDFBlob(
  //       orderDetails,
  //       shopDetails,
  //       invoiceSettings,
  //       currentTemplateId,
  //       gstcodes,
  //       shopProfile
  //     );

  //     // Create a FormData object to include the Blob and additional data
  //     const formData = new FormData();
  //     formData.append(
  //       "file",
  //       pdfBlob,
  //       `Invoice-${orderDetails.order_number}.pdf`
  //     );
  //     formData.append("customerEmail", customerEmail);
  //     formData.append("orderId", orderDetails.order_number);
  //     formData.append("shopDetails", JSON.stringify(shopDetails));

  //     // console.log("formData",formData);
  //     // Send request to the backend API
  //     const response = await fetch("/api/send-invoice", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       // handleShowToast("Invoice sent successfully.");
  //       setShowToast(true);
  //       setToastMessage("Internal Server Error 500");
  //     } else {
  //       const errorData = await response.json();
  //       console.error("Error sending invoice:", errorData);
  //       setShowToast(true);
  //       setToastMessage("Failed to send invoice.");
  //       // handleShowToast("", true);
  //     }
  //   } catch (error) {
  //     //console.error("Error in sending invoice:", error);
  //     setShowToast(true);
  //     setToastMessage("An error occurred while sending the invoice.");
  //     // handleShowToast("", true);
  //   }
  // };

  
 
 
 
 



  useEffect(() => {
    if (shopId) {
      fetch(`/api/smtp/get?shopId=${shopId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            // console.log("Shop Profile Data", data);
            if (
              data?.smtpData?.sendByOwnEmail ||
              data?.smtpData?.sendByAppEmail
            ) {
              setIsEmailEnabled(true);
            } else {
              setIsEmailEnabled(false);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching store profile:", error);
        });
    }
  }, [shopId]);

  // Helper function to generate PDF as Blob
  // const generatePDFBlob = async (orderDetails, shopDetails, invoiceSettings, currentTemplateId, gstcodes) => {
  //   const pdf = new jsPDF("p", "pt", "a4");

  //   // Create an invoice container dynamically
  //   const invoiceContainer = document.createElement("div");
  //   invoiceContainer.style.width = "794px";
  //   invoiceContainer.style.height = "1123px";
  //   invoiceContainer.style.position = "absolute";
  //   invoiceContainer.style.top = "-9999px";
  //   document.body.appendChild(invoiceContainer);

  //   //console.log(currentTemplateId, "currentTemplateId");
  //   // Render the appropriate template into the container
  //   switch (currentTemplateId) {
  //     case "1":
  //       ReactDOM.render(
  //         <InvoiceTemplate1
  //           shopdetails={[shopDetails]}
  //           orders={[orderDetails]}
  //           invoiceSettings={invoiceSettings}
  //           GSTHSNCodes={gstcodes}
  //           shopProfile={shopProfile}
  //         />,
  //         invoiceContainer
  //       );
  //       break;
  //     case "2":
  //       ReactDOM.render(
  //         <InvoiceTemplate2
  //           shopdetails={[shopDetails]}
  //           orders={[orderDetails]}
  //           invoiceSettings={invoiceSettings}
  //           GSTHSNCodes={gstcodes}
  //           shopProfile={shopProfile}
  //         />,
  //         invoiceContainer
  //       );
  //       break;
  //     case "3":
  //       ReactDOM.render(
  //         <InvoiceTemplate3
  //           shopdetails={[shopDetails]}
  //           orders={[orderDetails]}
  //           invoiceSettings={invoiceSettings}
  //           GSTHSNCodes={gstcodes}
  //           shopProfile={shopProfile}
  //         />,
  //         invoiceContainer
  //       );
  //       break;
  //     default:
  //       //console.error("Invalid template ID:", currentTemplateId);
  //       throw new Error("Invalid template ID.");
  //   }

  //   // Convert the rendered HTML to a canvas and generate a PDF Blob
  //   const canvas = await html2canvas(invoiceContainer, {
  //     scale: 2,
  //     useCORS: true,
  //   });
  //   const imgData = canvas.toDataURL("image/jpeg");

  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const imgWidth = pdfWidth - 20;
  //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //   pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  //   document.body.removeChild(invoiceContainer);

  //   // Return PDF as Blob
  //   return pdf.output("blob");
  // };

  // const generatePDFBlob = async (
  //   orderDetails,
  //   shopDetails,
  //   invoiceSettings,
  //   currentTemplateId,
  //   gstcodes,
  //   shopProfile
  // ) => {
  //   if (!orderDetails || !currentTemplateId) {
  //     console.error(
  //       "Order details or template ID not available for PDF generation."
  //     );
  //     throw new Error("Order details or template ID is missing.");
  //   }

  //   // console.log("Generating PDF Blob with:", {
  //   //   orderDetails,
  //   //   shopDetails,
  //   //   invoiceSettings,
  //   //   currentTemplateId,
  //   //   gstcodes,
  //   //   shopProfile,
  //   // });

  //   // Utility to preload images and resolve CORS issues
  //   const loadImageAsDataURL = async (url) => {
  //     try {
  //       const response = await fetch(url, { mode: "cors" });
  //       const blob = await response.blob();
  //       return new Promise((resolve, reject) => {
  //         const reader = new FileReader();
  //         reader.onloadend = () => resolve(reader.result);
  //         reader.onerror = () =>
  //           reject(new Error(`Failed to convert image: ${url}`));
  //         reader.readAsDataURL(blob);
  //       });
  //     } catch (error) {
  //       console.error(`Failed to load image at ${url}:`, error);
  //       return ""; // Fallback to empty string
  //     }
  //   };

  //   // Preload all images (e.g., logo and signature)
  //   const preloadImages = async () => {
  //     if (shopProfile?.images?.logoURL) {
  //       shopProfile.images.logoURL = await loadImageAsDataURL(
  //         shopProfile.images.logoURL
  //       );
  //     }
  //     if (shopProfile?.images?.signatureURL) {
  //       shopProfile.images.signatureURL = await loadImageAsDataURL(
  //         shopProfile.images.signatureURL
  //       );
  //     }
  //   };

  //   try {
  //     // Preload images before rendering
  //     await preloadImages();

  //     const pdf = new jsPDF("p", "pt", "a4");
  //     const invoiceContainer = document.createElement("div");
  //     invoiceContainer.style.width = "794px";
  //     invoiceContainer.style.height = "1123px";
  //     invoiceContainer.style.position = "absolute";
  //     invoiceContainer.style.top = "-9999px";
  //     document.body.appendChild(invoiceContainer);

  //     const renderInvoiceTemplate = () => {
  //       switch (currentTemplateId) {
  //         case "1":
  //           ReactDOM.render(
  //             <InvoiceTemplate1
  //               shopdetails={[shopDetails]}
  //               orders={[orderDetails]}
  //               invoiceSettings={invoiceSettings}
  //               GSTHSNCodes={gstcodes}
  //               shopProfile={shopProfile}
  //             />,
  //             invoiceContainer
  //           );
  //           break;
  //         case "2":
  //           ReactDOM.render(
  //             <InvoiceTemplate2
  //               shopdetails={[shopDetails]}
  //               orders={[orderDetails]}
  //               invoiceSettings={invoiceSettings}
  //               GSTHSNCodes={gstcodes}
  //               shopProfile={shopProfile}
  //             />,
  //             invoiceContainer
  //           );
  //           break;
  //         case "3":
  //           ReactDOM.render(
  //             <InvoiceTemplate3
  //               shopdetails={[shopDetails]}
  //               orders={[orderDetails]}
  //               invoiceSettings={invoiceSettings}
  //               GSTHSNCodes={gstcodes}
  //               shopProfile={shopProfile}
  //             />,
  //             invoiceContainer
  //           );
  //           break;
  //         default:
  //           throw new Error("Invalid template ID.");
  //       }
  //     };

  //     renderInvoiceTemplate();

  //     // Wait for rendering to complete
  //     await new Promise((resolve) => setTimeout(resolve, 2000));

  //     const canvas = await html2canvas(invoiceContainer, {
  //       scale: 2,
  //       useCORS: true,
  //       allowTaint: false,
  //     });

  //     const imgData = canvas.toDataURL("image/jpeg");
  //     document.body.removeChild(invoiceContainer);

  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const imgWidth = pdfWidth - 20;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

  //     // Return the PDF as a Blob
  //     return pdf.output("blob");
  //   } catch (error) {
  //     console.error("Error generating PDF Blob:", error);
  //     throw error; // Ensure the caller knows about the failure
  //   }
  // };

  // const quickSendInvoice = async ({
  //   orderDetails,
  //   shopDetails,
  //   invoiceSettings,
  //   customerEmail,
  //   gstcodes,
  //   currentTemplate,
  //   shopProfile,
  // }) => {
  //   //console.log("hhhhhhhhhhhhhhhhhhhhh",orderDetails, shopDetails, invoiceSettings, customerEmail, gstcodes, currentTemplate);
  //   try {
  //     await sendInvoiceToCustomer(
  //       orderDetails,
  //       shopDetails,
  //       invoiceSettings,
  //       customerEmail,
  //       gstcodes,
  //       currentTemplate,
  //       shopProfile
  //     );
  //   } catch (error) {
  //     console.error("Error in Quick Send:", error);
  //     setShowToast(true);
  //     setToastMessage("An error occurred while sending the invoice.");
  //     // handleShowToast("", true);
  //   }
  // };

  const quickSendInvoice = async ({
    orderDetails,
    shopDetails,
    invoiceSettings,
    customerEmail,
    gstcodes,
    currentTemplate,
    shopProfile,
    shopifyTax
 
 
  }) => {
    //console.log("hhhhhhhhhhhhhhhhhhhhh",orderDetails, shopDetails, invoiceSettings, customerEmail, gstcodes, currentTemplate);
    try {
      await sendInvoiceToCustomer(
        orderDetails,
        shopDetails,
        invoiceSettings,
        customerEmail,
        gstcodes,
        currentTemplate,
        shopProfile,
        shopifyTax
      );
    } catch (error) {
      console.error("Error in Quick Send:", error);
      setShowToast(true);
      setToastMessage("An error occurred while sending the invoice.");
      // handleShowToast("", true);
    }
  };
   const sendInvoiceToCustomer = async (
    orderDetails,
    shopDetails,
    invoiceSettings,
    customerEmail,
    gstcodes,
    currentTemplateId,
    shopProfile,
    shopifyTax
  ) => {
    try {
      setIsSending(true);
      // Fetch the generated PDF file as Blob
      const pdfBlob = await generatePDFBlob(
        orderDetails,
        shopDetails,
        invoiceSettings,
        currentTemplateId,
        gstcodes,
        shopProfile,
        shopifyTax
      );
 
 
      // Create a FormData object to include the Blob and additional data
      const formData = new FormData();
      formData.append("file", pdfBlob, `Invoice-${orderDetails.order_number}.pdf`);
      formData.append("customerEmail", customerEmail);
      formData.append("orderId", orderDetails.order_number);
      formData.append("shopDetails", JSON.stringify(shopDetails));
 
 
      // console.log("formData",formData);
      // Send request to the backend API
      const response = await fetch("/api/send-invoice", {
        method: "POST",
        body: formData,
      });
 
 
      if (!response.ok) {
        // handleShowToast("Invoice sent successfully.");
        const errorData = await response.json();
        console.error("Error sending invoice:", errorData);
        setIsSending(false);
        setShowToast(true);
        setToastMessage("Internal Server Error 500");
      } else {
        const resp = await response.json();
        console.log("Successfull sending invoice:", resp);
        setIsSending(false);
        setShowToast(true);
        setToastMessage("Sent invoice.");
        // handleShowToast("", true);
      }
    } catch (error) {
      //console.error("Error in sending invoice:", error);
      setIsSending(false);
      setShowToast(true);
      setToastMessage("An error occurred while sending the invoice.");
      // handleShowToast("", true);
    }
  };
  const generatePDFBlob = async (
    orderDetails,
    shopDetails,
    invoiceSettings,
    currentTemplateId,
    gstcodes,
    shopProfile,
    shopifyTax
  ) => {
    if (!orderDetails || !currentTemplateId) {
      console.error("Order details or template ID not available for PDF generation.");
      throw new Error("Order details or template ID is missing.");
    }
 
 
    // console.log("Generating PDF Blob with:", {
    //   orderDetails,
    //   shopDetails,
    //   invoiceSettings,
    //   currentTemplateId,
    //   gstcodes,
    //   shopProfile,
    // });
 
 
    // Utility to preload images and resolve CORS issues
    const loadImageAsDataURL = async (url) => {
      try {
        const response = await fetch(url, { mode: "cors" });
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => reject(new Error(`Failed to convert image: ${url}`));
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error(`Failed to load image at ${url}:`, error);
        return ""; // Fallback to empty string
      }
    };
 
 
    // Preload all images (e.g., logo and signature)
    const preloadImages = async () => {
      if (shopProfile?.images?.logoURL) {
        shopProfile.images.logoURL = await loadImageAsDataURL(shopProfile.images.logoURL);
      }
      if (shopProfile?.images?.signatureURL) {
        shopProfile.images.signatureURL = await loadImageAsDataURL(shopProfile.images.signatureURL);
      }
    };
 
 
    try {
      // Preload images before rendering
      await preloadImages();
 
 
      const pdf = new jsPDF("p", "pt", "a4");
      const invoiceContainer = document.createElement("div");
      invoiceContainer.style.width = "794px";
      invoiceContainer.style.height = "1123px";
      invoiceContainer.style.position = "absolute";
      invoiceContainer.style.top = "-9999px";
      document.body.appendChild(invoiceContainer);
 
 
      const renderInvoiceTemplate = () => {
        switch (currentTemplateId) {
          case "1":
            ReactDOM.render(
              <InvoiceTemplate1
                shopdetails={[shopDetails]}
                orders={[orderDetails]}
                invoiceSettings={invoiceSettings}
                GSTHSNCodes={gstcodes}
                shopProfile={shopProfile}
                isShopifyTax={shopifyTax}
              />,
              invoiceContainer
            );
            break;
          case "2":
            ReactDOM.render(
              <InvoiceTemplate2
                shopdetails={[shopDetails]}
                orders={[orderDetails]}
                invoiceSettings={invoiceSettings}
                GSTHSNCodes={gstcodes}
                shopProfile={shopProfile}
                isShopifyTax={shopifyTax}
              />,
              invoiceContainer
            );
            break;
          case "3":
            ReactDOM.render(
              <InvoiceTemplate3
                shopdetails={[shopDetails]}
                orders={[orderDetails]}
                invoiceSettings={invoiceSettings}
                GSTHSNCodes={gstcodes}
                shopProfile={shopProfile}
                isShopifyTax={shopifyTax}
              />,
              invoiceContainer
            );
            break;
          default:
            throw new Error("Invalid template ID.");
        }
      };
 
 
      renderInvoiceTemplate();
 
 
      // Wait for rendering to complete
      await new Promise((resolve) => setTimeout(resolve, 2000));
 
 
      const canvas = await html2canvas(invoiceContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
      });
 
 
      const imgData = canvas.toDataURL("image/jpeg");
      document.body.removeChild(invoiceContainer);
 
 
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
 
 
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
 
 
      // Return the PDF as a Blob
      return pdf.output("blob");
    } catch (error) {
      console.error("Error generating PDF Blob:", error);
      throw error; // Ensure the caller knows about the failure
    }
  };
 
 
 
 

  const fetchInvoiceSettings = async () => {
    //console.log("Sending request to fetch invoice settings");

    return fetch("/api/fetch-invoice-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, storeDomain: storeDomain }), // Replace with actual data
    })
      .then(async (response) => {
        //console.log('response',response);
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(
              errorText || `HTTP error! Status: ${response.status}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        // setInvoiceSettings(data);
        const settings = data;
        //console.log("Received response:", settings);
        // //console.log("Received response:", JSON.stringify(settings));
        if (settings) {
          setInvoiceSetting2((prevState) => ({
            ...prevState,
            ...settings,
          }));
          setSelectedFont(settings.branding.fontFamily);
          // setLoading(false);
        }
      })
      .catch((error) => {
        //console.error("Error fetching invoice settings:", error.message);
      });
  };

  const fetchGSTHSNValues = async () => {
    try {
      if (!storeDomain || !email) {
        console.error("Missing storeDomain or email:", {
          storeDomain,
          email: email,
        });
        throw new Error("Invalid storeDomain or email.");
      }

      const url = `/api/products/gsthsn?storeDomain=${encodeURIComponent(
        storeDomain
      )}&email=${encodeURIComponent(email)}`;
      //console.log("Fetching GST HSN Values with URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch GST values. Status: ${response.status}`
        );
      }

      const data = await response.json();
      // console.log("Fetched GST Values:", data.gstValues);

      setGSTHSNCodes(data.gstValues);
    } catch (error) {
      //console.error("Error fetching GST values:", error);
    }
  };

  useEffect(() => {
    //console.log('storeDomain && email',storeDomain, email);
    if (storeDomain && email) {
      //console.log('storeDomain && email',storeDomain, email);
      fetchInvoiceSettings();
      fetchGSTHSNValues();
    }
  }, [storeDomain, email]);

  useEffect(() => {
    //console.log('GSTHSNCodes',GSTHSNCodes);
  }, [GSTHSNCodes]);

  //action to send invoice

  // const handlePdfDownload = useCallback(
  //   async (
  //     order,
  //     shopdetails,
  //     currentTemplate,
  //     invoiceSettings,
  //     GSTHSNCodes,
  //     shopProfile
  //   ) => {
  //     if (!order || !currentTemplate) {
  //       setIsPDFGenerating(false);
  //       console.error("Order or template not available for PDF generation.");
  //       return;
  //     }
  //     // Utility to preload images and resolve CORS issues
  //     const loadImageAsDataURL = async (url) => {
  //       try {
  //         const response = await fetch(url, { mode: "cors" });
  //         const blob = await response.blob();
  //         return new Promise((resolve, reject) => {
  //           const reader = new FileReader();
  //           reader.onloadend = () => resolve(reader.result);
  //           reader.onerror = () =>
  //             reject(new Error(`Failed to convert image: ${url}`));
  //           reader.readAsDataURL(blob);
  //         });
  //       } catch (error) {
  //         console.error(`Failed to load image at ${url}:`, error);
  //         return "";
  //       }
  //     };
  //     // Preload images before rendering
  //     const preloadImages = async () => {
  //       if (shopProfile?.images?.logoURL) {
  //         shopProfile.images.logoURL = await loadImageAsDataURL(
  //           shopProfile.images.logoURL
  //         );
  //       }
  //       if (shopProfile?.images?.signatureURL) {
  //         shopProfile.images.signatureURL = await loadImageAsDataURL(
  //           shopProfile.images.signatureURL
  //         );
  //       }
  //     };
  //     try {
  //       await preloadImages();
  //       const pdf = new jsPDF("p", "pt", "a4");
  //       const pdfWidth = pdf.internal.pageSize.getWidth();
  //       const pdfHeight = pdf.internal.pageSize.getHeight();
  //       // Create invoice container
  //       const invoiceContainer = document.createElement("div");
  //       invoiceContainer.style.width = "794px"; // A4 width in pixels
  //       invoiceContainer.style.minHeight = "1123px"; // A4 height in pixels
  //       invoiceContainer.style.position = "absolute";
  //       invoiceContainer.style.top = "-9999px";
  //       document.body.appendChild(invoiceContainer);
  //       // Render invoice template
  //       const renderInvoiceTemplate = () => {
  //         switch (currentTemplate) {
  //           case "1":
  //             ReactDOM.render(
  //               <InvoiceTemplate1
  //                 shopdetails={[shopdetails]}
  //                 orders={[order]}
  //                 invoiceSettings={invoiceSettings}
  //                 GSTHSNCodes={GSTHSNCodes}
  //                 shopProfile={shopProfile}
  //               />,
  //               invoiceContainer
  //             );
  //             break;
  //           case "2":
  //             ReactDOM.render(
  //               <InvoiceTemplate2
  //                 shopdetails={[shopdetails]}
  //                 orders={[order]}
  //                 invoiceSettings={invoiceSettings}
  //                 GSTHSNCodes={GSTHSNCodes}
  //                 shopProfile={shopProfile}
  //               />,
  //               invoiceContainer
  //             );
  //             break;
  //           case "3":
  //             ReactDOM.render(
  //               <InvoiceTemplate3
  //                 shopdetails={[shopdetails]}
  //                 orders={[order]}
  //                 invoiceSettings={invoiceSettings}
  //                 GSTHSNCodes={GSTHSNCodes}
  //                 shopProfile={shopProfile}
  //               />,
  //               invoiceContainer
  //             );
  //             break;
  //           default:
  //             console.error("Invalid template ID:", currentTemplate);
  //         }
  //       };
  //       renderInvoiceTemplate();
  //       await new Promise((resolve) => setTimeout(resolve, 2000));
  //       // Capture full invoice as a canvas
  //       const canvas = await html2canvas(invoiceContainer, {
  //         scale: 2, // Improves quality
  //         useCORS: true,
  //         allowTaint: false,
  //         logging: true,
  //       });
  //       document.body.removeChild(invoiceContainer);
  //       const imgData = canvas.toDataURL("image/png");
  //       const imgWidth = pdfWidth - 20;
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //       let position = 0;
  //       let pageHeight = pdfHeight - 40;
  //       // **✅ New Logic: Check if content exceeds first page**
  //       if (imgHeight > pdfHeight) {
  //         while (position < imgHeight) {
  //           const sectionCanvas = document.createElement("canvas");
  //           sectionCanvas.width = canvas.width;
  //           sectionCanvas.height = Math.min(
  //             pageHeight * (canvas.width / pdfWidth),
  //             canvas.height - position
  //           );
  //           const sectionCtx = sectionCanvas.getContext("2d");
  //           sectionCtx.drawImage(
  //             canvas,
  //             0,
  //             position * (canvas.width / pdfWidth),
  //             canvas.width,
  //             sectionCanvas.height,
  //             0,
  //             0,
  //             sectionCanvas.width,
  //             sectionCanvas.height
  //           );
  //           const sectionImgData = sectionCanvas.toDataURL("image/png");
  //           if (position > 0) pdf.addPage();
  //           pdf.addImage(
  //             sectionImgData,
  //             "PNG",
  //             10,
  //             10,
  //             imgWidth,
  //             (sectionCanvas.height * imgWidth) / canvas.width
  //           );
  //           position += sectionCanvas.height / (canvas.width / pdfWidth);
  //         }
  //       } else {
  //         pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  //       }
  //       setShowToast(true);
  //       setToastMessage("PDF generated successfully");
  //       pdf.save(`Invoice-${order.order_number}.pdf`);
  //       setIsPDFGenerating(false);
  //       setPdfGeneratingRowId(null);
  //       console.log("PDF generated successfully.");
  //     } catch (error) {
  //       setIsPDFGenerating(false);
  //       setPdfGeneratingRowId(null);
  //       console.error("Error generating PDF:", error);
  //     }
  //   },
  //   []
  // );

  // const handleBulkPdfDownload = useCallback(
  //   async (
  //     orders,
  //     shopdetails,
  //     currentTemplate,
  //     invoiceSettings,
  //     GSTHSNCodes,
  //     shopProfile
  //   ) => {
  //     if (!orders || orders.length === 0 || !currentTemplate) {
  //       console.error(
  //         "No orders or template available for bulk PDF generation."
  //       );
  //       return;
  //     }

  //     // console.log("Starting bulk PDF generation with:", {
  //     //   orders,
  //     //   shopdetails,
  //     //   currentTemplate,
  //     //   invoiceSettings,
  //     //   GSTHSNCodes,
  //     //   shopProfile,
  //     // });

  //     try {
  //       const pdf = new jsPDF("p", "pt", "a4");

  //       for (const order of orders) {
  //         const invoiceContainer = document.createElement("div");
  //         invoiceContainer.style.width = "794px";
  //         invoiceContainer.style.height = "1123px";
  //         invoiceContainer.style.position = "absolute";
  //         invoiceContainer.style.top = "-9999px";
  //         document.body.appendChild(invoiceContainer);

  //         const renderInvoiceTemplate = () => {
  //           switch (currentTemplate) {
  //             case "1":
  //               ReactDOM.render(
  //                 <InvoiceTemplate1
  //                   shopdetails={[shopdetails]}
  //                   orders={[order]}
  //                   invoiceSettings={invoiceSettings}
  //                   GSTHSNCodes={GSTHSNCodes}
  //                   shopProfile={shopProfile}
  //                 />,
  //                 invoiceContainer
  //               );
  //               break;
  //             case "2":
  //               ReactDOM.render(
  //                 <InvoiceTemplate2
  //                   shopdetails={[shopdetails]}
  //                   orders={[order]}
  //                   invoiceSettings={invoiceSettings}
  //                   GSTHSNCodes={GSTHSNCodes}
  //                   shopProfile={shopProfile}
  //                 />,
  //                 invoiceContainer
  //               );
  //               break;
  //             case "3":
  //               ReactDOM.render(
  //                 <InvoiceTemplate3
  //                   shopdetails={[shopdetails]}
  //                   orders={[order]}
  //                   invoiceSettings={invoiceSettings}
  //                   GSTHSNCodes={GSTHSNCodes}
  //                   shopProfile={shopProfile}
  //                 />,
  //                 invoiceContainer
  //               );
  //               break;
  //             default:
  //               console.error("Invalid template ID:", currentTemplate);
  //           }
  //         };

  //         renderInvoiceTemplate();

  //         // Wait for rendering to complete
  //         await new Promise((resolve) => setTimeout(resolve, 2000));

  //         const canvas = await html2canvas(invoiceContainer, {
  //           scale: 2,
  //           useCORS: true,
  //           allowTaint: false,
  //         });

  //         const imgData = canvas.toDataURL("image/jpeg");
  //         const pdfWidth = pdf.internal.pageSize.getWidth();
  //         const imgWidth = pdfWidth - 20;
  //         const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //         pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

  //         // Add a new page for the next order, except for the last one
  //         if (orders.indexOf(order) !== orders.length - 1) {
  //           pdf.addPage();
  //         }

  //         document.body.removeChild(invoiceContainer);
  //       }

  //       pdf.save(`Invoices-Bulk.pdf`);
  //       console.log("Bulk PDF generated");
  //     } catch (error) {
  //       console.error("Error generating bulk PDF:", error);
  //     }
  //   },
  //   []
  // );

  // const handlePrint = useCallback(
  //   async (
  //     order,
  //     shopdetails,
  //     currentTemplate,
  //     invoiceSettings,
  //     GSTHSNCodes,
  //     shopProfile
  //   ) => {
  //     if (!order || !currentTemplate) {
  //       setIsPDFPrinting(false);
  //       console.error("Missing order or template data for printing.");
  //       return;
  //     }
  //     try {
  //       // Render the invoice template
  //       const renderInvoiceTemplate = () => {
  //         switch (currentTemplate) {
  //           case "1":
  //             return ReactDOMServer.renderToString(
  //               <InvoiceTemplate1
  //                 shopdetails={[shopdetails]}
  //                 orders={[order]}
  //                 invoiceSettings={invoiceSettings}
  //                 GSTHSNCodes={GSTHSNCodes}
  //                 shopProfile={shopProfile}
  //               />
  //             );
  //           case "2":
  //             return ReactDOMServer.renderToString(
  //               <InvoiceTemplate2
  //                 shopdetails={[shopdetails]}
  //                 orders={[order]}
  //                 invoiceSettings={invoiceSettings}
  //                 GSTHSNCodes={GSTHSNCodes}
  //                 shopProfile={shopProfile}
  //               />
  //             );
  //           case "3":
  //             return ReactDOMServer.renderToString(
  //               <InvoiceTemplate3
  //                 shopdetails={[shopdetails]}
  //                 orders={[order]}
  //                 invoiceSettings={invoiceSettings}
  //                 GSTHSNCodes={GSTHSNCodes}
  //                 shopProfile={shopProfile}
  //               />
  //             );
  //           default:
  //             console.error("Invalid template ID:", currentTemplate);
  //             return "";
  //         }
  //       };
  //       const invoiceContent = renderInvoiceTemplate();
  //       // Open a new window for printing
  //       const printWindow = window.open("", "_blank", "width=794,height=1123");
  //       if (printWindow) {
  //         const customStyles = `
  //           <style>
  //             @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
  //              body, html {
  //               margin: 0;
  //               padding: 0;
  //               font-family: ${
  //                 invoiceSettings.branding.fontFamily || "Montserrat"
  //               };
  //             }
  //              @page {
  //               size: A4;
  //               margin: 0px;
  //             }
  //              @media print {
  //               body {
  //                 -webkit-print-color-adjust: exact;
  //                 overflow: hidden;
  //               }
  //               .page-break {
  //                 page-break-before: always;
  //               }
  //             }
  //              .invoice-container {
  //               width: 794px;
  //               margin: 0 auto;
  //               padding: 20px;
  //               background-color: #fff;
  //               border: 1px solid #ccc;
  //               border-radius: 8px;
  //             }
  //           </style>
  //         `;
  //         printWindow.document.open();
  //         printWindow.document.write(`
  //           <!DOCTYPE html>
  //           <html lang="en">
  //             <head>
  //               <meta charset="UTF-8">
  //               <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //               <title>Print Invoice</title>
  //               ${customStyles}
  //             </head>
  //             <body>
  //               <div class="invoice-container">
  //                 ${invoiceContent}
  //               </div>
  //             </body>
  //           </html>
  //         `);
  //         printWindow.document.close();
  //         // Trigger print once content is loaded
  //         printWindow.onload = () => {
  //           printWindow.print();
  //           printWindow.close();
  //         };
  //       } else {
  //         setIsPDFPrinting(false);
  //         console.error("Failed to open a new window for printing.");
  //       }
  //     } catch (error) {
  //       setIsPDFPrinting(false);
  //       console.error("Error ensuring data readiness for print:", error);
  //     }
  //   },
  //   []
  // );

  // const handleBulkPrint = useCallback(
  //   async (
  //     orders,
  //     shopdetails,
  //     currentTemplate,
  //     invoiceSettings,
  //     GSTHSNCodes,
  //     shopProfile
  //   ) => {
  //     if (!orders || orders.length === 0 || !currentTemplate) {
  //       console.error("No orders or template available for bulk printing.");
  //       return;
  //     }

  //     // console.log("Starting bulk printing with:", {
  //     //   orders,
  //     //   shopdetails,
  //     //   currentTemplate,
  //     //   invoiceSettings,
  //     //   GSTHSNCodes,
  //     //   shopProfile,
  //     // });

  //     try {
  //       const printWindow = window.open("", "_blank", "width=800,height=1123");
  //       if (printWindow) {
  //         const invoiceContent = orders
  //           .slice(0, 10) // Limit to 10 orders for bulk print
  //           .map((order) => {
  //             const renderInvoiceTemplate = () => {
  //               switch (currentTemplate) {
  //                 case "1":
  //                   return ReactDOMServer.renderToString(
  //                     <InvoiceTemplate1
  //                       shopdetails={[shopdetails]}
  //                       orders={[order]}
  //                       invoiceSettings={invoiceSettings}
  //                       GSTHSNCodes={GSTHSNCodes}
  //                       shopProfile={shopProfile}
  //                     />
  //                   );
  //                 case "2":
  //                   return ReactDOMServer.renderToString(
  //                     <InvoiceTemplate2
  //                       shopdetails={[shopdetails]}
  //                       orders={[order]}
  //                       invoiceSettings={invoiceSettings}
  //                       GSTHSNCodes={GSTHSNCodes}
  //                       shopProfile={shopProfile}
  //                     />
  //                   );
  //                 case "3":
  //                   return ReactDOMServer.renderToString(
  //                     <InvoiceTemplate3
  //                       shopdetails={[shopdetails]}
  //                       orders={[order]}
  //                       invoiceSettings={invoiceSettings}
  //                       GSTHSNCodes={GSTHSNCodes}
  //                       shopProfile={shopProfile}
  //                     />
  //                   );
  //                 default:
  //                   console.error("Invalid template ID:", currentTemplate);
  //                   return "";
  //               }
  //             };
  //             return `<div style="page-break-after: always;">${renderInvoiceTemplate()}</div>`;
  //           })
  //           .join("");

  //         const tailwindStylesheet = `
  //           <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
  //         `;

  //         const customStyles = `
  //           <style>
  //             @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
  
  //             body, html {
  //               margin: 0;
  //               padding: 0;
  //               font-family: ${invoiceSettings.branding.fontFamily};
  //             }
  
  //             @page {
  //               size: A4;
  //               margin: 0;
  //             }
  
  //             @media print {
  //               body {
  //                 -webkit-print-color-adjust: exact;
  //                 overflow: hidden;
  //               }
  //             }
  
  //             .invoice-container {
  //               width: 794px;
  //               margin: 0 auto;
  //               padding: 0px;
  //               background-color: #fff;
  //               border: 1px solid #ccc;
  //               border-radius: 8px;
  //             }
  
  //             div {
  //               page-break-inside: avoid;
  //             }
  //           </style>
  //         `;

  //         printWindow.document.open();
  //         printWindow.document.write(`
  //           <!DOCTYPE html>
  //           <html lang="en">
  //             <head>
  //               <meta charset="UTF-8">
  //               <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //               <title>Print Invoices</title>
  //               ${tailwindStylesheet}
  //               ${customStyles}
  //             </head>
  //             <body>
  //               ${invoiceContent}
  //             </body>
  //           </html>
  //         `);
  //         printWindow.document.close();

  //         // Ensure the print triggers only after the content loads
  //         printWindow.onload = () => {
  //           printWindow.print();
  //           printWindow.close();
  //         };
  //       } else {
  //         console.error("Failed to open a new window for bulk printing.");
  //       }
  //     } catch (error) {
  //       console.error("Error during bulk printing:", error);
  //     }
  //   },
  //   []
  // );



  const handlePdfDownload = useCallback(
    async (order, shopdetails, currentTemplate, invoiceSettings, GSTHSNCodes, shopProfile, shopifyTax) => {
      if (!order || !currentTemplate) {
        setIsPDFGenerating(false);
        console.error("Order or template not available for PDF generation.");
        return;
      }
 
 
      // Utility to preload images and resolve CORS issues
      const loadImageAsDataURL = async (url) => {
        try {
          const response = await fetch(url, { mode: "cors" });
          const blob = await response.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(new Error(`Failed to convert image: ${url}`));
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error(`Failed to load image at ${url}:`, error);
          return "";
        }
      };
 
 
      // Preload images before rendering
      const preloadImages = async () => {
        if (shopProfile?.images?.logoURL) {
          shopProfile.images.logoURL = await loadImageAsDataURL(shopProfile.images.logoURL);
        }
        if (shopProfile?.images?.signatureURL) {
          shopProfile.images.signatureURL = await loadImageAsDataURL(shopProfile.images.signatureURL);
        }
      };
 
 
      try {
        await preloadImages();
 
 
        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
 
 
        // Create invoice container
        const invoiceContainer = document.createElement("div");
        invoiceContainer.style.width = "794px"; // A4 width in pixels
        invoiceContainer.style.minHeight = "1123px"; // A4 height in pixels
        invoiceContainer.style.position = "absolute";
        invoiceContainer.style.top = "-9999px";
        document.body.appendChild(invoiceContainer);
 
 
        // Render invoice template
        const renderInvoiceTemplate = () => {
          switch (currentTemplate) {
            case "1":
              ReactDOM.render(
                <InvoiceTemplate1
                  shopdetails={[shopdetails]}
                  orders={[order]}
                  invoiceSettings={invoiceSettings}
                  GSTHSNCodes={GSTHSNCodes}
                  shopProfile={shopProfile}
                  isShopifyTax={shopifyTax}
                />,
                invoiceContainer
              );
              break;
            case "2":
              ReactDOM.render(
                <InvoiceTemplate2
                  shopdetails={[shopdetails]}
                  orders={[order]}
                  invoiceSettings={invoiceSettings}
                  GSTHSNCodes={GSTHSNCodes}
                  shopProfile={shopProfile}
                  isShopifyTax={shopifyTax}
                />,
                invoiceContainer
              );
              break;
            case "3":
              ReactDOM.render(
                <InvoiceTemplate3
                  shopdetails={[shopdetails]}
                  orders={[order]}
                  invoiceSettings={invoiceSettings}
                  GSTHSNCodes={GSTHSNCodes}
                  shopProfile={shopProfile}
                  isShopifyTax={shopifyTax}
                />,
                invoiceContainer
              );
              break;
            default:
              console.error("Invalid template ID:", currentTemplate);
          }
        };
 
 
        renderInvoiceTemplate();
 
 
        await new Promise((resolve) => setTimeout(resolve, 2000));
 
 
        // Capture full invoice as a canvas
        const canvas = await html2canvas(invoiceContainer, {
          scale: 2, // Improves quality
          useCORS: true,
          allowTaint: false,
          logging: true,
        });
 
 
        document.body.removeChild(invoiceContainer);
 
 
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = pdfWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
 
 
        let position = 0;
        let pageHeight = pdfHeight - 40;
 
 
        // **✅ New Logic: Check if content exceeds first page**
        if (imgHeight > pdfHeight) {
          while (position < imgHeight) {
            const sectionCanvas = document.createElement("canvas");
            sectionCanvas.width = canvas.width;
            sectionCanvas.height = Math.min(pageHeight * (canvas.width / pdfWidth), canvas.height - position);
 
 
            const sectionCtx = sectionCanvas.getContext("2d");
            sectionCtx.drawImage(
              canvas,
              0,
              position * (canvas.width / pdfWidth),
              canvas.width,
              sectionCanvas.height,
              0,
              0,
              sectionCanvas.width,
              sectionCanvas.height
            );
 
 
            const sectionImgData = sectionCanvas.toDataURL("image/png");
 
 
            if (position > 0) pdf.addPage();
            pdf.addImage(sectionImgData, "PNG", 10, 10, imgWidth, (sectionCanvas.height * imgWidth) / canvas.width);
 
 
            position += sectionCanvas.height / (canvas.width / pdfWidth);
          }
        } else {
          pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        }
 
 
        setShowToast(true);
        setToastMessage("PDF generated successfully");
        pdf.save(`Invoice-${order.order_number}.pdf`);
        setIsPDFGenerating(false);
        setPdfGeneratingRowId(null);
        // console.log("PDF generated successfully.");
      } catch (error) {
        setIsPDFGenerating(false);
        setPdfGeneratingRowId(null);
        console.error("Error generating PDF:", error);
      }
    },
    []
  );
 
 
  const handleBulkPdfDownload = useCallback(
    async (orders, shopdetails, currentTemplate, invoiceSettings, GSTHSNCodes, shopProfile, shopifyTax) => {
      if (!orders || orders.length === 0 || !currentTemplate) {
        console.error("No orders or template available for bulk PDF generation.");
        return;
      }
 
 
      // console.log("Starting bulk PDF generation with:", {
      //   orders,
      //   shopdetails,
      //   currentTemplate,
      //   invoiceSettings,
      //   GSTHSNCodes,
      //   shopProfile,
      // });
 
 
      try {
        const pdf = new jsPDF("p", "pt", "a4");
 
 
        for (const order of orders) {
          const invoiceContainer = document.createElement("div");
          invoiceContainer.style.width = "794px";
          invoiceContainer.style.height = "1123px";
          invoiceContainer.style.position = "absolute";
          invoiceContainer.style.top = "-9999px";
          document.body.appendChild(invoiceContainer);
 
 
          const renderInvoiceTemplate = () => {
            switch (currentTemplate) {
              case "1":
                ReactDOM.render(
                  <InvoiceTemplate1
                    shopdetails={[shopdetails]}
                    orders={[order]}
                    invoiceSettings={invoiceSettings}
                    GSTHSNCodes={GSTHSNCodes}
                    shopProfile={shopProfile}
                    isShopifyTax={shopifyTax}
                  />,
                  invoiceContainer
                );
                break;
              case "2":
                ReactDOM.render(
                  <InvoiceTemplate2
                    shopdetails={[shopdetails]}
                    orders={[order]}
                    invoiceSettings={invoiceSettings}
                    GSTHSNCodes={GSTHSNCodes}
                    shopProfile={shopProfile}
                    isShopifyTax={shopifyTax}
                  />,
                  invoiceContainer
                );
                break;
              case "3":
                ReactDOM.render(
                  <InvoiceTemplate3
                    shopdetails={[shopdetails]}
                    orders={[order]}
                    invoiceSettings={invoiceSettings}
                    GSTHSNCodes={GSTHSNCodes}
                    shopProfile={shopProfile}
                    isShopifyTax={shopifyTax}
                  />,
                  invoiceContainer
                );
                break;
              default:
                console.error("Invalid template ID:", currentTemplate);
            }
          };
 
 
          renderInvoiceTemplate();
 
 
          // Wait for rendering to complete
          await new Promise((resolve) => setTimeout(resolve, 2000));
 
 
          const canvas = await html2canvas(invoiceContainer, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
          });
 
 
          const imgData = canvas.toDataURL("image/jpeg");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const imgWidth = pdfWidth - 20;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
 
 
          pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
 
 
          // Add a new page for the next order, except for the last one
          if (orders.indexOf(order) !== orders.length - 1) {
            pdf.addPage();
          }
 
 
          document.body.removeChild(invoiceContainer);
        }
 
 
        pdf.save(`Invoices-Bulk.pdf`);
        // console.log("Bulk PDF generated");
      } catch (error) {
        console.error("Error generating bulk PDF:", error);
      }
    },
    []
  );
 
 
  const handlePrint = useCallback(
    async (order, shopdetails, currentTemplate, invoiceSettings, GSTHSNCodes, shopProfile, shopifyTax) => {
      if (!order || !currentTemplate) {
        setIsPDFPrinting(false);
        console.error("Missing order or template data for printing.");
        return;
      }
 
 
      try {
        // Render the invoice template
        const renderInvoiceTemplate = () => {
          switch (currentTemplate) {
            case "1":
              return ReactDOMServer.renderToString(
                <InvoiceTemplate1
                  shopdetails={[shopdetails]}
                  orders={[order]}
                  invoiceSettings={invoiceSettings}
                  GSTHSNCodes={GSTHSNCodes}
                  shopProfile={shopProfile}
                  isShopifyTax={shopifyTax}
                />
              );
            case "2":
              return ReactDOMServer.renderToString(
                <InvoiceTemplate2
                  shopdetails={[shopdetails]}
                  orders={[order]}
                  invoiceSettings={invoiceSettings}
                  GSTHSNCodes={GSTHSNCodes}
                  shopProfile={shopProfile}
                  isShopifyTax={shopifyTax}
                />
              );
            case "3":
              return ReactDOMServer.renderToString(
                <InvoiceTemplate3
                  shopdetails={[shopdetails]}
                  orders={[order]}
                  invoiceSettings={invoiceSettings}
                  GSTHSNCodes={GSTHSNCodes}
                  shopProfile={shopProfile}
                  isShopifyTax={shopifyTax}
                />
              );
            default:
              console.error("Invalid template ID:", currentTemplate);
              return "";
          }
        };
 
 
        const invoiceContent = renderInvoiceTemplate();
 
 
        // Open a new window for printing
        const printWindow = window.open("", "_blank", "width=794,height=1123");
        if (printWindow) {
          const customStyles = `
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
               body, html {
                margin: 0;
                padding: 0;
                font-family: ${invoiceSettings.branding.fontFamily || "Montserrat"};
              }
               @page {
                size: A4;
                margin: 0px;
              }
               @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  overflow: hidden;
                }
                .page-break {
                  page-break-before: always;
                }
              }
               .invoice-container {
                width: 794px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 8px;
              }
            </style>
          `;
 
 
          printWindow.document.open();
          printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Print Invoice</title>
                ${customStyles}
              </head>
              <body>
                <div class="invoice-container">
                  ${invoiceContent}
                </div>
              </body>
            </html>
          `);
          printWindow.document.close();
 
 
          // Trigger print once content is loaded
          printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
          };
        } else {
          setIsPDFPrinting(false);
          console.error("Failed to open a new window for printing.");
        }
      } catch (error) {
        setIsPDFPrinting(false);
        console.error("Error ensuring data readiness for print:", error);
      }
    },
    []
  );
 
 
  const handleBulkPrint = useCallback(
    async (orders, shopdetails, currentTemplate, invoiceSettings, GSTHSNCodes, shopProfile, shopifyTax) => {
      if (!orders || orders.length === 0 || !currentTemplate) {
        console.error("No orders or template available for bulk printing.");
        return;
      }
 
 
      // console.log("Starting bulk printing with:", {
      //   orders,
      //   shopdetails,
      //   currentTemplate,
      //   invoiceSettings,
      //   GSTHSNCodes,
      //   shopProfile,
      // });
 
 
      try {
        const printWindow = window.open("", "_blank", "width=800,height=1123");
        if (printWindow) {
          const invoiceContent = orders
            .slice(0, 10) // Limit to 10 orders for bulk print
            .map((order) => {
              const renderInvoiceTemplate = () => {
                switch (currentTemplate) {
                  case "1":
                    return ReactDOMServer.renderToString(
                      <InvoiceTemplate1
                        shopdetails={[shopdetails]}
                        orders={[order]}
                        invoiceSettings={invoiceSettings}
                        GSTHSNCodes={GSTHSNCodes}
                        shopProfile={shopProfile}
                        isShopifyTax={shopifyTax}
                      />
                    );
                  case "2":
                    return ReactDOMServer.renderToString(
                      <InvoiceTemplate2
                        shopdetails={[shopdetails]}
                        orders={[order]}
                        invoiceSettings={invoiceSettings}
                        GSTHSNCodes={GSTHSNCodes}
                        shopProfile={shopProfile}
                        isShopifyTax={shopifyTax}
                      />
                    );
                  case "3":
                    return ReactDOMServer.renderToString(
                      <InvoiceTemplate3
                        shopdetails={[shopdetails]}
                        orders={[order]}
                        invoiceSettings={invoiceSettings}
                        GSTHSNCodes={GSTHSNCodes}
                        shopProfile={shopProfile}
                        isShopifyTax={shopifyTax}
                      />
                    );
                  default:
                    console.error("Invalid template ID:", currentTemplate);
                    return "";
                }
              };
              return `<div style="page-break-after: always;">${renderInvoiceTemplate()}</div>`;
            })
            .join("");
 
 
          const tailwindStylesheet = `
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
          `;
 
 
          const customStyles = `
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
               body, html {
                margin: 0;
                padding: 0;
                font-family: ${invoiceSettings.branding.fontFamily};
              }
               @page {
                size: A4;
                margin: 0;
              }
               @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  overflow: hidden;
                }
              }
               .invoice-container {
                width: 794px;
                margin: 0 auto;
                padding: 0px;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 8px;
              }
               div {
                page-break-inside: avoid;
              }
            </style>
          `;
 
 
          printWindow.document.open();
          printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Print Invoices</title>
                ${tailwindStylesheet}
                ${customStyles}
              </head>
              <body>
                ${invoiceContent}
              </body>
            </html>
          `);
          printWindow.document.close();
 
 
          // Ensure the print triggers only after the content loads
          printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
          };
        } else {
          console.error("Failed to open a new window for bulk printing.");
        }
      } catch (error) {
        console.error("Error during bulk printing:", error);
      }
    },
    []
  );
 
 

  //-------------------------------------------------------------------

  const filteredOrders = filterOrders(orders, searchQuery);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [selectedOrders, setSelectedOrders] = useState([]);
  const allSelected =
    selectedOrders.length === paginatedOrders.length &&
    paginatedOrders.length > 0;

  const rowMarkup = paginatedOrders.map(
    (
      { id, order_number, created_at, customer, total_price, financial_status },
      index
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        // selected={selectedResources.includes(id)}
        position={index}
        // onClick={(event) => {
        //   const clickedElement = event.target.closest(".btn-actions, .btn-popover");
        //   if (clickedElement) {
        //     event.stopPropagation();
        //   }
        // }}
      >
        <IndexTable.Cell>
          <input
            type="checkbox"
            checked={selectedOrders.includes(id)}
            onChange={() => handleOrderSelection(id)}
            style={{
              cursor: "pointer",
              width: "16px",
              height: "16px",
              accentColor: "#2463bc" /* This changes the checkbox color */,
            }}
          />
        </IndexTable.Cell>
        <IndexTable.Cell>{order_number}</IndexTable.Cell>
        <IndexTable.Cell>
          {new Date(created_at).toLocaleString()}
        </IndexTable.Cell>
        <IndexTable.Cell>{`${customer?.first_name || "Unknown"} ${
          customer?.last_name || ""
        }`}</IndexTable.Cell>
        <IndexTable.Cell>{total_price}</IndexTable.Cell>
        <IndexTable.Cell>
          {financial_status.charAt(0).toUpperCase() + financial_status.slice(1)}
        </IndexTable.Cell>

        <IndexTable.Cell>
         
          <ButtonGroup
           style={{
             display: "flex",
             alignItems: "center", // Vertical alignment
             gap: "0px", // Space between buttons
           }}
         >
           {/* {pdfGeneratingRowId === id ? (
   <Spinner accessibilityLabel="Generating PDF" size="small" />
 ) : ( */}
           <button
             style={{
               cursor: "pointer",
               padding: "8px 12px", // Add consistent padding
               border: "1px solid black",
               borderRadius: "6px",
               boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
               color: "black",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               minWidth: "80px",
               transition: "all 0.3s ease",
               backgroundColor: "white",
               height: "30px", // Set consistent height
               opacity: selectedOrders.length > 1 ? "0.5" : "1",
               pointerEvents: selectedOrders.length > 1 ? "none" : "auto",
             }}
             disabled={orders.length > 50 ? true : false}
             onClick={(e) => {
               e.stopPropagation();
               if (orders.length > 50) {
                 setShowToast(true);
                 setToastMessage(
                   "You have exceed maximum invoice limit of 50 orders, please subscribe to premium plan to generate more invoices"
                 );
               } else {
                 if (!isPDFGenerating) {
                   setIsPDFGenerating(true);
                   handlePdfDownload(
                     paginatedOrders[index],
                     shopdetails,
                     currentTemplateId,
                     InvoiceSetting2,
                     GSTHSNCodes,
                     shopProfile,
                     isAppTaxApplied
                   )
                     .then(() => {
                       setIsPDFGenerating(false);
                       setPdfGeneratingRowId(null);
                       setShowToast(true);
                       setToastMessage("PDF generated");
                       if (shopId) {
                         countInvoiceDownloads(shopId, 1);
                       }
                     })
                     .catch(() => {
                       setIsPDFGenerating(false);
                       setPdfGeneratingRowId(null);
                     });
                   setPdfGeneratingRowId(id);
                 }
               }
             }}
             className="btn-actions"
           >
             {pdfGeneratingRowId === id ? (
               <div style={{ padding: "0px 8.5px" }}>
                 {" "}
                 <Spinner accessibilityLabel="Printing" size="small" />
               </div>
             ) : (
               <div
                 style={{
                   display: "flex",
                   gap: "4px",
                   alignItems: "center",
                 }}
               >
                 <MdOutlineFileDownload />
                 <span style={{ fontSize: "10px" }}>PDF</span>
               </div>
             )}
           </button>
           {/* )} */}


           {/* {printingRowId === id ? (
   <Spinner accessibilityLabel="Printing" size="small" />
 ) : ( */}
           <button
             // disabled={allSelected }
             style={{
               cursor: "pointer",
               padding: "8px 12px",
               border: "1px solid black",
               borderRadius: "6px",
               boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
               color: "black",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               minWidth: "80px",
               transition: "all 0.3s ease",
               backgroundColor: "white",
               height: "30px",
               opacity: selectedOrders.length > 1 ? "0.5" : "1",
               pointerEvents: selectedOrders.length > 1 ? "none" : "auto",
             }}
             onClick={(e) => {
               e.stopPropagation();
               console.log(selectedOrders, selectedOrders);
               if (orders.length > 50) {
                 setShowToast(true);
                 setToastMessage(
                   "You have exceed maximum invoice limit of 50 orders, please subscribe to premium plan to print more invoices"
                 );
               } else {
                 if (!isPDFPrinting) {
                   setIsPDFPrinting(true);
                   handlePrint(
                     paginatedOrders[index],
                     shopdetails,
                     currentTemplateId,
                     InvoiceSetting2,
                     GSTHSNCodes,
                     shopProfile,
                     isAppTaxApplied
                   )
                     .then(() => {
                       setIsPDFPrinting(false);
                       setPrintingRowId(null);
                       setShowToast(true);
                       setToastMessage("PDF printed");
                       if (shopId) {
                         countInvoicePrint(shopId, 1);
                       }
                     })
                     .catch(() => {
                       setIsPDFPrinting(false);
                       setPrintingRowId(null);
                     });
                   setPrintingRowId(id);
                 }
               }
             }}
             className="btn-actions"
           >
             {printingRowId === id ? (
               <>
                 <div style={{ padding: "0px 14px" }}>
                   {" "}
                   <Spinner accessibilityLabel="Printing" size="small" />
                 </div>
               </>
             ) : (
               <div
                 style={{
                   display: "flex",
                   gap: "4px",
                   alignItems: "center",
                 }}
               >
                 <MdPrint />
                 <span style={{ fontSize: "10px" }}>PRINT</span>
               </div>
             )}
           </button>
           {/* )} */}


           {sendingRowId === id ? (
             <Spinner accessibilityLabel="Sending invoice" size="small" />
           ) : (
             <>
               <div
                 style={{
                  
                   gap: "4px",
                   cursor: "pointer",
                   padding: "8px",
                   border: "1px solid black",
                   borderRadius: "6px",
                   boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                   color: "black",
                   transition: "all 0.3s ease",
                   backgroundColor: "white",
                   minWidth: "80px",
                   height: "30px",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "center",
                   opacity: selectedOrders.length > 1 ? "0.5" : "1",
                   pointerEvents: selectedOrders.length > 1 ? "none" : "auto",
                 }}
                 onClick={() => {
                   if (orders.length > 50) {
                     setShowToast(true);
                     setToastMessage(
                       "You have exceed maximum invoice limit of 50 orders, please subscribe to premium plan to send more invoices"
                     );
                   } else {
                     if (!isSending) {
                       setSendingRowId(id);
                       setIsSending(true);
                       quickSendInvoice({
                         orderDetails: paginatedOrders[index],
                         shopDetails: shopdetails,
                         invoiceSettings: InvoiceSetting2,
                         customerEmail: paginatedOrders[index].customer.email,
                         gstcodes: GSTHSNCodes,
                         currentTemplate: currentTemplateId,
                         shopProfile: shopProfile,
                         shopifyTax: isAppTaxApplied,
                       })
                         .then(() => {
                           setIsSending(false);
                           setSendingRowId(null);
                           setShowToast(true);
                           setToastMessage("Invoice sent");
                           if (shopId) {
                             countInvoiceSent(shopId, 1);
                           }
                         })
                         .catch(() => {
                           setIsSending(false);
                           setSendingRowId(null);
                         });
                     }
                   }
                 }}
               >
                 <span style={{ fontSize: "10px" }}>SEND</span>
                 <TbMailForward />
               </div>
             </>
           )}
         </ButtonGroup>


        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Frame>
      <Page title="All Orders" fullWidth>
        {loading ? (
          <SkeletonPage primaryAction>
            {/* <SkeletonDisplayText size="large" /> */}
            <SkeletonBodyText lines={25} />
          </SkeletonPage>
        ) : (
          <>
            {/* <Layout>
              <Layout.Section>
                <Banner title="Under maintenance" status="warning">
                  <p>
                    {" "}
                    Due to ongoing maintenance, some features may be
                    experiencing temporary issues. <strong>
                      Logo upload
                    </strong>, <strong>Signature upload</strong>, and{" "}
                    <strong>Invoice send</strong> are currently not working. We
                    appreciate your patience and assure you that everything will
                    be resolved shortly. Thank you for bearing with us.{" "}
                  </p>
                </Banner>
              </Layout.Section>
            </Layout> */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                gap: "10px",
                marginTop: "30px",
              }}
            >
              <input
                type="text"
                placeholder="Search by Order No, Invoice No, or Customer"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "90%",
                  borderRadius: "5px",
                  paddingLeft: "15px",
                  border: "1px solid black",
                }}
              />

              <Tooltip
               
                content="Upgrade to premium plan."
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    opacity: isSubscribed ? "1" : "0.5", // Reduce opacity when disabled
                    pointerEvents: isSubscribed ? "auto" : "none", // Disable interaction when not subscribed
                  }}
                >
                  <Button
                    primary
                    disabled={isPDFGeneratingBulk ? true : false}
                    onClick={() => {
                      // handleBulkPrintDownload(
                      //   orders.filter((order) =>
                      //     selectedResources.includes(order.id)
                      //   ),
                      //   shopdetails,
                      //   currentTemplateId
                      // )
                      setIsPDFGeneratingBulk(true);
                      if (selectedOrders.length === 0) {
                        setShowToast(true);
                        setToastMessage("Please select orders");
                        setIsPDFGeneratingBulk(false);
                      } else if (selectedOrders.length > 11) {
                        setShowToast(true);
                        setToastMessage("Please select upto 10 orders");
                        setIsPDFGeneratingBulk(false);
                      } else {
                        if (!isPDFGeneratingBulk) {
                          handleBulkPdfDownload(
                            // paginatedOrders.slice(0, 10), // Get first 10 orders
                            orders.filter((order) =>
                              selectedOrders.includes(order.id)
                            ),
                            shopdetails,
                            currentTemplateId,
                            InvoiceSetting2,
                            GSTHSNCodes,
                            shopProfile
                          )
                            .then(() => {
                              setIsPDFGeneratingBulk(false);
                              setShowToast(true);
                              setToastMessage("PDF generated");
                              if (shopId) {
                                countInvoiceDownloads(
                                  shopId,
                                  selectedOrders.length
                                );
                              }
                            })
                            .catch(() => {
                              setIsPDFGeneratingBulk(false);
                              setShowToast(true);
                              setToastMessage("Error while generating PDF");
                            });
                        }
                      }
                    }}
                    // disabled={selectedResources.length < 1 || selectedResources.length > 10}
                  >
                    {isPDFGeneratingBulk ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Spinner
                          size="small"
                          accessibilityLabel="Loading"
                          style={{
                            "--p-spinner-color": "white",
                            height: "20px",
                            width: "20px",
                          }}
                        />
                      </div>
                    ) : (
                      <FaArrowAltCircleDown
                        style={{ height: "20px", width: "20px" }}
                      />
                    )}
                  </Button>
                  <Button
                    primary
                    disabled={isPDFPrintingBulk ? true : false}
                    onClick={() => {
                      // handleBulkPrintDownload(
                      //   orders.filter((order) =>
                      //     selectedResources.includes(order.id)
                      //   ),
                      //   shopdetails,
                      //   currentTemplateId
                      // )
                      // console.log('allSelected',allSelected)
                      // console.log('selectedOrders',selectedOrders)
                      setIsPDFPrintingBulk(true);
                      if (selectedOrders.length === 0) {
                        setShowToast(true);
                        setToastMessage("Please select orders");
                        setIsPDFPrintingBulk(false);
                      } else if (selectedOrders.length > 11) {
                        setShowToast(true);
                        setToastMessage("Please select upto 10 orders");
                        setIsPDFPrintingBulk(false);
                      } else {
                        if (!isPDFPrintingBulk) {
                          handleBulkPrint(
                            // paginatedOrders.slice(0, 10), // Get first 10 orders
                            orders.filter((order) =>
                              selectedOrders.includes(order.id)
                            ),
                            shopdetails,
                            currentTemplateId,
                            InvoiceSetting2,
                            GSTHSNCodes,
                            shopProfile
                          )
                            .then(() => {
                              setIsPDFPrintingBulk(false);
                              setShowToast(true);
                              setToastMessage("PDF printed");
                              if (shopId) {
                                countInvoicePrint(
                                  shopId,
                                  selectedOrders.length
                                );
                              }
                            })
                            .catch(() => {
                              setIsPDFPrintingBulk(false);
                              setShowToast(true);
                              setToastMessage("Error while printing PDF");
                            });
                        }
                      }
                    }}
                    // disabled={selectedResources.length < 1 || selectedResources.length > 10}
                  >
                    {isPDFPrintingBulk ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Spinner
                          size="small"
                          accessibilityLabel="Loading"
                          style={{
                            "--p-spinner-color": "white",
                            height: "20px",
                            width: "20px",
                          }}
                        />
                      </div>
                    ) : (
                      <MdPrint style={{ height: "20px", width: "20px" }} />
                    )}
                  </Button>
                </div>
              </Tooltip>
            </div>

            <AlphaCard>
              {/* <IndexTable
                resourceName={{ singular: "order", plural: "orders" }}
                itemCount={filteredOrders.length}
                // selectedItemsCount={
                //   allResourcesSelected ? "All" : selectedResources.length
                // }
                // onSelectionChange={handleSelectionChange}
                selectable={false}

                headings={[
                  { title: "Order" },
                  { title: "Date" },
                  { title: "Customer" },
                  { title: "Total" },
                  { title: "Payment Status" },
                  { title: "Actions" },
                ]}
              > */}
              <IndexTable
                resourceName={{ singular: "order", plural: "orders" }}
                itemCount={paginatedOrders.length}
                selectable={false} // Disabling Shopify's default selection system
                headings={[
                  {
                    title: (
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        style={{
                          cursor: "pointer",
                          width: "16px",
                          height: "16px",
                          accentColor:
                            "#2463bc" /* This changes the checkbox color */,
                        }}
                      />
                    ),
                  },
                  { title: "Order" },
                  { title: "Date" },
                  { title: "Customer" },
                  { title: "Total" },
                  { title: "Payment Status" },
                  { title: "Actions" },
                ]}
              >
                {rowMarkup}
              </IndexTable>
              <div
                style={{
                  margin: "20px 0",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Pagination
                  hasPrevious={prevPageInfo}
                  onPrevious={() => fetchOrders(prevPageInfo)}
                  hasNext={nextPageInfo}
                  onNext={() => fetchOrders(nextPageInfo)}
                />
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
              </div>
            </AlphaCard>
            <FooterHelp>
              Need Help{" "}
              <Link to="/contact-us" removeUnderline>
                please click here
              </Link>
            </FooterHelp>
          </>
        )}
      </Page>
    </Frame>
  );
}
