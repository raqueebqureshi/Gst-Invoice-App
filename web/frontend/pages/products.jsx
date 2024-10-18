import React, { useEffect, useState } from 'react';
import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Text,
  Badge,
  Tabs,
} from '@shopify/polaris';

export default function ProductIndexTable() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  
  // Example product status mapping (adjust based on your data)
  const productStatus = {
    active: 'Active',
    draft: 'Draft',
    archived: 'Archived',
  };

  const handleTabChange = (index) => setActiveTab(index);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/all'); // Adjust the API endpoint as needed
        const data = await response.json();
        setProducts(data.data); // Assuming the products are in data.data
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on the selected tab
  const filteredProducts = products.filter(product => {
    const status = product.status.toLowerCase();
    if (activeTab === 0) return true; // All products
    if (activeTab === 1) return status === 'active'; // Active products
    if (activeTab === 2) return status === 'draft'; // Draft products
    if (activeTab === 3) return status === 'archived'; // Archived products
    return false;
  });

  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(filteredProducts);

  const rowMarkup = filteredProducts.map(
    ({ id, title, images, status }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <img src={images[0]?.src} alt={images[0]?.alt} style={{ width: '50px', height: '50px' }} />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {title}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{productStatus[status]}</IndexTable.Cell>
        <IndexTable.Cell>
          {/* Add any other relevant fields here */}
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <LegacyCard>
      <Tabs
        tabs={[
          { id: 'all', content: 'All', accessibilityLabel: 'All products', panelID: 'all-products' },
          { id: 'active', content: 'Active', panelID: 'active-products' },
          { id: 'draft', content: 'Draft', panelID: 'draft-products' },
          { id: 'archived', content: 'Archived', panelID: 'archived-products' },
        ]}
        selected={activeTab}
        onSelect={handleTabChange}
      >
        <div>
          <IndexTable
            resourceName={resourceName}
            itemCount={filteredProducts.length}
            selectedItemsCount={
              allResourcesSelected ? 'All' : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: 'Image' },
              { title: 'Title' },
              { title: 'Status' },
              // Add more headings as needed
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </div>
      </Tabs>
    </LegacyCard>
  );
}
