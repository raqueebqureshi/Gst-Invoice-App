import React, { useEffect, useState } from 'react';
import {
  IndexTable,
  LegacyCard,
  Text,
  Tabs,
  TextField,
  Spinner,
} from '@shopify/polaris';

export default function ProductIndexTable() {
  const [products, setProducts] = useState([]);
  const [storeDomain, setStoreDomain] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch and initialize products in DB

  // Fetch store details
  useEffect(() => {
    fetch("/api/products/all", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    .then(request => request.json())
    .then(response => {
      // console.log("Products",response);
      if (response.data.length > 0) {
        // console.log("Products",response.data);
        setProducts(response.data);
      }
      console.log(products)
    
    })
    .catch(error => console.log(error));
  }, []);

  // Handle HSN and GST updates for specific products
  const handleHSNChange = (productId, newHSN) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, HSN: newHSN } : product
      )
    );
    updateProductInDB(productId, { HSN: newHSN });
  };

  const handleGSTChange = (productId, newGST) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, GST: newGST } : product
      )
    );
    updateProductInDB(productId, { GST: newGST });
  };

  // Helper function to update product in DB
  const updateProductInDB = async (productId, updates) => {
    console.log(`Updating product ${productId} in DB with updates:`, updates); // Log updates
    try {
      await fetch('/api/update-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeDomain, productId, ...updates }),
      });
      console.log(`Product ${productId} updated successfully.`); // Log successful update
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const productStatus = { active: 'Active', draft: 'Draft', archived: 'Archived' };

  const filteredProducts = products.filter(product => {
    const status = product.status.toLowerCase();
    if (activeTab === 0) return true;
    if (activeTab === 1) return status === 'active';
    if (activeTab === 2) return status === 'draft';
    if (activeTab === 3) return status === 'archived';
    return false;
  });
  
  const rowMarkup = filteredProducts.map(
    
    ({ id, title, images, status, HSN = '', GST = '' }, index) => (

      
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <img src={images[0]?.src} alt={images[0]?.alt} style={{ border: "0.1px solid black", borderRadius: "5px", width: '50px', height: '50px' }} />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">{title}</Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{productStatus[status]}</IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            placeholder='896574'
            value={HSN}
            onChange={(value) => handleHSNChange(id, value)}
            autoComplete="off"
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            placeholder='18%'
            value={GST}
            onChange={(value) => handleGSTChange(id, value)}
            autoComplete="off"
          />
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (

    <LegacyCard>

      <>

        <Tabs
          tabs={[
            { id: 'all', content: 'All', panelID: 'all-products' },
            { id: 'active', content: 'Active', panelID: 'active-products' },
            { id: 'draft', content: 'Draft', panelID: 'draft-products' },
            { id: 'archived', content: 'Archived', panelID: 'archived-products' },
          ]}
          selected={activeTab}
          onSelect={setActiveTab}
        >

          <IndexTable
            resourceName={{ singular: 'product', plural: 'products' }}
            itemCount={filteredProducts.length}
            headings={[
              { title: 'Product Image' },
              { title: 'Product Title' },
              { title: 'Status' },
              { title: 'HSN' },
              { title: 'TAX' }
            ]}
          >
             
              { rowMarkup }
            
          </IndexTable>

        </Tabs>
      </>

    </LegacyCard>
  )
}


