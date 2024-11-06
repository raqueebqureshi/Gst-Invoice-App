import React, { useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  Page,
  AlphaCard,
  IndexTable,
  TextStyle,
  Badge,
  Button,
  ButtonGroup,
  Spinner
} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import { PrintMinor, ImportMinor } from '@shopify/polaris-icons';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import { InvoiceTemplate1 } from "../invoiceTemplates/invoice-template1";
import { InvoiceTemplate2 } from "../invoiceTemplates/invoice-template2";
import { InvoiceTemplate3 } from "../invoiceTemplates/invoice-template3";
// import { DateTime } from 'luxon';

export function IndexTableEx({ value , shopdetails }) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [storeDomain, setStoreDomain] = useState(null);
   // Fetch the store domain
   useEffect(() => {
    console.log("Fetching store details...");
    fetch("/api/shop/all", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
      console.log("Store data fetched:", data);
      if (data.data && data.data.length > 0) {
        // Access the domain from the correct property
        setStoreDomain(data.data[0].domain); 
        console.log("Store domain set:", data.data[0].domain);
      }
    })
    .catch(error => console.log("Error fetching store details:", error));
  }, []);


  //fetch seleceted invoice template from database
  useEffect(() => {
    if (storeDomain) {
      fetch(`/api/get-invoice-template?storeDomain=${storeDomain}`)
        .then(response => response.json())
        .then(data => {
          if (data.storeInvoiceTemplate) {
            console.log("Fetched template ID from DB:", data.storeInvoiceTemplate);
            setCurrentTemplateId(data.storeInvoiceTemplate); // Store template ID for comparison or other use
            
          }
        })
        .catch(error => console.error("Error fetching template ID:", error));
    }
  }, [storeDomain]);
  // console.log('Store template ID for comparison or other use:', currentTemplateId);
  // useEffect(() => {
  //   if (currentTemplateId !== null) {
  //     console.log('Updated currentTemplateId:', currentTemplateId);
  //   }
  // }, [currentTemplateId]);
  
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Fetch orders data
  useEffect(() => {
    fetch('/api/2024-10/orders.json', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((request) => request.json())
      .then((response) => {
        if (response.data) {
          setOrders(response.data);
          setLoading(false);  // Stop loading when data is fetched
          console.log('orders' , response.data);
          console.log('store detail' , shopdetails);
          
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);  // Stop loading on error
      });
  }, []);

  

  const handlePdfDownload = useCallback(async (order, shopdetails , currentTemplate) => {
    console.log("orders - handlePdfDownload", order);
    console.log("store - details H", shopdetails);
  
    // Create a new element to render the invoice with specific A4 dimensions
    const invoiceContainer = document.createElement('div');
    invoiceContainer.style.width = '794px'; // Width of A4 at 96 DPI
    invoiceContainer.style.height = '1123px'; // Height of A4 at 96 DPI
    invoiceContainer.style.position = 'absolute';
    invoiceContainer.style.top = '-9999px'; // Hide the element
    document.body.appendChild(invoiceContainer);
  
    // Render InvoiceTemplate2 with A4 dimensions
    
    // ReactDOM.render(<InvoiceTemplate2 shopdetails={[shopdetails]} orders={[order]} />, invoiceContainer);
    console.log('Store template ID for comparison or other use:', typeof currentTemplate);
    // Assuming currentTemplateId is defined and has the value 1, 2, or 3
const renderInvoiceTemplate = (currentTemplate, shopdetails, order, invoiceContainer) => {

  console.log("currentTemplateId type", typeof currentTemplate , "currentTemplateId value", currentTemplate);

  

  switch (currentTemplate) {
    case "1":
      ReactDOM.render(<InvoiceTemplate1 shopdetails={[shopdetails]} orders={[order]} />, invoiceContainer);
      break;
    case "2":
      ReactDOM.render(<InvoiceTemplate2 shopdetails={[shopdetails]} orders={[order]} />, invoiceContainer);
      break;
    case "3":
      ReactDOM.render(<InvoiceTemplate3 shopdetails={[shopdetails]} orders={[order]} />, invoiceContainer);
      break;
    default:
      console.error("Invalid template ID:", currentTemplate);
  }
};


  renderInvoiceTemplate(currentTemplate, shopdetails, order, invoiceContainer);
    // Capture the invoice content using html2canvas with specified scale for high quality
    const canvas = await html2canvas(invoiceContainer, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
  
    // Remove the temporary invoice container
    document.body.removeChild(invoiceContainer);
  
    // Create PDF with A4 dimensions and apply a 20-point margin
    const pdf = new jsPDF("p", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
  
    // Calculate new dimensions to fit within the margin
    const imgWidth = pdfWidth - 2 * margin;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
    // Add the image to the PDF with a 20-point margin on all sides
    pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
  
    // Save PDF with the order number
    pdf.save(`Invoice-${order.order_number}.pdf`);
  }, []);
  
  
  
  

  
  
  

const handlePrint = useCallback(async (order, shopdetails, currentTemplate) => {
  console.log("orders - handlePrint", order);
  console.log("store - details H", shopdetails);

  // Create a new element to render the invoice
  const invoiceContainer = document.createElement('div');
  invoiceContainer.style.width = '794px'; // Width of A4 at 96 DPI
  invoiceContainer.style.height = '1123px'; // Height of A4 at 96 DPI
  invoiceContainer.style.position = 'absolute';
  invoiceContainer.style.top = '-9999px'; // Hide the element
  document.body.appendChild(invoiceContainer);

  // Render InvoiceTemplate3 with A4 dimensions
  // ReactDOM.render(<InvoiceTemplate3 shopdetails={[shopdetails]} orders={[order]} />, invoiceContainer);

  const renderInvoiceTemplate = (currentTemplate, shopdetails, order, invoiceContainer) => {

    console.log("currentTemplateId type", typeof currentTemplate , "currentTemplateId value", currentTemplate);
  
    
  
    switch (currentTemplate) {
      case "1":
        ReactDOM.render(<InvoiceTemplate1 shopdetails={[shopdetails]} orders={[order]} />, invoiceContainer);
        break;
      case "2":
        ReactDOM.render(<InvoiceTemplate2 shopdetails={[shopdetails]} orders={[order]} />, invoiceContainer);
        break;
      case "3":
        ReactDOM.render(<InvoiceTemplate3 shopdetails={[shopdetails]} orders={[order]} />, invoiceContainer);
        break;
      default:
        console.error("Invalid template ID:", currentTemplate);
    }
  };
  
  
    renderInvoiceTemplate(currentTemplate, shopdetails, order, invoiceContainer);

  // Capture the invoice content using html2canvas
  const canvas = await html2canvas(invoiceContainer, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");

  // Remove the temporary invoice container
  document.body.removeChild(invoiceContainer);

  // Open a new window and write the captured content for printing
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
         <title></title>
        <style>
          body, html { margin: 0; padding: 0; }
          img { width: 99%; height: 100%;  }
        </style>
      </head>
      <body>
        <img src="${imgData}" alt="Invoice" align="center" />
      </body>
    </html>
  `);

  // Wait for the image to load in the new window before printing
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
}, []);

  
  
  

  // const handlePrint = useCallback((order) => {
  //   const printContent = `
  //     <div>
  //       <h2>Invoice for Order #${order.order_number}</h2>
  //       <p>Customer: ${order.customer.first_name} ${order.customer.last_name}</p>
  //       <p>Total: ${order.total_price}</p>
  //       <p>Payment Status: ${order.financial_status}</p>
  //     </div>
  //   `;
  //   const newWindow = window.open();
  //   newWindow.document.write(printContent);
  //   newWindow.print();
  // }, []);


  let ordersIndex = {};
  const rowMarkup = orders.map((order) => (
    ordersIndex = order ,
    
    <IndexTable.Row
      id={order.order_number}
      key={order.order_number}
      selected={selectedResources.includes(order.order_number)}
    >
      <IndexTable.Cell>
        <TextStyle variation="strong">{order.order_number}</TextStyle>
      </IndexTable.Cell>
      <IndexTable.Cell>{formatDateTime(order.created_at)}</IndexTable.Cell>
      <IndexTable.Cell>{`${order.customer?.first_name || 'Unknown'} ${order.customer?.last_name || ''}`}</IndexTable.Cell>
      <IndexTable.Cell>{order.total_price}</IndexTable.Cell>
      <IndexTable.Cell>
        <Badge
          status={
            order.financial_status === 'Pending'
              ? 'attention'
              : order.financial_status === 'Paid'
              ? 'success'
              : 'default'
          }
        >
          {order.financial_status}
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <ButtonGroup>
          <Button primary onClick={() => handlePdfDownload(order, shopdetails, currentTemplateId)}>Download PDF</Button>
          <Button onClick={() => handlePrint(order, shopdetails, currentTemplateId)}>Print</Button>
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Spinner accessibilityLabel="Loading Spinner" size="large" />
        </div>
      ) : (
        <Page title="Orders" fullWidth>
          <AlphaCard>
            <IndexTable
              fullWidth
              resourceName={{ singular: 'order', plural: 'orders' }}
              itemCount={orders.length}
              selectedItemsCount={selectedResources.length}
              onSelectionChange={setSelectedResources}
              headings={[
                { title: 'Order' },
                { title: 'Date' },
                { title: 'Customer' },
                { title: 'Total' },
                { title: 'Payment Status' },
                { title: 'Actions' },
              ]}
              selectable={false}
            >
              {rowMarkup}
            </IndexTable>
          </AlphaCard>
          <div style={{ height: '20px' }}></div>

         
        </Page>
      )}
    </>
  );
}
