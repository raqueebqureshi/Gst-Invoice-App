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

    doc.text(`Invoice for Order #${order.order_number}`, 10, 10);
    doc.text(`Customer: ${order.customer.first_name} ${order.customer.last_name}`, 10, 20);
    doc.text(`Total: ${order.total_price}`, 10, 30);
    doc.text(`Payment Status: ${order.financial_status}`, 10, 40);

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
