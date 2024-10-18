import React, { useEffect, useState, useCallback } from 'react';
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
import "jspdf-autotable";

export function IndexTableEx({ value }) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);

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
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);  // Stop loading on error
      });
  }, []);

  const handlePdfDownload = useCallback((order) => {
    const doc = new jsPDF();
  
    // Company Header (similar to your screenshot)
    doc.setFontSize(18);
    doc.text("Zylker Electronics Hub", 20, 20);
    doc.setFontSize(12);
    doc.text("148, Northern Street, Greater South Avenue", 20, 28);
    doc.text("New York, New York 10001, U.S.A.", 20, 34);
  
    // Invoice Title
    doc.setFontSize(22);
    doc.text("INVOICE", 160, 20);
  
    // Invoice Information (similar to screenshot)
    doc.setFontSize(12);
    doc.text(`Invoice # : INV-${order.order_number}`, 160, 30);
    doc.text(`Invoice Date: ${new Date(order.created_at).toLocaleDateString()}`, 160, 36);
    doc.text(`Due Date: ${new Date(order.created_at).toLocaleDateString()}`, 160, 42);
    doc.text(`Terms: Due on Receipt`, 160, 48);
  
    // Horizontal line separator
    doc.line(20, 50, 190, 50);
  
    // Billing and Shipping Section (as per your image)
    doc.setFontSize(12);
    doc.text("Bill To:", 20, 60);
    doc.text(`${order.customer.first_name} ${order.customer.last_name}`, 20, 66);
    doc.text(`${order.customer.address1 || 'Address not available'}`, 20, 72);
    doc.text(`${order.customer.city || ''} ${order.customer.zip || ''}`, 20, 78);
  
    doc.text("Ship To:", 130, 60);
    doc.text(`${order.customer.first_name} ${order.customer.last_name}`, 130, 66);
    doc.text(`${order.customer.address1 || 'Address not available'}`, 130, 72);
    doc.text(`${order.customer.city || ''} ${order.customer.zip || ''}`, 130, 78);
  
    // Adding Items Description Table (with headings like Item, Quantity, Rate, etc.)
    const items = order.line_items.map((item, index) => ([
      index + 1,
      item.name,
      item.quantity,
      `$${item.price}`,
      `$${(item.quantity * item.price).toFixed(2)}`,
    ]));
  
    doc.autoTable({
      startY: 100,
      head: [['#', 'Item & Description', 'Qty', 'Rate', 'Amount']],
      body: items,
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] }, // Style the header similar to your design.
    });
  
    // Calculating totals
    const subtotal = items.reduce((sum, item) => sum + (item[2] * parseFloat(item[3].slice(1))), 0);
    const taxRate = 0.05; // assuming a 5% tax rate
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;
  
    // Displaying totals (aligned to the right similar to the screenshot)
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, doc.autoTable.previous.finalY + 10);
    doc.text(`Tax (5%): $${taxAmount.toFixed(2)}`, 150, doc.autoTable.previous.finalY + 16);
    doc.text(`Total: $${totalAmount.toFixed(2)}`, 150, doc.autoTable.previous.finalY + 22);
    doc.text(`Balance Due: $${totalAmount.toFixed(2)}`, 150, doc.autoTable.previous.finalY + 28);
  
    // Footer Terms (as per your design)
    doc.text("Terms & Conditions", 20, doc.autoTable.previous.finalY + 50);
    doc.text("1. Full payment is due upon receipt of this invoice.", 20, doc.autoTable.previous.finalY + 56);
    doc.text("2. Late payments may incur additional charges as per applicable laws.", 20, doc.autoTable.previous.finalY + 62);
  
    // Save the PDF
    doc.save(`invoice_${order.order_number}.pdf`);
  }, []);
  
  

  const handlePrint = useCallback((order) => {
    const printContent = `
      <div>
        <h2>Invoice for Order #${order.order_number}</h2>
        <p>Customer: ${order.customer.first_name} ${order.customer.last_name}</p>
        <p>Total: ${order.total_price}</p>
        <p>Payment Status: ${order.financial_status}</p>
      </div>
    `;
    const newWindow = window.open();
    newWindow.document.write(printContent);
    newWindow.print();
  }, []);

  const rowMarkup = orders.map((order) => (
    <IndexTable.Row
      id={order.order_number}
      key={order.order_number}
      selected={selectedResources.includes(order.order_number)}
    >
      <IndexTable.Cell>
        <TextStyle variation="strong">{order.order_number}</TextStyle>
      </IndexTable.Cell>
      <IndexTable.Cell>{order.created_at}</IndexTable.Cell>
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
          <Button primary onClick={() => handlePdfDownload(order)}>Download PDF</Button>
          <Button onClick={() => handlePrint(order)}>Print</Button>
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
        </Page>
      )}
    </>
  );
}
