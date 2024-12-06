// import React, { useEffect, useState, useCallback } from "react";
// import { FaPrint, FaDownload, FaEnvelope, FaSearch  } from "react-icons/fa"; // FontAwesome icons
// import { Pagination } from "@shopify/polaris";
// import { useIndexResourceState , FooterHelp, Link } from "@shopify/polaris";
// import ReactDOM from "react-dom";

// import {
//   Page,
//   AlphaCard,
//   IndexTable,
//   Text,
//   Badge,
//   Button,
//   ButtonGroup,
//   Spinner,
// } from "@shopify/polaris";
// import "@shopify/polaris/build/esm/styles.css";
// import { PrintMinor, ImportMinor } from "@shopify/polaris-icons";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import "jspdf-autotable";
// import { InvoiceTemplate1 } from "../invoiceTemplates/invoice-template1";
// import { InvoiceTemplate2 } from "../invoiceTemplates/invoice-template2";
// import { InvoiceTemplate3 } from "../invoiceTemplates/invoice-template3";
// // import { DateTime } from 'luxon';

// export function IndexTableEx({ value, shopdetails }) {
//   const [loading, setLoading] = useState(true);
//   const [orders, setOrders] = useState([]);
//   // const [selectedResources, setSelectedResources] = useState([]);
//   const [currentTemplateId, setCurrentTemplateId] = useState(null);
//   const [storeDomain, setStoreDomain] = useState(null);
//   // Fetch the store domain
//   useEffect(() => {
//     console.log("Fetching store details...", shopdetails);

//     fetch("/api/2024-10/shop.json", {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         // console.log("Store data fetched:", data.data.data.length);
//         if (data.data.data && data.data.data.length > 0) {
//           // Access the domain from the correct property
//           setStoreDomain(data.data.data[0].domain);
//           console.log("Store domain set:", data.data.data[0]);
//         }
//       })
//       .catch((error) => console.log("Error fetching store details:", error));
//   }, []);

//   //fetch seleceted invoice template from database
//   useEffect(() => {
//     if (storeDomain) {
//       fetch(`/api/get-invoice-template?storeDomain=${storeDomain}`)
//         .then((response) => response.json())
//         .then((data) => {
//           // console.log('data template', data);
//           if (data.storeInvoiceTemplate) {
//             console.log(
//               "Fetched template ID from DB:",
//               data.storeInvoiceTemplate
//             );
//             setCurrentTemplateId(data.storeInvoiceTemplate); // Store template ID for comparison or other use
//           }
//         })
//         .catch((error) => console.error("Error fetching template ID:", error));
//     }
//   }, [storeDomain]);
//   // console.log('Store template ID for comparison or other use:', currentTemplateId);
//   // useEffect(() => {
//   //   if (currentTemplateId !== null) {
//   //     console.log('Updated currentTemplateId:', currentTemplateId);
//   //   }
//   // }, [currentTemplateId]);

//   const formatDateTime = (dateString) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//     }).format(date);
//   };

//   // Fetch orders data
//   useEffect(() => {
//     fetch("/api/2024-10/orders.json", {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     })
//       .then((request) => request.json())
//       .then((response) => {
//         if (response.data) {
//           console.log('response.data', response.data);
//           setOrders(response.data);
//           setLoading(false); // Stop loading when data is fetched
//           // console.log('orders' , response.data[0].financial_status);
//           // console.log('store detail' , shopdetails);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//         setLoading(false); // Stop loading on error
//       });
//   }, []);

//   const handlePdfDownload = useCallback(
//     async (order, shopdetails, currentTemplate) => {
//       // console.log("orders - handlePdfDownload", order);
//       console.log("store - details H", shopdetails);

//       // Create a new element to render the invoice with specific A4 dimensions
//       const invoiceContainer = document.createElement("div");
//       invoiceContainer.style.width = "794px"; // Width of A4 at 96 DPI
//       invoiceContainer.style.height = "1123px"; // Height of A4 at 96 DPI
//       invoiceContainer.style.position = "absolute";
//       invoiceContainer.style.top = "-9999px"; // Hide the element
//       document.body.appendChild(invoiceContainer);

//       // Render InvoiceTemplate2 with A4 dimensions

//       // ReactDOM.render(<InvoiceTemplate2 shopdetails={[shopdetails]} orders={[order]} />, invoiceContainer);
//       // console.log('Store template ID for comparison or other use:', typeof currentTemplate);
//       // Assuming currentTemplateId is defined and has the value 1, 2, or 3
//       const renderInvoiceTemplate = (
//         currentTemplate,
//         shopdetails,
//         order,
//         invoiceContainer
//       ) => {
//         // console.log("currentTemplateId type", typeof currentTemplate , "currentTemplateId value", currentTemplate);

//         switch (currentTemplate) {
//           case "1":
//             ReactDOM.render(
//               <InvoiceTemplate1 shopdetails={[shopdetails]} orders={[order]} />,
//               invoiceContainer
//             );
//             break;
//           case "2":
//             ReactDOM.render(
//               <InvoiceTemplate2 shopdetails={[shopdetails]} orders={[order]} />,
//               invoiceContainer
//             );
//             break;
//           case "3":
//             ReactDOM.render(
//               <InvoiceTemplate3 shopdetails={[shopdetails]} orders={[order]} />,
//               invoiceContainer
//             );
//             break;
//           default:
//             console.error("Invalid template ID:", currentTemplate);
//         }
//       };

//       renderInvoiceTemplate(
//         currentTemplate,
//         shopdetails,
//         order,
//         invoiceContainer
//       );
//       // Capture the invoice content using html2canvas with specified scale for high quality
//       const canvas = await html2canvas(invoiceContainer, {
//         scale: 2,
//         useCORS: true,
//       });
//       const imgData = canvas.toDataURL("image/png");

//       // Remove the temporary invoice container
//       document.body.removeChild(invoiceContainer);

//       // Create PDF with A4 dimensions and apply a 20-point margin
//       const pdf = new jsPDF("p", "pt", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();
//       const margin = 10;

//       // Calculate new dimensions to fit within the margin
//       const imgWidth = pdfWidth - 2 * margin;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       // Add the image to the PDF with a 20-point margin on all sides
//       pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);

//       // Save PDF with the order number
//       pdf.save(`Invoice-${order.order_number}.pdf`);
//     },
//     []
//   );

//   const handlePrint = useCallback(
//     async (order, shopdetails, currentTemplate) => {
//       // console.log("orders - handlePrint", order);
//       // console.log("store - details H", shopdetails);

//       // Create a new element to render the invoice
//       const invoiceContainer = document.createElement("div");
//       invoiceContainer.style.width = "794px"; // Width of A4 at 96 DPI
//       invoiceContainer.style.height = "1123px"; // Height of A4 at 96 DPI
//       invoiceContainer.style.position = "absolute";
//       invoiceContainer.style.top = "-9999px"; // Hide the element
//       document.body.appendChild(invoiceContainer);

//       // Render InvoiceTemplate3 with A4 dimensions
//       // ReactDOM.render(<InvoiceTemplate3 shopdetails={[shopdetails]} orders={[order]} />, invoiceContainer);

//       const renderInvoiceTemplate = (
//         currentTemplate,
//         shopdetails,
//         order,
//         invoiceContainer
//       ) => {
//         // console.log("currentTemplateId type", typeof currentTemplate , "currentTemplateId value", currentTemplate);

//         switch (currentTemplate) {
//           case "1":
//             ReactDOM.render(
//               <InvoiceTemplate1 shopdetails={[shopdetails]} orders={[order]} />,
//               invoiceContainer
//             );
//             break;
//           case "2":
//             ReactDOM.render(
//               <InvoiceTemplate2 shopdetails={[shopdetails]} orders={[order]} />,
//               invoiceContainer
//             );
//             break;
//           case "3":
//             ReactDOM.render(
//               <InvoiceTemplate3 shopdetails={[shopdetails]} orders={[order]} />,
//               invoiceContainer
//             );
//             break;
//           default:
//             console.error("Invalid template ID:", currentTemplate);
//         }
//       };

//       renderInvoiceTemplate(
//         currentTemplate,
//         shopdetails,
//         order,
//         invoiceContainer
//       );

//       // Capture the invoice content using html2canvas
//       const canvas = await html2canvas(invoiceContainer, {
//         scale: 2,
//         useCORS: true,
//       });
//       const imgData = canvas.toDataURL("image/png");

//       // Remove the temporary invoice container
//       document.body.removeChild(invoiceContainer);

//       // Open a new window and write the captured content for printing
//       const printWindow = window.open("", "_blank");
//       printWindow.document.write(`
//     <html>
//       <head>
//          <title></title>
//         <style>
//           body, html { margin: 0; padding: 0; }
//           img { width: 99%; height: 100%;  }
//         </style>
//       </head>
//       <body>
//         <img src="${imgData}" alt="Invoice" align="center" />
//       </body>
//     </html>
//   `);

//       // Wait for the image to load in the new window before printing
//       printWindow.document.close();
//       printWindow.onload = () => {
//         printWindow.print();
//         printWindow.close();
//       };
//     },
//     []
//   );

//   const { selectedResources, allResourcesSelected, handleSelectionChange } =
//     useIndexResourceState(orders);

//   let ordersIndex = {};
//   const rowMarkup = orders.map(
//     (
//       { id, order_number, created_at, customer, total_price, financial_status },
//       index
//     ) => (
//       <IndexTable.Row
//         id={id}
//         key={id}
//         selected={selectedResources.includes(id)}
//         position={index}
//       >
//         <IndexTable.Cell>
//           <Text variation="strong">{order_number}</Text>
//         </IndexTable.Cell>
//         <IndexTable.Cell>{formatDateTime(created_at)}</IndexTable.Cell>
//         <IndexTable.Cell>{`${customer?.first_name || "Unknown"} ${
//           customer?.last_name || ""
//         }`}</IndexTable.Cell>
//         <IndexTable.Cell>{total_price}</IndexTable.Cell>
//         <IndexTable.Cell>
//           <Badge
//             status={
//               financial_status === "pending" // Check for 'pending'
//                 ? "attention" // Yellow
//                 : financial_status === "paid" // Check for 'paid'
//                 ? "success" // Green
//                 : "default" // Gray for other statuses
//             }
//           >
//             {/* Safely handle financial_status and capitalize the first letter */}
//             {financial_status
//               ? financial_status.charAt(0).toUpperCase() +
//                 financial_status.slice(1)
//               : "Unknown Status"}
//           </Badge>
//         </IndexTable.Cell>
//         <IndexTable.Cell>
//           <ButtonGroup>
//             <Button
//               plain
//               icon={<FaDownload />} // Using FaDownload icon
//               onClick={() =>
//                 handlePdfDownload(orders[index], shopdetails, currentTemplateId)
//               }
//             />
//             <Button
//               plain
//               icon={<FaPrint />} // Using FaPrint icon
//               onClick={() =>
//                 handlePrint(orders[index], shopdetails, currentTemplateId)
//               }
//             />
//             <Button
//               plain
//               icon={<FaEnvelope />} // Using FaPrint icon
//               onClick={() =>
//                 handlePrint(orders, shopdetails, currentTemplateId)
//               }
//             />
//           </ButtonGroup>
//         </IndexTable.Cell>
//       </IndexTable.Row>
//     )
//   );

//   <Pagination
//   // hasPrevious={currentPage > 1}
//   // hasNext={currentPage < totalPages}
//   // onPrevious={() => setCurrentPage(currentPage - 1)}
//   // onNext={() => setCurrentPage(currentPage + 1)}
//   />;
//   const handleNextPage = () => {
//     console.log("Load next page");
//   };

//   const handlePreviousPage = () => {
//     console.log("Load previous page");
//   };

//   return (
//     <>
//       {loading ? (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             marginTop: "200px",
//           }}
//         >
//           <Spinner accessibilityLabel="Loading Spinner" size="large" />
//         </div>
//       ) : (

//         <Page title="All Orders" fullWidth>
//         {/* Wrap the Bulk Action button and table inside a flex container */}
//         <div style={{ display: "flex", justifyContent: "between", marginBottom: "10px", gap:"10px" }}>

//           <input type="text" placeholder="Enter : Order No, Invoice No, Customer Name" style={{width:"100%" ,borderRadius: "5px", paddingLeft:"15px", border: "1px solid black"}}/>
//           <button style={{ background: "#3F3D3D", color: "white", borderRadius: "5px", cursor: "pointer", padding:"10px", border: "1px solid black" }}>
//            <FaSearch />
//           </button>
//         </div>

//         <AlphaCard>
//           <IndexTable
//             resourceName={{ singular: "order", plural: "orders" }}
//             itemCount={orders.length}
//             selectedItemsCount={
//               allResourcesSelected ? "All" : selectedResources.length
//             }
//             onSelectionChange={handleSelectionChange}
//             headings={[
//               { title: "Order" },
//               { title: "Date" },
//               { title: "Customer" },
//               { title: "Total" },
//               { title: "Payment Status" },
//               { title: "Actions" },
//             ]}
//             pagination={{
//               // hasNext: hasMoreProducts, // Boolean value
//               // onNext: fetchNextProducts, // Function to handle fetching the next page
//             }}
//             selectable
//           >
//             {rowMarkup}
//           </IndexTable>
//         </AlphaCard>

//         <div style={{ height: "20px" }}></div>

//         <FooterHelp>
//           Need Help{' '}
//           <Link url="" removeUnderline>
//             please click here
//           </Link>
//         </FooterHelp>
//       </Page>

//       )}
//     </>
//   );
// }

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
import ReactDOM from "react-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import { InvoiceTemplate1 } from "../invoiceTemplates/invoice-template1";
import { InvoiceTemplate2 } from "../invoiceTemplates/invoice-template2";
import { InvoiceTemplate3 } from "../invoiceTemplates/invoice-template3";
import { useIndexResourceState } from "@shopify/polaris";
import { HorizontalDotsMinor } from "@shopify/polaris-icons";

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

export function IndexTableEx({ value, shopdetails }) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [storeDomain, setStoreDomain] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [showToast, setShowToast] = useState({
    active: false,
    message: "",
    error: false,
  });
  const [popoverActive, setPopoverActive] = useState({});

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
        if (data.data.data && data.data.data.length > 0) {
          setStoreDomain(data.data.data[0].domain);
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
          setOrders(response.data);
          setLoading(false);
          handleShowToast("Orders Synced Complete");
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        handleShowToast("Internal Server Error 500", true);
      });
  }, []);

  const togglePopoverActive = (orderId) => {
    setPopoverActive((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const handlePdfDownload = useCallback(
    async (order, shopdetails, currentTemplate) => {
      if (!order || !currentTemplate) return;

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
        invoiceContainer
      ) => {
        switch (currentTemplate) {
          case "1":
            ReactDOM.render(
              <InvoiceTemplate1 shopdetails={[shopdetails]} orders={[order]} />,
              invoiceContainer
            );
            break;
          case "2":
            ReactDOM.render(
              <InvoiceTemplate2 shopdetails={[shopdetails]} orders={[order]} />,
              invoiceContainer
            );
            break;
          case "3":
            ReactDOM.render(
              <InvoiceTemplate3 shopdetails={[shopdetails]} orders={[order]} />,
              invoiceContainer
            );
            break;
          default:
            console.error("Invalid template ID:", currentTemplate);
        }
      };

      renderInvoiceTemplate(currentTemplate, shopdetails, order, invoiceContainer);

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
    async (order, shopdetails, currentTemplate) => {
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
              <InvoiceTemplate1 shopdetails={[shopdetails]} orders={[order]} />,
              invoiceContainer
            );
            break;
          case "2":
            ReactDOM.render(
              <InvoiceTemplate2 shopdetails={[shopdetails]} orders={[order]} />,
              invoiceContainer
            );
            break;
          case "3":
            ReactDOM.render(
              <InvoiceTemplate3 shopdetails={[shopdetails]} orders={[order]} />,
              invoiceContainer
            );
            break;
          default:
            console.error("Invalid template ID:", currentTemplate);
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
    useIndexResourceState(paginatedOrders);

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
        onClick={(event) => {
          const clickedElement = event.target.closest(".btn-actions, .btn-popover");
          if (clickedElement) {
            event.stopPropagation();
          }
        }}
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
                  currentTemplateId
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
                  currentTemplateId
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
              <Popover
                active={popoverActive[id] || false}
                activator={
                  <Button
                    plain
                    icon={HorizontalDotsMinor}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePopoverActive(id);
                    }}
                    className="btn-popover"
                  />
                }
                onClose={() => togglePopoverActive(id)}
              >
                <ActionList
                  items={[{ content: "Quick Send" }, { content: "View Invoice" }]}
                />
              </Popover>
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
                itemCount={paginatedOrders.length}
                selectedItemsCount={
                  allResourcesSelected ? "All" : selectedResources.length
                }
                onSelectionChange={(selectedItems) => {
                  handleSelectionChange(selectedItems);
                  if (selectedItems.length > 10) {
                    handleShowToast("You can't print or download more than 10 orders in bulk", true);
                  }
                }}
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
              <Link url="" removeUnderline>
                please click here
              </Link>
            </FooterHelp>
          </>
        )}
      </Page>
    </Frame>
  );
}
