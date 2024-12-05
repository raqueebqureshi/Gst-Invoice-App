// import React, { useEffect, useState, useCallback } from "react";
// import {
//   IndexTable,
//   LegacyCard,
//   Tabs,
//   TextField,
//   Toast,
//   Frame,
//   Button,
//   SkeletonPage,
//   SkeletonBodyText,
//   Badge,
//   Tag,
//   Pagination,
//   Heading,
// } from "@shopify/polaris";

// export default function ProductIndexTable() {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [storeDomain, setStoreDomain] = useState("");
//   const [storeEmail, setStoreEmail] = useState(""); // Store's email
//   const [productCount, setProductCount] = useState(0);
//   const [draftProductCount, setDraftProductCount] = useState(0); // Count for draft products
//   const [activeProductCount, setActiveProductCount] = useState(0); // Count for active products
//   const [activeTab, setActiveTab] = useState(0);
//   const [showToast, setShowToast] = useState(false);
//   const [searchTerm, setSearchTerm] = useState(""); // Search input state
//   const [tagSearchTerm, setTagSearchTerm] = useState(""); // Tag search input state
//   const [selectedTag, setSelectedTag] = useState(null); // Selected tag for filtering
//   const [isLoading, setIsLoading] = useState(false); // Loading state
//   const [selectedItems, setSelectedItems] = useState([]); // Manage checkbox selection
//   const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
//   const itemsPerPage = 25;

//   // Fetch products and calculate product counts
//   const fetchProducts = useCallback(async () => {
//     setIsLoading(true); // Start loading
//     try {
//       const response = await fetch("/api/products/all", {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       const data = await response.json();

//       if (data.data.length > 0) {
//         const fetchedProducts = data.data;
//         setProducts(fetchedProducts);
//         setFilteredProducts(fetchedProducts); // Initialize filteredProducts
//         setProductCount(fetchedProducts.length); // Set total product count

//         // Calculate counts for active and draft products
//         const activeCount = fetchedProducts.filter(
//           (product) => product.status.toLowerCase() === "active"
//         ).length;
//         const draftCount = fetchedProducts.filter(
//           (product) => product.status.toLowerCase() === "draft"
//         ).length;

//         setActiveProductCount(activeCount);
//         setDraftProductCount(draftCount);

//         setShowToast(true); // Show Toast for successful fetch
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   }, []);

//   // Sync Products: Fetch and update product data
//   const syncProducts = async () => {
//     setIsLoading(true); // Start loading
//     await fetchProducts(); // Ensure products are fetched before syncing

//     try {
//       const response = await fetch("/api/add-store-products", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           storeDomain,
//           email: storeEmail,
//           products: products.map(({ id, title }) => ({
//             productId: id,
//             productName: title,
//             hsn: "", // Initially empty
//             gst: "", // Initially empty
//           })),
//         }),
//       });

//       if (response.ok) {
//         console.log("Products saved successfully to the database.");
//         setShowToast(true); // Show Toast for successful sync
//       } else {
//         console.error("Failed to save products to the database.");
//       }
//     } catch (error) {
//       console.error("Error syncing products:", error);
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };

//   // Fetch store info on component mount
//   useEffect(() => {
//     const fetchShopInfo = async () => {
//       try {
//         const response = await fetch("/api/2024-10/shop.json", {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//         });

//         const data = await response.json();

//         if (data?.data?.data?.length > 0) {
//           const shopInfo = data.data.data[0];
//           setStoreDomain(shopInfo.domain);
//           setStoreEmail(shopInfo.email); // Set store email
//         }
//       } catch (error) {
//         console.error("Error fetching shop info:", error);
//       }
//     };

//     fetchShopInfo();
//     fetchProducts();
//   }, [fetchProducts]);

//   // Search functionality
//   const handleSearch = () => {
//     if (!searchTerm) {
//       setFilteredProducts(products);
//       return;
//     }

//     const searchedProducts = products.filter((product) =>
//       product.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredProducts(searchedProducts);
//   };

//   // Tag search functionality
//   const handleTagSearch = () => {
//     if (!tagSearchTerm) {
//       setFilteredProducts(products);
//       setSelectedTag(null);
//       return;
//     }

//     const taggedProducts = products.filter(
//       (product) =>
//         product.tags && product.tags.includes(tagSearchTerm.toLowerCase())
//     );
//     setFilteredProducts(taggedProducts);
//     setSelectedTag(tagSearchTerm);
//   };

//   // Remove selected tag
//   const handleRemoveTag = () => {
//     setSelectedTag(null);
//     setTagSearchTerm("");
//     setFilteredProducts(products);
//   };

//   // Tab Filtering
//   const filteredByTab = filteredProducts.filter((product) => {
//     const status = product.status.toLowerCase();
//     if (activeTab === 0) return true;
//     if (activeTab === 1) return status === "active";
//     if (activeTab === 2) return status === "draft";
//     if (activeTab === 3) return status === "archived";
//     return false;
//   });

//   // Pagination logic
//   const paginatedProducts = filteredByTab.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const rowMarkup = paginatedProducts.map(
//     ({ id, title, images, status, HSN = "", GST = "" }, index) => (
//       <IndexTable.Row
//         id={id}
//         key={id}
//         position={index}
//         selected={selectedItems.includes(id)}
//         onSelectionChange={(selected) => {
//           setSelectedItems((prev) =>
//             selected
//               ? [...prev, id]
//               : prev.filter((selectedId) => selectedId !== id)
//           );
//         }}
//       >
//         <IndexTable.Cell>
//           <img
//             src={images[0]?.src}
//             alt={images[0]?.alt}
//             style={{
//               border: "0.1px solid black",
//               borderRadius: "5px",
//               width: "50px",
//               height: "50px",
//             }}
//           />
//         </IndexTable.Cell>
//         <IndexTable.Cell>
//           <span style={{ fontWeight: "bold" }}>{title}</span>
//         </IndexTable.Cell>
//         <IndexTable.Cell>{status}</IndexTable.Cell>
//         <IndexTable.Cell>
//           <TextField
//             placeholder="Enter HSN"
//             value={HSN}
//             onChange={(value) => console.log(`HSN for ${id} changed to ${value}`)}
//             autoComplete="off"
//           />
//         </IndexTable.Cell>
//         <IndexTable.Cell>
//           <TextField
//             placeholder="Enter Tax"
//             value={GST}
//             onChange={(value) => console.log(`GST for ${id} changed to ${value}`)}
//             autoComplete="off"
//           />
//         </IndexTable.Cell>
//       </IndexTable.Row>
//     )
//   );

//   return (
//     <Frame>
      
//       <div style={{ maxWidth: '80%', margin: '0 auto' }}>
//       <div style={{ padding: "16px" }}>
//       <Heading>Products</Heading>
//         <div style={{ display: "flex",  marginTop: "16px" , gap:"20px"}}>
        
//         <p>Manage HSN & GST rates</p>
//         <div style={{ flex: 1, display: "flex", gap: "8px" , justifyContent: "end"}}>
//           <Button>More actions</Button>
//           <Button primary>Bulk edit as CSV</Button>
//           </div>
//         </div>
//       </div>

//       <LegacyCard sectioned style={{ margin: "16px", maxWidth: "1600px" }}>
//         {/* Search, Sync Bar, Product Count Badges, and Tag Search */}
//         <div style={{ display: "flex", alignItems: "center", padding: "16px", gap: "16px" }}>
//           <div style={{ flex: 1, display: "flex", gap: "8px" }}>
//             <TextField
//               placeholder="Search products"
//               value={searchTerm}
//               onChange={(value) => setSearchTerm(value)}
//               autoComplete="off"
//             />
//             <Button onClick={handleSearch}>Search</Button>
//           </div>
//           <div style={{ flex: 1, display: "flex", gap: "8px" }}>
//             <TextField
//               placeholder="Search by tag"
//               value={tagSearchTerm}
//               onChange={(value) => setTagSearchTerm(value)}
//               autoComplete="off"
//             />
//             <Button onClick={handleTagSearch}>Find</Button>
//           </div>
//           {selectedTag && <Tag onRemove={handleRemoveTag}>{selectedTag}</Tag>}
//           <div style={{ display: "flex", gap: "8px" }}>
//             <Badge status="info">Total: {filteredByTab.length}</Badge>
//             <Badge status="success">Active: {filteredByTab.filter((product) => product.status.toLowerCase() === "active").length}</Badge>
//             <Badge status="warning">Draft: {filteredByTab.filter((product) => product.status.toLowerCase() === "draft").length}</Badge>
//           </div>
//           <Button primary onClick={syncProducts}>
//             Sync Products
//           </Button>
//         </div>

//         {/* Tabs and Products Table */}
//         {isLoading ? (
//           <SkeletonPage>
//             <SkeletonBodyText lines={4} />
//           </SkeletonPage>
//         ) : (
//           <Tabs
//             tabs={[
//               { id: "all", content: "All", panelID: "all-products" },
//               { id: "active", content: "Active", panelID: "active-products" },
//               { id: "draft", content: "Draft", panelID: "draft-products" },
//               { id: "archived", content: "Archived", panelID: "archived-products" },
//             ]}
//             selected={activeTab}
//             onSelect={(index) => {
//               setActiveTab(index);
//               setCurrentPage(1); // Reset to the first page when changing tabs
//             }}
//           >
//             <IndexTable
//               resourceName={{ singular: "product", plural: "products" }}
//               itemCount={filteredByTab.length}
//               headings={[
//                 { title: "Product Image" },
//                 { title: "Product Title" },
//                 { title: "Status" },
//                 { title: "HSN" },
//                 { title: "TAX" },
//               ]}
//               onSelectionChange={(selectedItems) => setSelectedItems(selectedItems)}
//               selectedItems={selectedItems}
//             >
//               {rowMarkup}
//             </IndexTable>
//             <div style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}>
//               <Pagination
//                 hasPrevious={currentPage > 1}
//                 onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 hasNext={currentPage * itemsPerPage < filteredByTab.length}
//                 onNext={() => setCurrentPage((prev) => prev + 1)}
//               />
//             </div>
//           </Tabs>
//         )}
//       </LegacyCard>
//       </div>

//       {/* Toast Notifications */}
//       {showToast && (
//         <Toast
//           content="Product Sync completed!"
//           onDismiss={() => setShowToast(false)}
//         />
//       )}
//     </Frame>
//   );
// }
// --working code above -------------



import React, { useEffect, useState, useCallback } from "react";
import {
  IndexTable,
  LegacyCard,
  Tabs,
  TextField,
  Toast,
  Frame,
  Button,
  SkeletonPage,
  SkeletonBodyText,
  Badge,
  Tag,
  Pagination,
  Heading,
} from "@shopify/polaris";

export default function ProductIndexTable() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [storeDomain, setStoreDomain] = useState("");
  const [storeEmail, setStoreEmail] = useState(""); // Store's email
  const [productCount, setProductCount] = useState(0);
  const [draftProductCount, setDraftProductCount] = useState(0); // Count for draft products
  const [activeProductCount, setActiveProductCount] = useState(0); // Count for active products
  const [activeTab, setActiveTab] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [tagSearchTerm, setTagSearchTerm] = useState(""); // Tag search input state
  const [selectedTag, setSelectedTag] = useState(null); // Selected tag for filtering
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [selectedItems, setSelectedItems] = useState([]); // Manage checkbox selection
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const itemsPerPage = 25;

  // Fetch products and calculate product counts
  const fetchProducts = useCallback(async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch("/api/products/all", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.data.length > 0) {
       
        const fetchedProducts = data.data;
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts); // Initialize filteredProducts
        setProductCount(fetchedProducts.length); // Set total product count

        // Calculate counts for active and draft products
        const activeCount = fetchedProducts.filter(
          (product) => product.status.toLowerCase() === "active"
        ).length;
        const draftCount = fetchedProducts.filter(
          (product) => product.status.toLowerCase() === "draft"
        ).length;

        setActiveProductCount(activeCount);
        setDraftProductCount(draftCount);

        setShowToast(true); // Show Toast for successful fetch
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  }, []);

  // Sync Products: Fetch and update product data
  const syncProducts = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch("/api/add-store-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeDomain,
          email: storeEmail,
          products: filteredProducts.map(({ id, title, HSN, GST }) => ({
            productId: id,
            productName: title,
            hsn: HSN,
            gst: GST,
          })),
        }),
      });

      if (response.ok) {
        console.log("Products saved successfully to the database.");
        setShowToast(true);
      } else {
        console.error("Failed to save products to the database.");
      }
    } catch (error) {
      console.error("Error syncing products:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const response = await fetch("/api/2024-10/shop.json", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data?.data?.data?.length > 0) {
          const shopInfo = data.data.data[0];
          setStoreDomain(shopInfo.domain);
          setStoreEmail(shopInfo.email);
        }
      } catch (error) {
        console.error("Error fetching shop info:", error);
      }
    };

    fetchShopInfo();
    fetchProducts();
    syncProducts();
  }, [fetchProducts]);

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }

    const searchedProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(searchedProducts);
  };

  const handleTagSearch = () => {
    if (!tagSearchTerm) {
      setFilteredProducts(products);
      setSelectedTag(null);
      return;
    }

    const taggedProducts = products.filter(
      (product) =>
        product.tags && product.tags.includes(tagSearchTerm.toLowerCase())
    );
    setFilteredProducts(taggedProducts);
    setSelectedTag(tagSearchTerm);
  };

  const handleRemoveTag = () => {
    setSelectedTag(null);
    setTagSearchTerm("");
    setFilteredProducts(products);
  };

  const filteredByTab = filteredProducts.filter((product) => {
    const status = product.status.toLowerCase();
    if (activeTab === 0) return true;
    if (activeTab === 1) return status === "active";
    if (activeTab === 2) return status === "draft";
    if (activeTab === 3) return status === "archived";
    return false;
  });

  const paginatedProducts = filteredByTab.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const rowMarkup = paginatedProducts.map(
    ({ id, title, images, status, HSN = "", GST = "" }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        position={index}
        selected={selectedItems.includes(id)}
        onSelectionChange={(selected) => {
          setSelectedItems((prev) =>
            selected
              ? [...prev, id]
              : prev.filter((selectedId) => selectedId !== id)
          );
        }}
      >
        <IndexTable.Cell>
          <img
            src={images[0]?.src}
            alt={images[0]?.alt}
            style={{
              border: "0.1px solid black",
              borderRadius: "5px",
              width: "50px",
              height: "50px",
            }}
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <span style={{ fontWeight: "bold" }}>{title}</span>
        </IndexTable.Cell>
        <IndexTable.Cell>{status}</IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            placeholder="Enter HSN"
            value={HSN}
            onChange={(value) =>
              setFilteredProducts((prevProducts) =>
                prevProducts.map((product) =>
                  product.id === id ? { ...product, HSN: value } : product
                )
              )
            }
            autoComplete="off"
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            placeholder="Enter Tax"
            value={GST}
            onChange={(value) =>
              setFilteredProducts((prevProducts) =>
                prevProducts.map((product) =>
                  product.id === id ? { ...product, GST: value } : product
                )
              )
            }
            autoComplete="off"
          />
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Frame>
      <div style={{ maxWidth: '80%', margin: '0 auto' }}>
        <div style={{ padding: "16px" }}>
         <Heading><h2 style={{ fontSize:"30px", fontWeight: "bold", marginBottom: "20px" }} >Products</h2> </Heading>
         <hr/>
          <div style={{ display: "flex", marginTop: "16px", gap: "20px" }}>
            <p>Manage HSN & GST rates</p>
            <div style={{ flex: 1, display: "flex", gap: "8px", justifyContent: "end" }}>
              <Button>More actions</Button>
              <Button primary>Bulk edit as CSV</Button>
            </div>
          </div>
        </div>

        <LegacyCard sectioned style={{ margin: "16px", maxWidth: "1600px" }}>
          <div style={{ display: "flex", alignItems: "center", padding: "16px", gap: "16px" }}>
            <div style={{ flex: 1, display: "flex", gap: "8px" }}>
              <TextField
                placeholder="Search products"
                value={searchTerm}
                onChange={(value) => setSearchTerm(value)}
                autoComplete="off"
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
            <div style={{ flex: 1, display: "flex", gap: "8px" }}>
              <TextField
                placeholder="Search by tag"
                value={tagSearchTerm}
                onChange={(value) => setTagSearchTerm(value)}
                autoComplete="off"
              />
              <Button onClick={handleTagSearch}>Find</Button>
            </div>
            {selectedTag && <Tag onRemove={handleRemoveTag}>{selectedTag}</Tag>}
            <div style={{ display: "flex", gap: "8px" }}>
              <Badge status="info">Total: {filteredByTab.length}</Badge>
              <Badge status="success">
                Active: {filteredByTab.filter((product) => product.status.toLowerCase() === "active").length}
              </Badge>
              <Badge status="warning">
                Draft: {filteredByTab.filter((product) => product.status.toLowerCase() === "draft").length}
              </Badge>
              <Badge status="warning">
              Archived: {filteredByTab.filter((product) => product.status.toLowerCase() === "archived").length}
              </Badge>
            </div>
            <Button primary onClick={syncProducts}>
              Sync Products
            </Button>
          </div>

          {isLoading ? (
            <SkeletonPage>
              <SkeletonBodyText lines={4} />
            </SkeletonPage>
          ) : (
            <Tabs
              tabs={[
                { id: "all", content: "All", panelID: "all-products" },
                { id: "active", content: "Active", panelID: "active-products" },
                { id: "draft", content: "Draft", panelID: "draft-products" },
                { id: "archived", content: "Archived", panelID: "archived-products" },
              ]}
              selected={activeTab}
              onSelect={(index) => {
                setActiveTab(index);
                setCurrentPage(1);
              }}
            >
              <IndexTable
                resourceName={{ singular: "product", plural: "products" }}
                itemCount={filteredByTab.length}
                headings={[
                  { title: "Product Image" },
                  { title: "Product Title" },
                  { title: "Status" },
                  { title: "HSN" },
                  { title: "TAX" },
                ]}
                selectedItems={selectedItems}
                onSelectionChange={(selected) => setSelectedItems(selected)}
                bulkActions={[{
                  content: 'Delete selected',
                  onAction: () => {
                    const updatedProducts = filteredProducts.filter(
                      (product) => !selectedItems.includes(product.id)
                    );
                    setProducts(updatedProducts);
                    setFilteredProducts(updatedProducts);
                    setSelectedItems([]);
                    syncProducts(); // Update the database after bulk action
                  },
                }]}
              >
                {rowMarkup}
              </IndexTable>
              <div style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}>
                <Pagination
                  hasPrevious={currentPage > 1}
                  onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  hasNext={currentPage * itemsPerPage < filteredByTab.length}
                  onNext={() => setCurrentPage((prev) => prev + 1)}
                />
              </div>
            </Tabs>
          )}
        </LegacyCard>
      </div>

      {showToast && (
        <Toast
          content="Product Sync completed!"
          onDismiss={() => setShowToast(false)}
        />
      )}
    </Frame>
  );
}
