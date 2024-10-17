import React, { useEffect, useState, useCallback } from 'react';
import {
  AppProvider,
  Page,
  AlphaCard,
  IndexTable,
  TextStyle,
  Badge,
  Button,
  ButtonGroup,
} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import { PrintMinor, ImportMinor } from '@shopify/polaris-icons';

export function IndexTableEx({ value }) {
  const [orders, setOrders] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);

  useEffect(() => {
    fetch('/api/orders/all', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((request) => request.json())
      .then((response) => {
        console.log("Fetched orders:", response); // Check the structure here
        if (response.data) {
            setOrders(response.data);
        }
  
        // Assuming response.data is the array of orders
        if (response.data) {
          setOrders(response.data); // Set the orders from the response
        }
      })
      .catch((error) => console.log(error));
  }, []); // Run only once on component mount

  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  const handlePdfDownload = useCallback(() => {
    alert('Download PDF functionality here!');
  }, []);

  const handlePrint = useCallback(() => {
    alert('Print functionality here!');
  }, []);

const rowMarkup = orders.map(({ order_number, created_at, customer, total_price, financial_status, fulfillment_status }) => (
    <IndexTable.Row id={order_number} key={order_number} selected={selectedResources.includes(order_number)}>
      <IndexTable.Cell>
        <TextStyle variation="strong">{order_number}</TextStyle>
      </IndexTable.Cell>
      <IndexTable.Cell>{created_at}</IndexTable.Cell>
      <IndexTable.Cell>{`${customer?.first_name|| 'Unknown'} ${customer?.last_name || ''}` }</IndexTable.Cell> {/* Accessing customer name */}
      <IndexTable.Cell>{total_price}</IndexTable.Cell>
      <IndexTable.Cell>
        <Badge status={financial_status === 'Pending' ? 'attention' : financial_status === 'Paid' ? 'success' : 'default'}>
          {financial_status}
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge status="attention">{fulfillment_status}</Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <ButtonGroup>
          <Button primary icon={ImportMinor} onClick={handlePdfDownload}></Button>
          <Button icon={PrintMinor} onClick={handlePrint}>Print</Button>
        </ButtonGroup>
      </IndexTable.Cell>
    </IndexTable.Row>
));


  return (
    <Page title="Orders" fullWidth>
      <AlphaCard>
        <IndexTable
          fullWidth
          resourceName={resourceName}
          itemCount={orders.length}
          selectedItemsCount={selectedResources.length}
          onSelectionChange={setSelectedResources}
          headings={[
            { title: 'Order' },
            { title: 'Date' },
            { title: 'Customer' },
            { title: 'Total' },
            { title: 'Payment Status' },
            { title: 'Fulfillment Status' },
            { title: 'Actions' },
          ]}
          selectable={false}
        >
          {rowMarkup}
        </IndexTable>
      </AlphaCard>
    </Page>
  );
}
