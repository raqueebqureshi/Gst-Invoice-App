//all imports are here
import React, { useEffect, useState, useCallback } from "react";
import { MdOutlineFileDownload, MdPrint } from "react-icons/md";
import { FaArrowAltCircleDown } from "react-icons/fa";
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
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [selectedFont, setSelectedFont] = useState("Roboto");
  
  const [storeDomain, setStoreDomain] = useState(null);
  const [email, setEmail] = useState(null);  
  const [GSTHSNCodes, setGSTHSNCodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [shopId, setShopId] = useState(null);
  const itemsPerPage = 20;
  const [showToast, setShowToast] = useState({
    active: false,
    message: "",
    error: false,
  });
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
  

  const handleShowToast = (message, error = false) => {
    setShowToast({ active: true, message, error });
  };

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
        }
      })
      .catch((error) => handleShowToast("Internal Server Error 500", true));
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
        .catch((error) =>
           console.error("Error fetching template ID:", error));
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
          handleShowToast("Orders Synced Complete");
        }
      })
      .catch((error) => {
        //console.error(error);
        setLoading(false);
        handleShowToast("Internal Server Error 500", true);
      });
  }, []);

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
      })
        .then(() => setSendingStatus((prev) => ({ ...prev, [index]: false }))) // Reset on success
        .catch(() => setSendingStatus((prev) => ({ ...prev, [index]: false }))); // Reset on failure
    }
  };
 
  const sendInvoiceToCustomer = async (orderDetails, shopDetails, invoiceSettings, customerEmail, gstcodes,currentTemplateId ) => {
    try {
      setIsSending(true);
      // Fetch the generated PDF file as Blob
      const pdfBlob = await generatePDFBlob(orderDetails, shopDetails, invoiceSettings, currentTemplateId, gstcodes);
      
      // Create a FormData object to include the Blob and additional data
      const formData = new FormData();
      formData.append("file", pdfBlob, `Invoice-${orderDetails.order_number}.pdf`);
      formData.append("customerEmail", customerEmail);
      formData.append("orderId", orderDetails.order_number);
      formData.append("shopDetails", JSON.stringify(shopDetails));
      
      console.log("formData",formData);
      // Send request to the backend API
      const response = await fetch("/api/send-invoice", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {

        handleShowToast("Invoice sent successfully.");
      } else {
        const errorData = await response.json();
        console.error("Error sending invoice:", errorData);
        handleShowToast("Failed to send invoice.", true);
      }
    } catch (error) {
      //console.error("Error in sending invoice:", error);
      handleShowToast("An error occurred while sending the invoice.", true);
    }
  };
  
  // Helper function to generate PDF as Blob
  const generatePDFBlob = async (orderDetails, shopDetails, invoiceSettings, currentTemplateId, gstcodes) => {
    const pdf = new jsPDF("p", "pt", "a4");
  
    // Create an invoice container dynamically
    const invoiceContainer = document.createElement("div");
    invoiceContainer.style.width = "794px";
    invoiceContainer.style.height = "1123px";
    invoiceContainer.style.position = "absolute";
    invoiceContainer.style.top = "-9999px";
    document.body.appendChild(invoiceContainer);
  
    //console.log(currentTemplateId, "currentTemplateId");
    // Render the appropriate template into the container
    switch (currentTemplateId) {
      case "1":
        ReactDOM.render(
          <InvoiceTemplate1 shopdetails={[shopDetails]} orders={[orderDetails]} invoiceSettings={invoiceSettings} GSTHSNCodes={gstcodes}/>,
          invoiceContainer
        );
        break;
      case "2":
        ReactDOM.render(
          <InvoiceTemplate2 shopdetails={[shopDetails]} orders={[orderDetails]} invoiceSettings={invoiceSettings} GSTHSNCodes={gstcodes}/>,
          invoiceContainer
        );
        break;
      case "3":
        ReactDOM.render(
          <InvoiceTemplate3 shopdetails={[shopDetails]} orders={[orderDetails]} invoiceSettings={invoiceSettings} GSTHSNCodes={gstcodes}/>,
          invoiceContainer
        );
        break;
      default:
        //console.error("Invalid template ID:", currentTemplateId);
        throw new Error("Invalid template ID.");
    }
  
    // Convert the rendered HTML to a canvas and generate a PDF Blob
    const canvas = await html2canvas(invoiceContainer, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/jpeg");
  
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pdfWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    document.body.removeChild(invoiceContainer);
  
    // Return PDF as Blob
    return pdf.output("blob");
  };
  
  const quickSendInvoice = async ({orderDetails, shopDetails, invoiceSettings, customerEmail, gstcodes, currentTemplate}) => {
    //console.log("hhhhhhhhhhhhhhhhhhhhh",orderDetails, shopDetails, invoiceSettings, customerEmail, gstcodes, currentTemplate);
    try {
      await sendInvoiceToCustomer(orderDetails, shopDetails, invoiceSettings, customerEmail, gstcodes, currentTemplate);
    } catch (error) {
      //console.error("Error in Quick Send:", error);
      handleShowToast("An error occurred while sending the invoice.", true);
    }
  };
  
  
  
  

  const togglePopoverActive = (orderId) => {
    setPopoverActive((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
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
      console.log("Fetched GST Values:", data.gstValues);

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
      fetchGSTHSNValues() ; 
  }
}, [storeDomain, email]);

useEffect(() => {
  //console.log('GSTHSNCodes',GSTHSNCodes);
}, [GSTHSNCodes]);

  const handlePdfDownload = useCallback(
    async (order, shopdetails, currentTemplate ,invoiceSettings, GSTHSNCodes) => {
      if (!order || !currentTemplate) return;

      //console.log(order, shopdetails, currentTemplate, "PDF download");
      // Logic to generate and download PDF for the given order
      const pdf = new jsPDF("p", "pt", "a4");
      const invoiceContainer = document.createElement("div");
      invoiceContainer.style.width = "794px";
      invoiceContainer.style.height = "1123px";
      invoiceContainer.style.position = "absolute";
      invoiceContainer.style.top = "-9999px";
      document.body.appendChild(invoiceContainer);

      const renderInvoiceTemplate = (
        currentTemplate,
        shopdetails,
        order,
        invoiceContainer, GSTHSNCodes
      ) => {
        switch (currentTemplate) {
          case "1":
            ReactDOM.render(
              <InvoiceTemplate1 shopdetails={[shopdetails]} orders={[order]} invoiceSettings={invoiceSettings} GSTHSNCodes={GSTHSNCodes}/>,
              invoiceContainer
            );
            break;
          case "2":
            ReactDOM.render(
              <InvoiceTemplate2 shopdetails={[shopdetails]} orders={[order]} invoiceSettings={invoiceSettings} GSTHSNCodes={GSTHSNCodes}/>,
              invoiceContainer
            );
            break;
          case "3":
            ReactDOM.render(
              <InvoiceTemplate3 shopdetails={[shopdetails]} orders={[order]} invoiceSettings={invoiceSettings} GSTHSNCodes={GSTHSNCodes}/>,
              invoiceContainer
            );
            break;
          default:
            //console.error("Invalid template ID:", currentTemplate);
        }
      };

      renderInvoiceTemplate(currentTemplate, shopdetails, order, invoiceContainer, GSTHSNCodes);

      const canvas = await html2canvas(invoiceContainer, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      document.body.removeChild(invoiceContainer);

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`Invoice-${order.order_number}.pdf`);
    },
    []
  );

  const handlePrint = useCallback(
    async (order, shopdetails, currentTemplate, invoiceSettings, GSTHSNCodes) => {
      if (!order || !currentTemplate) return;

      // Logic to print the given order
      const invoiceContainer = document.createElement("div");
      invoiceContainer.style.width = "794px";
      invoiceContainer.style.height = "1123px";
      invoiceContainer.style.position = "absolute";
      invoiceContainer.style.top = "-9999px";
      document.body.appendChild(invoiceContainer);

      const renderInvoiceTemplate = (
        currentTemplate,
        shopdetails,
        order,
        invoiceContainer
      ) => {
        switch (currentTemplate) {
          case "1":
            ReactDOM.render(
              <InvoiceTemplate1 shopdetails={[shopdetails]} orders={[order]} invoiceSettings={invoiceSettings} GSTHSNCodes={GSTHSNCodes}/>,
              invoiceContainer
            );
            break;
          case "2":
            ReactDOM.render(
              <InvoiceTemplate2 shopdetails={[shopdetails]} orders={[order]} invoiceSettings={invoiceSettings} GSTHSNCodes={GSTHSNCodes}/>,
              invoiceContainer
            );
            break;
          case "3":
            ReactDOM.render(
              <InvoiceTemplate3 shopdetails={[shopdetails]} orders={[order]} invoiceSettings={invoiceSettings} GSTHSNCodes={GSTHSNCodes}/>,
              invoiceContainer
            );
            break;
          default:
            //console.error("Invalid template ID:", currentTemplate);
        }
      };

      renderInvoiceTemplate(currentTemplate, shopdetails, order, invoiceContainer);

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
        </head>
        <body>${invoiceContainer.innerHTML}</body>
      </html>
      `);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };

      document.body.removeChild(invoiceContainer);
    },
    []
  );

  const filteredOrders = filterOrders(orders, searchQuery);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
  useIndexResourceState(orders.map((order) => order.id));

  const rowMarkup = paginatedOrders.map(
    (
      { id, order_number, created_at, customer, total_price, financial_status },
      index
    ) => (
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
          {loading ? <SkeletonBodyText lines={1} /> : `${customer?.first_name || "Unknown"} ${customer?.last_name || ""}`}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {loading ? <SkeletonBodyText lines={1} /> : total_price}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {loading ? (
            <SkeletonBodyText lines={1} />
          ) : (
            <Badge status={financial_status === "paid" ? "success" : "attention"}>
              {financial_status.charAt(0).toUpperCase() +
                financial_status.slice(1)}
            </Badge>
          )}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <ButtonGroup>
            <button
              style={{
                cursor: "pointer",
                padding: "4px",
                border: "1px solid black",
                borderRadius: "6px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                color: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                backgroundColor: "white",
                opacity: selectedResources.length > 1 ? "0.5" : "1",
                pointerEvents: selectedResources.length > 1 ? "none" : "auto",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handlePdfDownload(
                  paginatedOrders[index],
                  shopdetails,
                  currentTemplateId,
                  InvoiceSetting2,
                  GSTHSNCodes
                );
              }}
              className="btn-actions"
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "lightgray";
                e.currentTarget.style.color = "black";
                e.currentTarget.style.boxShadow = "0px 6px 8px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = "black";
                e.currentTarget.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  padding: "0",
                  alignItems: "center",
                }}
              >
                <MdOutlineFileDownload />
                <span style={{ fontSize: "10px" }}>PDF</span>
              </div>
            </button>

            <button
              style={{
                cursor: "pointer",
                padding: "4px",
                border: "1px solid black",
                borderRadius: "6px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                color: "black",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                backgroundColor: "white",
                opacity: selectedResources.length > 1 ? "0.5" : "1",
                pointerEvents: selectedResources.length > 1 ? "none" : "auto",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handlePrint(
                  paginatedOrders[index],
                  shopdetails,
                  currentTemplateId,
                  InvoiceSetting2,
                  GSTHSNCodes
                );
              }}
              className="btn-actions"
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "lightgray";
                e.currentTarget.style.color = "black";
                e.currentTarget.style.boxShadow = "0px 6px 8px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.color = "black";
                e.currentTarget.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  padding: "0",
                  alignItems: "center",
                }}
              >
                <MdPrint />
                <span style={{ fontSize: "10px" }}>PRINT</span>
              </div>
            </button>
            <div style={{ marginLeft: "20px" }}>
             
              {/* <ActionList
                    items={[
                      {
                        content: "Quick Send",
                        onAction: () => {
                          //console.log('shopDetails', shopdetails);
                          quickSendInvoice(
                            {
                              orderDetails: paginatedOrders[index],
                              shopDetails: shopdetails,
                              invoiceSettings: InvoiceSetting2,
                              customerEmail: paginatedOrders[index].customer.email,
                              gstcodes: GSTHSNCodes,
                              currentTemplate: currentTemplateId,
                              
                            }
                          );
                        },
                      },
                      { content: "View Invoice" },
                    ]}
                  /> */}
                  <div
                  key={index}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isSending ? (
        <Spinner accessibilityLabel="Sending invoice" size="small" />
      ) : (
        <VscSend
          style={{
            height: "25px",
            width: "25px",
            cursor: "pointer",
            padding: "4px",
            border: "1px solid black",
            borderRadius: "6px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            color: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            backgroundColor: "white",
            opacity: isSending ? "0.5" : "1",
            pointerEvents: isSending ? "none" : "auto",
          }}
          onClick={() => {
            if (!isSending) {
              setIsSending(true);
              quickSendInvoice({
                orderDetails: paginatedOrders[index],
                shopDetails: shopdetails,
                invoiceSettings: InvoiceSetting2,
                customerEmail: paginatedOrders[index].customer.email,
                gstcodes: GSTHSNCodes,
                currentTemplate: currentTemplateId,
              })
                .then(() => setIsSending(false))
                .catch(() => setIsSending(false));
            }
          }}
        />
      )}
    </div>
            </div>
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Frame>
      <Page title="All Orders" fullWidth>
        {showToast.active && (
          <Toast
            content={showToast.message}
            onDismiss={() => setShowToast({ active: false, message: "" })}
            error={showToast.error}
          />
        )}
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
                onClick={() =>
                  handleBulkPrintDownload(
                    orders.filter((order) =>
                      selectedResources.includes(order.id)
                    ),
                    shopdetails,
                    currentTemplateId
                  )
                }
                disabled={selectedResources.length < 1 || selectedResources.length > 10}
              >
                <FaArrowAltCircleDown
                  style={{ height: "20px", width: "20px" }}
                />
              </Button>
              <Button
                primary
                onClick={() =>
                  handleBulkPrintDownload(
                    orders.filter((order) =>
                      selectedResources.includes(order.id)
                    ),
                    shopdetails,
                    currentTemplateId
                  )
                }
                disabled={selectedResources.length < 1 || selectedResources.length > 10}
              >
                <MdPrint style={{ height: "20px", width: "20px" }} />
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
                  onPrevious={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  hasNext={currentPage * itemsPerPage < filteredOrders.length}
                  onNext={() => setCurrentPage((prev) => prev + 1)}
                />
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
