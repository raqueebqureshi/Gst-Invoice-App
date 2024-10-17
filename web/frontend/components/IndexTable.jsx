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
        console.log('orders details', response);
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

  const rowMarkup = orders.map(({ id, date, customer, total, paymentStatus, fulfillmentStatus }) => (
    <IndexTable.Row id={id} key={id} selected={selectedResources.includes(id)}>
      <IndexTable.Cell>
        <TextStyle variation="strong">{id}</TextStyle>
      </IndexTable.Cell>
      <IndexTable.Cell>{date}</IndexTable.Cell>
      <IndexTable.Cell>{customer}</IndexTable.Cell>
      <IndexTable.Cell>{total}</IndexTable.Cell>
      <IndexTable.Cell>
        <Badge status={paymentStatus === 'Pending' ? 'attention' : paymentStatus === 'Paid' ? 'success' : 'default'}>
          {paymentStatus}
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge status="attention">{fulfillmentStatus}</Badge>
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
