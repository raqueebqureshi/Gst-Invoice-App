import React, { useState, useCallback } from 'react';
import {
  AppProvider,
  Page,
  AlphaCard,
  IndexTable,
  TextStyle,
  Badge,
  Button,
  ButtonGroup
} from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import {PrintMinor} from '@shopify/polaris-icons';
import {
  ImportMinor
} from '@shopify/polaris-icons';
import "@shopify/polaris/build/esm/styles.css";



let orders =[];

export function IndexTableEx({value}) {

  if (value == 1) {
   orders = [
    { id: '1008', date: '10/9/2024', customer: 'Shivam', total: '₹875.0', paymentStatus: 'Pending', fulfillmentStatus: 'Unfulfilled' },
    { id: '1007', date: '10/9/2024', customer: 'Shivam', total: '₹2.0', paymentStatus: 'Paid', fulfillmentStatus: 'Unfulfilled' },
    { id: '1006', date: '10/8/2024', customer: 'Chetan', total: '₹875.0', paymentStatus: 'Pending', fulfillmentStatus: 'Unfulfilled' },
    { id: '1005', date: '10/1/2024', customer: 'Shivam', total: '₹1.9', paymentStatus: 'Refunded', fulfillmentStatus: 'Unfulfilled' },
    { id: '1004', date: '10/1/2024', customer: 'Shivam', total: '₹1.9', paymentStatus: 'Refunded', fulfillmentStatus: 'Unfulfilled' },
  ];
  }else{
     orders = [
      { id: '1020', date: '10/9/2024', customer: 'Shivam', total: '₹875.0', paymentStatus: 'Pending', fulfillmentStatus: 'Unfulfilled' },
      { id: '1019', date: '10/9/2024', customer: 'Shivam', total: '₹2.0', paymentStatus: 'Paid', fulfillmentStatus: 'Unfulfilled' },
      { id: '1018', date: '10/8/2024', customer: 'Chetan', total: '₹875.0', paymentStatus: 'Pending', fulfillmentStatus: 'Unfulfilled' },
      { id: '1017', date: '10/1/2024', customer: 'Shivam', total: '₹1.9', paymentStatus: 'Refunded', fulfillmentStatus: 'Unfulfilled' },
      { id: '1016', date: '10/1/2024', customer: 'Shivam', total: '₹1.9', paymentStatus: 'Refunded', fulfillmentStatus: 'Unfulfilled' },
      { id: '1015', date: '10/9/2024', customer: 'Shivam', total: '₹875.0', paymentStatus: 'Pending', fulfillmentStatus: 'Unfulfilled' },
      { id: '1014', date: '10/9/2024', customer: 'Shivam', total: '₹2.0', paymentStatus: 'Paid', fulfillmentStatus: 'Unfulfilled' },
      { id: '1013', date: '10/8/2024', customer: 'Chetan', total: '₹875.0', paymentStatus: 'Pending', fulfillmentStatus: 'Unfulfilled' },
      { id: '1012', date: '10/1/2024', customer: 'Shivam', total: '₹1.9', paymentStatus: 'Refunded', fulfillmentStatus: 'Unfulfilled' },
      { id: '1011', date: '10/1/2024', customer: 'Shivam', total: '₹1.9', paymentStatus: 'Refunded', fulfillmentStatus: 'Unfulfilled' },
      { id: '1010', date: '10/9/2024', customer: 'Shivam', total: '₹875.0', paymentStatus: 'Pending', fulfillmentStatus: 'Unfulfilled' },
      { id: '1009', date: '10/9/2024', customer: 'Shivam', total: '₹2.0', paymentStatus: 'Paid', fulfillmentStatus: 'Unfulfilled' },
      { id: '1008', date: '10/8/2024', customer: 'Chetan', total: '₹875.0', paymentStatus: 'Pending', fulfillmentStatus: 'Unfulfilled' },
      { id: '1007', date: '10/1/2024', customer: 'Shivam', total: '₹1.9', paymentStatus: 'Refunded', fulfillmentStatus: 'Unfulfilled' },
      { id: '1006', date: '10/1/2024', customer: 'Shivam', total: '₹1.9', paymentStatus: 'Refunded', fulfillmentStatus: 'Unfulfilled' },
      { id: '1005', date: '10/9/2024', customer: 'Shivam', total: '₹875.0', paymentStatus: 'Pending', fulfillmentStatus: 'Unfulfilled' },
      { id: '1004', date: '10/9/2024', customer: 'Shivam', total: '₹2.0', paymentStatus: 'Paid', fulfillmentStatus: 'Unfulfilled' },
      { id: '1003', date: '10/8/2024', customer: 'Chetan', total: '₹875.0', paymentStatus: 'Pending', fulfillmentStatus: 'Unfulfilled' },
      { id: '1002', date: '10/1/2024', customer: 'Shivam', total: '₹1.9', paymentStatus: 'Refunded', fulfillmentStatus: 'Unfulfilled' },
      { id: '1001', date: '10/1/2024', customer: 'Shivam', total: '₹1.9', paymentStatus: 'Refunded', fulfillmentStatus: 'Unfulfilled' },
    ];
  }
  const resourceName = {
    singular: 'order',
    plural: 'orders',
  };

  const [selectedResources, setSelectedResources] = useState([]);

  const handlePdfDownload = useCallback(() => {
    alert('Download PDF functionality here!');
  }, []);

  const handlePrint = useCallback(() => {
    alert('Print functionality here!');
  }, []);

  const rowMarkup = orders.map(({ id, date, customer, total, paymentStatus, fulfillmentStatus }, index) => (
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
        {/* Use Stack for horizontal alignment with padding */}
        <ButtonGroup>
        <Button primary icon={ImportMinor} onClick={handlePdfDownload}></Button>
        <Button icon={PrintMinor} onClick={handlePrint}>Print</Button>
        </ButtonGroup>
        
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    
      <Page  title="Orders" fullWidth>
        <AlphaCard>
          <IndexTable  fullWidth
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
