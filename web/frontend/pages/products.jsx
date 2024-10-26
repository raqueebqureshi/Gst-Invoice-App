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
    const fetchStoreDetails = async () => {
      console.log("Fetching store details..."); // Log store details fetch
      try {
        // Fetch the store details
        const response = await fetch("/api/shop/all", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        console.log("Response from /api/shop/all:", response); // Log response
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log("Store details fetched:", responseData); // Log fetched store details
  
        if (responseData.data && responseData.data.length > 0) {
          setStoreDomain(responseData.data[0].domain);
          console.log("Store domain set to:", responseData.data[0].domain); // Log store domain
  
          // Fetch products after setting the store domain
          const productResponse = await fetch("/api/products/all", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          console.log("Response from /api/products/all:", productResponse); // Log response
          if (!productResponse.ok) {
            throw new Error(`HTTP error! status: ${productResponse.status}`);
          }
          const productData = await productResponse.json();
          console.log("Fetched products:", productData); // Log fetched products
  
          if (productData.data && productData.data.length) {
            setProducts(productData.data);
  
            // Prepare payload for saving products in DB
            const productPayload = {
              storeDomain: responseData.data[0].domain, // Changed key for clarity
              products: productData.data.map((product) => ({
                productId: product.id,
                productName: product.title,
                HSN: "", // Initial value; adjust based on your logic
                GST: "", // Initial value; adjust based on your logic
              })),
            };
  
            // Log payload before sending to the server
            console.log("Payload to save products:", productPayload);
  
            // Save products to the database
            const initResponse = await fetch("/api/insertProduct-data", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(productPayload),
            });
            console.log("Response from /api/insertProduct-data:", initResponse); // Log response
  
            if (!initResponse.ok) {
              throw new Error(`Failed to save products. Status: ${initResponse.status}`);
            }
  
            console.log("Products saved in DB successfully."); // Log successful DB save
          } else {
            console.warn("No products found."); // Warn if no products
          }
        } else {
          console.warn("No store domains found."); // Warn if no store domain
        }
      } catch (error) {
        console.error("Error fetching store details:", error);
      }
    };
  
    fetchStoreDetails();
  }, []);
  
  

  // Fetch product count and update in DB
  useEffect(() => {
    const updateProductCount = async () => {
      if (!storeDomain) return;

      console.log('Updating product count...'); // Log start of product count update
      try {
        const response = await fetch('/api/products/count');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productCount = await response.json();
        console.log('Product count fetched:', productCount.count); // Log product count

        const updateResponse = await fetch('/api/update-product-count', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storeDomain, productCount: productCount.count }),
        });

        if (!updateResponse.ok) {
          throw new Error(`Failed to update product count. Status: ${updateResponse.status}`);
        }

        setTotalProducts(productCount.count);
        console.log('Product count updated successfully.'); // Log successful update
      } catch (error) {
        console.error('Error while fetching or updating product count:', error);
      }
    };

    updateProductCount();
  }, [storeDomain]);

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
        <p> Domain name: {storeDomain}</p>
        <p> Total products: {totalProducts}</p>
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


