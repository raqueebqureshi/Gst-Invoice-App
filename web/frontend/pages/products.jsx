// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   IndexTable,
//   LegacyCard,
//   useIndexResourceState,
//   Text,
//   Badge,
//   Tabs,
//   TextField,
// } from '@shopify/polaris';

// export default function ProductIndexTable() {
//   const [HSN, setHSN] = useState('');
//   const [GST, setGST] = useState('18')
//   const [totalProducts, setTotalProducts] = useState("");
//   const [storeDomain, setStoreDomain] = useState("");
//   const handleHSNChange = useCallback(
//     (newHSN) => setHSN(newHSN),

//     [],
//   );

//   const handleGSTChange = useCallback(
//     (newGST) => setGST(newGST),
//   );


//   const [products, setProducts] = useState([]);
//   const [activeTab, setActiveTab] = useState(0);

//   // Example product status mapping (adjust based on your data)
//   const productStatus = {
//     active: 'Active',
//     draft: 'Draft',
//     archived: 'Archived',
//   };

//   const handleTabChange = (index) => setActiveTab(index);


//   // useEffect(() => {
//   //   fetch("/api/shop/all", {
//   //     method: "GET",
//   //     headers: { "Content-Type": "application/json" }
//   //   })
//   //   .then(request => request.json())
//   //   .then(response => {
//   //     if (response.data.length > 0) {
//   //       console.log("Store Details ",response.data[0]);
//   //       setStoreName(response.data[0].name); 
//   //     }
//   //   })
//   //   .catch(error => console.log(error));
//   // }, []);

//   // useEffect(() => {
//   //   const fetchProducts = async () => {
//   //     try {
//   //       const response = await fetch('/api/products/all'); 
//   //       const data = await response.json();
//   //       setProducts(data.data); // Assuming the products are in data.data
//   //     } catch (error) {
//   //       console.error('Error fetching products:', error);
//   //     }
//   //   };

//   //   fetchProducts();
//   // }, []);

  
  
//   // useEffect(() => {
//   //   const ProductsCount = async () => {
//   //     try {
//   //       const response = await fetch('/api/products/count'); 
//   //       const productCount = await response.json();
  
//   //       // Send the product count to the backend to update the MongoDB record
//   //       await fetch('/api/update-product-count', {
//   //         method: 'POST',
//   //         headers: {
//   //           'Content-Type': 'application/json',
//   //         },
//   //         body: JSON.stringify({
//   //           storeDomain: 'your-store-domain-here',  // Replace with the actual store domain
//   //           productCount: productCount.count,
//   //         }),
//   //       });
//   //       setTotalProducts(productCount.count);
//   //       console.log(productCount.count);
//   //     } catch (error) {
//   //       console.error('Error while fetching or updating product count:', error);
//   //     }
//   //   };
  
//   //   ProductsCount();
//   // }, []);
  

//   // Filter products based on the selected tab
//   const filteredProducts = products.filter(product => {
//     const status = product.status.toLowerCase();
//     if (activeTab === 0) return true; // All products
//     if (activeTab === 1) return status === 'active'; // Active products
//     if (activeTab === 2) return status === 'draft'; // Draft products
//     if (activeTab === 3) return status === 'archived'; // Archived products
//     return false;
//   });

//   const resourceName = {
//     singular: 'product',
//     plural: 'products',
//   };

//   const { selectedResources, allResourcesSelected, handleSelectionChange } =
//     useIndexResourceState(filteredProducts);

//   const rowMarkup = filteredProducts.map(
//     ({ id, title, images, status }, index) => (
//       <IndexTable.Row
//         id={id}
//         key={id}
//         selected={selectedResources.includes(id)}
//         position={index}
//       >
//         <IndexTable.Cell>
//           <img src={images[0]?.src} alt={images[0]?.alt} style={{border:"0.2px solid black", borderRadius:"5", width: '50px', height: '50px' }} />
//         </IndexTable.Cell>
//         <IndexTable.Cell>
//           <Text variant="bodyMd" fontWeight="bold" as="span">
//             {title}
//           </Text>
//         </IndexTable.Cell>
//         <IndexTable.Cell>{productStatus[status]}</IndexTable.Cell>
//         <IndexTable.Cell>
//           <TextField
//             placeholder='896574'
//             value={HSN}
//             onChange={handleHSNChange}
//             autoComplete="off"
//           />
//         </IndexTable.Cell>
//         <IndexTable.Cell>
//           <TextField
//             placeholder='18%'
//             value={GST}
//             onChange={handleGSTChange}
//             autoComplete="off"
//           />
//         </IndexTable.Cell>
//       </IndexTable.Row>
//     ),
//   );

//   return (
//     <>
//     <LegacyCard>
//       <p> Domain name : {storeDomain}</p>
//       <p > Total products : {totalProducts}</p>
//       <Tabs
//         tabs={[
//           { id: 'all', content: 'All', accessibilityLabel: 'All products', panelID: 'all-products' },
//           { id: 'active', content: 'Active', panelID: 'active-products' },
//           { id: 'draft', content: 'Draft', panelID: 'draft-products' },
//           { id: 'archived', content: 'Archived', panelID: 'archived-products' },

//         ]}
//         selected={activeTab}
//         onSelect={handleTabChange}
//       >
//         <div>
//           <IndexTable
//             resourceName={resourceName}
//             itemCount={filteredProducts.length}
//             selectedItemsCount={
//               allResourcesSelected ? 'All' : selectedResources.length
//             }
//             onSelectionChange={handleSelectionChange}
//             headings={[
//               { title: 'Product Image' },
//               { title: 'Product Title' },
//               { title: 'Status' },
//               { title: 'HSN' },
//               { title: 'TAX' }
//               // Add more headings as needed
//             ]}
//           >
//             {rowMarkup}
//           </IndexTable>
//         </div>
//       </Tabs>
//     </LegacyCard>
//     </>
//   );
// }
