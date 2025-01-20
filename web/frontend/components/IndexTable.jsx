import React, { useEffect, useState, useCallback } from "react";
import { MdOutlineFileDownload, MdPrint } from "react-icons/md";
import { FaArrowAltCircleDown } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import { useSimpleToast } from "./Toast";
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
  SkeletonPage,
} from "@shopify/polaris";
import { VscSend } from "react-icons/vsc";

import ReactDOM from "react-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import { InvoiceTemplate1 } from "../invoiceTemplates/invoice-template1";
import { InvoiceTemplate2 } from "../invoiceTemplates/invoice-template2";
import { InvoiceTemplate3 } from "../invoiceTemplates/invoice-template3";
import { useIndexResourceState } from "@shopify/polaris";
import { MenuHorizontalIcon } from "@shopify/polaris-icons";

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
  const itemsPerPage = 20;
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
      footerNote: "This is an electronically generated invoice, no signature is required",
    },
  });

  // const handleShowToast = (message, error = false) => {
  //   setShowToast({ active: true, message, error });
  // };

  useEffect(() => {
    fetch("/api/2024-10/shop.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log("Store Details---!", data.data);
        setShopId(data.data.data[0].id);
        if (data.data.data && data.data.data.length > 0) {
          setStoreDomain(data.data.data[0].domain);
          setEmail(data.data.data[0].email);
          setShopId(data.data.data[0].id);
        }
      })
      .catch((error) => {
        setShowToast(true);
        setToastMessage("Internal Server Error 500");
        // handleShowToast("Internal Server Error 500", true)
      });
  }, []);

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

  useEffect(() => {
    fetch("/api/2024-10/orders.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((request) => request.json())
      .then((response) => {
        if (response.data) {
          //console.log('response.data',response.data);
          setOrders(response.data);
          setLoading(false);
          // handleShowToast("Orders Synced Complete");
          setShowToast(true);
          setToastMessage("Orders Synced Complete");
        }
      })
      .catch((error) => {
        //console.error(error);
        setLoading(false);
        setShowToast(true);
        setToastMessage("Internal Server Error 500");
        // handleShowToast("Internal Server Error 500", true);
      });
  }, []);

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(
    orders.map((order) => order.id)
  );

  useEffect(() => {
    fetch(`/api/fetch-store-profile?shopId=${shopId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.profile) {
          const profileData = data.profile;
          console.log("profileData", profileData);
          setShopProfile(profileData || {});
        }
      })
      .catch((error) => {
        console.error("Error fetching store profile:", error);
      });
  }, [shopId]);

  useEffect(() => {
    setTimeout(() => {
      if (showToast) {
        setShowToast(false);
      }
    }, 3000);
  }, [showToast]);

  const handleSendClick = (index) => {
    if (!sendingStatus[index]) {
      setSendingStatus((prev) => ({ ...prev, [index]: true })); // Set this row to "sending"
      quickSendInvoice({
        orderDetails: paginatedOrders[index],
        shopDetails: shopdetails,
        invoiceSettings: InvoiceSetting2,
        customerEmail: paginatedOrders[index].customer.email,
        gstcodes: GSTHSNCodes,
        currentTemplate: currentTemplateId,
        shopProfile,
      })
        .then(() => setSendingStatus((prev) => ({ ...prev, [index]: false }))) // Reset on success
        .catch(() => setSendingStatus((prev) => ({ ...prev, [index]: false }))); // Reset on failure
    }
  };

  const sendInvoiceToCustomer = async (
    orderDetails,
    shopDetails,
    invoiceSettings,
    customerEmail,
    gstcodes,
    currentTemplateId
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
        shopProfile
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

      if (response.ok) {
        // handleShowToast("Invoice sent successfully.");
        setShowToast(true);
        setToastMessage("Internal Server Error 500");
      } else {
        const errorData = await response.json();
        console.error("Error sending invoice:", errorData);
        setShowToast(true);
        setToastMessage("Failed to send invoice.");
        // handleShowToast("", true);
      }
    } catch (error) {
      //console.error("Error in sending invoice:", error);
      setShowToast(true);
      setToastMessage("An error occurred while sending the invoice.");
      // handleShowToast("", true);
    }
  };

  useEffect(() => {
    fetch(`/api/smtp/get?shopId=${shopId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          // console.log("Shop Profile Data", data);
          if (data.smtpData.sendByOwnEmail || data.smtpData.sendByAppEmail) {
            setIsEmailEnabled(true);
          } else {
            setIsEmailEnabled(false);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching store profile:", error);
      });
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

  const generatePDFBlob = async (
    orderDetails,
    shopDetails,
    invoiceSettings,
    currentTemplateId,
    gstcodes,
    shopProfile
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

  const quickSendInvoice = async ({
    orderDetails,
    shopDetails,
    invoiceSettings,
    customerEmail,
    gstcodes,
    currentTemplate,
    shopProfile,
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
        shopProfile
      );
    } catch (error) {
      console.error("Error in Quick Send:", error);
      setShowToast(true);
      setToastMessage("An error occurred while sending the invoice.");
      // handleShowToast("", true);
    }
  };

  // const togglePopoverActive = (orderId) => {
  //   setPopoverActive((prevState) => ({
  //     ...prevState,
  //     [orderId]: !prevState[orderId],
  //   }));
  // };

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
            throw new Error(errorText || `HTTP error! Status: ${response.status}`);
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
          setLoading(false);
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

      const url = `/api/products/gsthsn?storeDomain=${encodeURIComponent(storeDomain)}&email=${encodeURIComponent(
        email
      )}`;
      //console.log("Fetching GST HSN Values with URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch GST values. Status: ${response.status}`);
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

  // const handlePdfDownload = useCallback(
  //   async (order, shopdetails, currentTemplate ,invoiceSettings, GSTHSNCodes) => {
  //     if (!order || !currentTemplate) return;

  //     //console.log(order, shopdetails, currentTemplate, "PDF download");
  //     // Logic to generate and download PDF for the given order
  //     const pdf = new jsPDF("p", "pt", "a4");
  //     const invoiceContainer = document.createElement("div");
  //     invoiceContainer.style.width = "794px";
  //     invoiceContainer.style.height = "1123px";
  //     invoiceContainer.style.position = "absolute";
  //     invoiceContainer.style.top = "-9999px";
  //     document.body.appendChild(invoiceContainer);

  //     const renderInvoiceTemplate = (
  //       currentTemplate,
  //       shopdetails,
  //       order,
  //       invoiceContainer, GSTHSNCodes
  //     ) => {
  //       switch (currentTemplate) {
  //         case "1":
  //           ReactDOM.render(
  //             <InvoiceTemplate1 shopdetails={[shopdetails]} orders={[order]} invoiceSettings={invoiceSettings} GSTHSNCodes={GSTHSNCodes}/>,
  //             invoiceContainer
  //           );
  //           break;
  //         case "2":
  //           ReactDOM.render(
  //             <InvoiceTemplate2 shopdetails={[shopdetails]} orders={[order]} invoiceSettings={invoiceSettings} GSTHSNCodes={GSTHSNCodes}/>,
  //             invoiceContainer
  //           );
  //           break;
  //         case "3":
  //           ReactDOM.render(
  //             <InvoiceTemplate3 shopdetails={[shopdetails]} orders={[order]} invoiceSettings={invoiceSettings} GSTHSNCodes={GSTHSNCodes}/>,
  //             invoiceContainer
  //           );
  //           break;
  //         default:
  //           //console.error("Invalid template ID:", currentTemplate);
  //       }
  //     };

  //     renderInvoiceTemplate(currentTemplate, shopdetails, order, invoiceContainer, GSTHSNCodes);

  //     const canvas = await html2canvas(invoiceContainer, {
  //       scale: 2,
  //       useCORS: true,
  //     });
  //     const imgData = canvas.toDataURL("image/png");

  //     document.body.removeChild(invoiceContainer);

  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const imgWidth = pdfWidth - 20;
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  //     pdf.save(`Invoice-${order.order_number}.pdf`);
  //   },
  //   []
  // );

  // const handlePrint = useCallback(
  //   async (order, shopdetails, currentTemplate, invoiceSettings, GSTHSNCodes) => {
  //     if (!order || !currentTemplate) return;

  //     // Logic to print the given order
  //     const invoiceContainer = document.createElement("div");
  //     invoiceContainer.style.width = "794px";
  //     invoiceContainer.style.height = "1123px";
  //     invoiceContainer.style.position = "absolute";
  //     invoiceContainer.style.top = "-9999px";
  //     document.body.appendChild(invoiceContainer);

  //     const renderInvoiceTemplate = (
  //       currentTemplate,
  //       shopdetails,
  //       order,
  //       invoiceContainer
  //     ) => {
  //       switch (currentTemplate) {
  //         case "1":
  //           ReactDOM.render(
  //             <InvoiceTemplate1 shopdetails={[shopdetails]} orders={[order]} invoiceSettings={invoiceSettings} GSTHSNCodes={GSTHSNCodes}/>,
  //             invoiceContainer
  //           );
  //           break;
  //         case "2":
  //           ReactDOM.render(
  //             <InvoiceTemplate2 shopdetails={[shopdetails]} orders={[order]} invoiceSettings={invoiceSettings} GSTHSNCodes={GSTHSNCodes}/>,
  //             invoiceContainer
  //           );
  //           break;
  //         case "3":
  //           ReactDOM.render(
  //             <InvoiceTemplate3 shopdetails={[shopdetails]} orders={[order]} invoiceSettings={invoiceSettings} GSTHSNCodes={GSTHSNCodes}/>,
  //             invoiceContainer
  //           );
  //           break;
  //         default:
  //           //console.error("Invalid template ID:", currentTemplate);
  //       }
  //     };

  //     renderInvoiceTemplate(currentTemplate, shopdetails, order, invoiceContainer);

  //     const printWindow = window.open("", "_blank");
  //     printWindow.document.write(`
  //     <html>
  //       <head>
  //         <title>Print Invoice</title>
  //       </head>
  //       <body>${invoiceContainer.innerHTML}</body>
  //     </html>
  //     `);
  //     printWindow.document.close();
  //     printWindow.onload = () => {
  //       printWindow.print();
  //       printWindow.close();
  //     };

  //     document.body.removeChild(invoiceContainer);
  //   },
  //   []
  // );

  //-------------[previous code]---------------------
  // const handlePdfDownload = useCallback(
  //   async (order, shopdetails, currentTemplate, invoiceSettings, GSTHSNCodes, shopProfile) => {
  //     if (!order || !currentTemplate) {
  //       console.error("Order or template not available for PDF generation.");
  //       return;
  //     }

  //     console.log("Starting PDF generation with:", {
  //       order,
  //       shopdetails,
  //       currentTemplate,
  //       invoiceSettings,
  //       GSTHSNCodes,
  //       shopProfile
  //     });

  //     // Function to wait for data readiness
  //     const waitForData = async () => {
  //       const maxRetries = 20; // Maximum retries
  //       const delayBetweenRetries = 500; // Delay between retries in ms
  //       let attempts = 0;

  //       return new Promise((resolve, reject) => {
  //         const interval = setInterval(() => {
  //           const isDataReady =
  //             shopdetails &&
  //             invoiceSettings &&
  //             GSTHSNCodes &&
  //             currentTemplate &&
  //             order && shopProfile;

  //           if (isDataReady) {
  //             clearInterval(interval);
  //             resolve(true);
  //           }

  //           attempts++;
  //           if (attempts >= maxRetries) {
  //             clearInterval(interval);
  //             console.error("Data readiness timeout for PDF generation.");
  //             reject(new Error("Data not ready"));
  //           }
  //         }, delayBetweenRetries);
  //       });
  //     };

  //     try {
  //       await waitForData();

  //       const pdf = new jsPDF("p", "pt", "a4");
  //       const invoiceContainer = document.createElement("div");
  //       invoiceContainer.style.width = "794px";
  //       invoiceContainer.style.height = "1123px";
  //       invoiceContainer.style.position = "absolute";
  //       invoiceContainer.style.top = "-9999px";
  //       document.body.appendChild(invoiceContainer);

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
  //               />,
  //               invoiceContainer
  //             );
  //             break;
  //           default:
  //             console.error("Invalid template ID:", currentTemplate);
  //         }
  //       };

  //       renderInvoiceTemplate();

  //       // Add a delay to ensure rendering completion
  //       await new Promise((resolve) => setTimeout(resolve, 2000));

  //       const canvas = await html2canvas(invoiceContainer, {
  //         scale: 2,
  //         useCORS: true,
  //         allowTaint: false,
  //       });

  //       const imgData = canvas.toDataURL("image/png");
  //       document.body.removeChild(invoiceContainer);

  //       const pdfWidth = pdf.internal.pageSize.getWidth();
  //       const imgWidth = pdfWidth - 20;
  //       const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //       pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
  //       pdf.save(`Invoice-${order.order_number}.pdf`);

  //       console.log("PDF generated successfully.");
  //     } catch (error) {
  //       console.error("Error generating PDF:", error);
  //     }
  //   },
  //   []
  // );

  const handlePdfDownload = useCallback(
    async (order, shopdetails, currentTemplate, invoiceSettings, GSTHSNCodes, shopProfile) => {
      if (!order || !currentTemplate) {
        setIsPDFGenerating(false);
        console.error("Order or template not available for PDF generation.");
        return;
      }

      // console.log("Starting PDF generation with:", {
      //   order,
      //   shopdetails,
      //   currentTemplate,
      //   invoiceSettings,
      //   GSTHSNCodes,
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
          switch (currentTemplate) {
            case "1":
              ReactDOM.render(
                <InvoiceTemplate1
                  shopdetails={[shopdetails]}
                  orders={[order]}
                  invoiceSettings={invoiceSettings}
                  GSTHSNCodes={GSTHSNCodes}
                  shopProfile={shopProfile}
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
          logging: true, // Enable logging to debug
        });

        const imgData = canvas.toDataURL("image/jpeg");
        document.body.removeChild(invoiceContainer);

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pdfWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        setShowToast(true);
        setToastMessage("");
        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save(`Invoice-${order.order_number}.pdf`);
        setIsPDFGenerating(false);
        setPdfGeneratingRowId(null);
        console.log("PDF generated successfully.");
      } catch (error) {
        setIsPDFGenerating(false);
        setPdfGeneratingRowId(null);
        console.error("Error generating PDF:", error);
      }
    },
    []
  );

  const handleBulkPdfDownload = useCallback(
    async (orders, shopdetails, currentTemplate, invoiceSettings, GSTHSNCodes, shopProfile) => {
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
        console.log("Bulk PDF generated successfully.");
      } catch (error) {
        console.error("Error generating bulk PDF:", error);
      }
    },
    []
  );
  
  
  
  

  const handlePrint = useCallback(
    async (order, shopdetails, currentTemplate, invoiceSettings, GSTHSNCodes, shopProfile) => {
      if (!order || !currentTemplate) {
        setIsPDFPrinting(false);
        console.error("Missing order or template data for printing.");
        return;
      }

      // console.log("Preparing to print with:", {
      //   order,
      //   shopdetails,
      //   currentTemplate,
      //   invoiceSettings,
      //   GSTHSNCodes,
      //   shopProfile,
      // });

      // Function to wait for all data to load
      const waitForData = async () => {
        const maxRetries = 20; // Number of retries
        const delayBetweenRetries = 500; // Time in ms between retries
        let attempts = 0;

        return new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            const isDataReady =
              shopdetails && invoiceSettings && GSTHSNCodes && currentTemplate && order && shopProfile;

            if (isDataReady) {
              clearInterval(interval);
              resolve(true);
            }

            attempts++;
            if (attempts >= maxRetries) {
              clearInterval(interval);
              console.error("Template data failed to load in time.");
              reject(new Error("Data not ready"));
            }
          }, delayBetweenRetries);
        });
      };

      try {
        await waitForData(); // Ensure all data is loaded before rendering

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
                />
              );
            default:
              console.error("Invalid template ID:", currentTemplate);
              return "";
          }
        };

        const invoiceContent = renderInvoiceTemplate();

        // Open a new window for printing
        const printWindow = window.open("", "_blank", "width=800,height=1123");
        if (printWindow) {
          // Tailwind CSS and custom styles
          // console.log("invoiceSettings.branding.fontFamily", invoiceSettings.branding.fontFamily);
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
                ${tailwindStylesheet}
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

          // Ensure the print triggers only after the content loads
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
    async (orders, shopdetails, currentTemplate, invoiceSettings, GSTHSNCodes, shopProfile) => {
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
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  

  const rowMarkup = paginatedOrders.map(
    ({ id, order_number, created_at, customer, total_price, financial_status }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
        // onClick={(event) => {
        //   const clickedElement = event.target.closest(".btn-actions, .btn-popover");
        //   if (clickedElement) {
        //     event.stopPropagation();
        //   }
        // }}
      >
        <IndexTable.Cell>
          {loading ? <SkeletonBodyText lines={1} /> : <Text variation="strong">{order_number}</Text>}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {loading ? <SkeletonBodyText lines={1} /> : new Date(created_at).toLocaleString()}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {loading ? (
            <SkeletonBodyText lines={1} />
          ) : (
            `${customer?.first_name || "Unknown"} ${customer?.last_name || ""}`
          )}
        </IndexTable.Cell>
        <IndexTable.Cell>{loading ? <SkeletonBodyText lines={1} /> : total_price}</IndexTable.Cell>
        <IndexTable.Cell>
          {loading ? (
            <SkeletonBodyText lines={1} />
          ) : (
            <Badge status={financial_status === "paid" ? "success" : "attention"}>
              {financial_status.charAt(0).toUpperCase() + financial_status.slice(1)}
            </Badge>
          )}
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
                transition: "all 0.3s ease",
                backgroundColor: "white",
                height: "30px", // Set consistent height
                opacity: selectedResources.length > 1 ? "0.5" : "1",
                pointerEvents: selectedResources.length > 1 ? "none" : "auto",
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isPDFGenerating) {
                  setIsPDFGenerating(true);
                  handlePdfDownload(
                    paginatedOrders[index],
                    shopdetails,
                    currentTemplateId,
                    InvoiceSetting2,
                    GSTHSNCodes,
                    shopProfile
                  )
                    .then(() => {
                      setIsPDFGenerating(false);
                      setPdfGeneratingRowId(null);
                      setShowToast(true);
                      setToastMessage("PDF generated successfully");
                    })
                    .catch(() => {
                      setIsPDFGenerating(false);
                      setPdfGeneratingRowId(null);
                    });
                  setPdfGeneratingRowId(id);
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
                transition: "all 0.3s ease",
                backgroundColor: "white",
                height: "30px",
                opacity: selectedResources.length > 1 ? "0.5" : "1",
                pointerEvents: selectedResources.length > 1 ? "none" : "auto",
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!isPDFPrinting) {
                  setIsPDFPrinting(true);
                  handlePrint(
                    paginatedOrders[index],
                    shopdetails,
                    currentTemplateId,
                    InvoiceSetting2,
                    GSTHSNCodes,
                    shopProfile
                  )
                    .then(() => {
                      setIsPDFPrinting(false);
                      setPrintingRowId(null);
                      setShowToast(true);
                      setToastMessage("PDF printed successfully");
                    })
                    .catch(() => {
                      setIsPDFPrinting(false);
                      setPrintingRowId(null);
                    });
                  setPrintingRowId(id);
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
                <VscSend
                  style={{
                    height: "22px",
                    width: "25px",
                    cursor: "pointer",
                    padding: "4px",
                    border: "1px solid black",
                    borderRadius: "6px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    color: "black",
                    transition: "all 0.3s ease",
                    backgroundColor: "white",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => {
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
                      })
                        .then(() => {
                          setIsSending(false);
                          setSendingRowId(null);
                          setShowToast(true);
                          setToastMessage("Invoice sent successfully");
                        })
                        .catch(() => {
                          setIsSending(false);
                          setSendingRowId(null);
                        });
                    }
                  }}
                />
              )}
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Frame>
      <Page title="All Orders" fullWidth>
        {/* {showToast.active && (
          <Toast
            content={showToast.message}
            onDismiss={() => setShowToast({ active: false, message: "" })}
            error={showToast.error}
          />
        )} */}
        {loading ? (
          <SkeletonPage primaryAction>
            <SkeletonDisplayText size="large" />
            <SkeletonBodyText lines={3} />
          </SkeletonPage>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                gap: "10px",
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
              <Button
                primary
                disabled={isPDFGeneratingBulk ? true : false}                onClick={() => {
                  // handleBulkPrintDownload(
                  //   orders.filter((order) =>
                  //     selectedResources.includes(order.id)
                  //   ),
                  //   shopdetails,
                  //   currentTemplateId
                  // )
                  setIsPDFGeneratingBulk(true);
                  if(!isPDFGeneratingBulk){
                  handleBulkPdfDownload(
                    paginatedOrders.slice(0, 10), // Get first 10 orders
                    shopdetails,
                    currentTemplateId,
                    InvoiceSetting2,
                    GSTHSNCodes,
                    shopProfile
                  ).then(() => {
                    setIsPDFGeneratingBulk(false);
                    setShowToast(true);
                    setToastMessage("PDF generated successfully");
                  })
                  .catch(() => {
                    setIsPDFGeneratingBulk(false);
                    setShowToast(true);
                    setToastMessage("Error while generating PDF");
                  });
                }
                }}
                // disabled={selectedResources.length < 1 || selectedResources.length > 10}
              >
                {isPDFGeneratingBulk ? (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
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
                <FaArrowAltCircleDown style={{ height: "20px", width: "20px" }} />)}
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
                  setIsPDFPrintingBulk(true);
                  if(!isPDFPrintingBulk){
                    handleBulkPrint(
                      paginatedOrders.slice(0, 10), // Get first 10 orders
                      shopdetails,
                      currentTemplateId,
                      InvoiceSetting2,
                      GSTHSNCodes,
                      shopProfile
                    ).then(() => {
                      setIsPDFPrintingBulk(false);
                      setShowToast(true);
                      setToastMessage("PDF printed successfully");
                    })
                    .catch(() => {
                      setIsPDFPrintingBulk(false);
                      setShowToast(true);
                      setToastMessage("Error while printing PDF");
                    });
                  }
                  
                }}
                // disabled={selectedResources.length < 1 || selectedResources.length > 10}
              >
                {isPDFPrintingBulk ? (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
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

            <AlphaCard>
              <IndexTable
                resourceName={{ singular: "order", plural: "orders" }}
                itemCount={filteredOrders.length}
                selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
                onSelectionChange={handleSelectionChange}
                headings={[
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
                  hasPrevious={currentPage > 1}
                  onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  hasNext={currentPage * itemsPerPage < filteredOrders.length}
                  onNext={() => setCurrentPage((prev) => prev + 1)}
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
