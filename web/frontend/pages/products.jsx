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

//   const fetchProducts = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch("/api/products/all", {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });
//       const data = await response.json();
//       if (data.data.length > 0) {
//         const fetchedProducts = data.data;
//         setProducts(fetchedProducts);
//         setFilteredProducts(fetchedProducts);
//         setProductCount(fetchedProducts.length);

//         const activeCount = fetchedProducts.filter(
//           (product) => product.status.toLowerCase() === "active"
//         ).length;
//         const draftCount = fetchedProducts.filter(
//           (product) => product.status.toLowerCase() === "draft"
//         ).length;

//         setActiveProductCount(activeCount);
//         setDraftProductCount(draftCount);
//         setShowToast(true);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const syncProducts = async () => {
//     setIsLoading(true);
//     await fetchProducts();
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
//             hsn: "",
//             gst: "",
//           })),
//         }),
//       });
//       if (response.ok) {
//         console.log("Products saved successfully to the database.");
//         setShowToast(true);
//       } else {
//         console.error("Failed to save products to the database.");
//       }
//     } catch (error) {
//       console.error("Error syncing products:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

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
//           setStoreEmail(shopInfo.email);
//         }
//       } catch (error) {
//         console.error("Error fetching shop info:", error);
//       }
//     };
//     fetchShopInfo();
//     fetchProducts();
//   }, [fetchProducts]);

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

//   const handleRemoveTag = () => {
//     setSelectedTag(null);
//     setTagSearchTerm("");
//     setFilteredProducts(products);
//   };

//   const handleSelectAll = () => {
//     const currentPageIds = paginatedProducts.map(({ id }) => id);
//     if (isAllSelected) {
//       console.log("Deselecting all items on the current page.");
//       setSelectedItems((prevSelectedItems) => {
//         const updatedSelection = prevSelectedItems.filter(
//           (id) => !currentPageIds.includes(id)
//         );
//         console.log("Updated selectedItems after deselect all:", updatedSelection);
//         return updatedSelection;
//       });
//     } else {
//       console.log("Selecting all items on the current page.");
//       setSelectedItems((prevSelectedItems) => {
//         const updatedSelection = [
//           ...prevSelectedItems,
//           ...currentPageIds.filter((id) => !prevSelectedItems.includes(id)),
//         ];
//         console.log("Updated selectedItems after select all:", updatedSelection);
//         return updatedSelection;
//       });
//     }
//   };
  
//   const handleRowSelection = (id) => {
//     console.log(`Row clicked with ID: ${id}`);
//     setSelectedItems((prevSelectedItems) => {
//       const updatedSelection = prevSelectedItems.includes(id)
//         ? prevSelectedItems.filter((itemId) => itemId !== id) // Deselect
//         : [...prevSelectedItems, id]; // Select
//       console.log("Updated selectedItems:", updatedSelection);
//       return updatedSelection;
//     });
//   };
//   const filteredByTab = filteredProducts.filter((product) => {
//     const status = product.status.toLowerCase();
//     if (activeTab === 0) return true;
//     if (activeTab === 1) return status === "active";
//     if (activeTab === 2) return status === "draft";
//     if (activeTab === 3) return status === "archived";
//     return false;
//   });

//   const paginatedProducts = filteredByTab.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

// // Determine if "Select All" checkbox should be checked
// const isAllSelected =
//   paginatedProducts.length > 0 &&
//   paginatedProducts.every(({ id }) => selectedItems.includes(id));

//   const rowMarkup = paginatedProducts.map(
//     ({ id, title, images, status, HSN = "", GST = "" }, index) => (
//       <IndexTable.Row
//         id={id}
//         key={id}
//         position={index}
//         selected={selectedItems.includes(id)}
//         onClick={() => {
//           console.log(`Row ${id} clicked.`);
//           handleRowSelection(id);
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
//             onChange={(value) =>
//               console.log(`HSN for ${id} changed to ${value}`)
//             }
//             autoComplete="off"
//           />
//         </IndexTable.Cell>
//         <IndexTable.Cell>
//           <TextField
//             placeholder="Enter Tax"
//             value={GST}
//             onChange={(value) =>
//               console.log(`GST for ${id} changed to ${value}`)
//             }
//             autoComplete="off"
//           />
//         </IndexTable.Cell>
//       </IndexTable.Row>
//     )
//   );

//   return (
//     <Frame>
//       <div style={{ maxWidth: "80%", margin: "0 auto" }}>
//         <div style={{ padding: "16px" }}>
//           <Heading>Products</Heading>
//           <div style={{ display: "flex", marginTop: "16px", gap: "20px" }}>
//             <p>Manage HSN & GST rates</p>
//             <div
//               style={{
//                 flex: 1,
//                 display: "flex",
//                 gap: "8px",
//                 justifyContent: "end",
//               }}
//             >
//               <Button>More actions</Button>
//               <Button primary>Bulk edit as CSV</Button>
//             </div>
//           </div>
//         </div>
//         <LegacyCard sectioned style={{ margin: "16px", maxWidth: "1600px" }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               padding: "16px",
//               gap: "16px",
//             }}
//           >
//             <div style={{ flex: 1, display: "flex", gap: "8px" }}>
//               <TextField
//                 placeholder="Search products"
//                 value={searchTerm}
//                 onChange={(value) => setSearchTerm(value)}
//                 autoComplete="off"
//               />
//               <Button onClick={handleSearch}>Search</Button>
//             </div>
//             <div style={{ flex: 1, display: "flex", gap: "8px" }}>
//               <TextField
//                 placeholder="Search by tag"
//                 value={tagSearchTerm}
//                 onChange={(value) => setTagSearchTerm(value)}
//                 autoComplete="off"
//               />
//               <Button onClick={handleTagSearch}>Find</Button>
//             </div>
//             {selectedTag && <Tag onRemove={handleRemoveTag}>{selectedTag}</Tag>}
//             <div style={{ display: "flex", gap: "8px" }}>
//               <Badge status="info">Total: {filteredByTab.length}</Badge>
//               <Badge status="success">
//                 Active:{" "}
//                 {filteredByTab.filter(
//                   (product) => product.status.toLowerCase() === "active"
//                 ).length}
//               </Badge>
//               <Badge status="warning">
//                 Draft:{" "}
//                 {filteredByTab.filter(
//                   (product) => product.status.toLowerCase() === "draft"
//                 ).length}
//               </Badge>
//             </div>
//             <Button primary onClick={syncProducts}>
//               Sync Products
//             </Button>
//           </div>
//           {isLoading ? (
//             <SkeletonPage>
//               <SkeletonBodyText lines={4} />
//             </SkeletonPage>
//           ) : (
//             <Tabs
//               tabs={[
//                 { id: "all", content: "All", panelID: "all-products" },
//                 { id: "active", content: "Active", panelID: "active-products" },
//                 { id: "draft", content: "Draft", panelID: "draft-products" },
//                 {
//                   id: "archived",
//                   content: "Archived",
//                   panelID: "archived-products",
//                 },
//               ]}
//               selected={activeTab}
//               onSelect={(index) => {
//                 setActiveTab(index);
//                 setCurrentPage(1);
//               }}
//             >
//  <IndexTable
//     resourceName={{ singular: "product", plural: "products" }}
//     itemCount={filteredByTab.length}
//     headings={[
//       { title: "Product Image" },
//       { title: "Product Title" }, 
//       { title: "Status" },
//       { title: "HSN" },
//       { title: "TAX" },
//     ]}
//     selectedItems={selectedItems}
//     onSelectionChange={() => {
//       console.log("Select All button clicked.");
//       handleSelectAll();
//     }}
//     bulkActions={[
//       {
//         content: isAllSelected ? "Deselect All" : "Select All",
//         onAction: () => {
//           console.log("Bulk action triggered for Select All.");
//           handleSelectAll();
//         },
//       },
//     ]}
//   >
//     {rowMarkup}
//   </IndexTable>

//               <div
//                 style={{
//                   marginTop: "16px",
//                   display: "flex",
//                   justifyContent: "center",
//                 }}
//               >
//                 <Pagination
//                   hasPrevious={currentPage > 1}
//                   onPrevious={() =>
//                     setCurrentPage((prev) => Math.max(prev - 1, 1))
//                   }
//                   hasNext={
//                     currentPage * itemsPerPage < filteredByTab.length
//                   }
//                   onNext={() => setCurrentPage((prev) => prev + 1)}
//                 />
//               </div>
//             </Tabs>
//           )}
//         </LegacyCard>
//       </div>
//       {showToast && (
//         <Toast
//           content="Product Sync completed!"
//           onDismiss={() => setShowToast(false)}
//         />
//       )}
//     </Frame>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  IndexTable,
  LegacyCard,
  TextField,
  Filters,
  Frame,
  Button,
  Modal,
  Heading,
  Tag,
  Stack,
  Select,
  Text
} from "@shopify/polaris";

export default function ProductIndexTable() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]); // For selected tags
  const [tagInput, setTagInput] = useState(""); // Tag input value
  const [selectedCollection, setSelectedCollection] = useState(""); // Collection filter
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/products/all");
        const data = await response.json();
        setProducts(data.data || []);
        setFilteredProducts(data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Add tag and apply filters
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      const updatedTags = [...tags, tagInput];
      setTags(updatedTags);
      applyFilters(searchTerm, updatedTags, selectedCollection);
      setTagInput("");
    }
  };

  // Remove tag and apply filters
  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    applyFilters(searchTerm, updatedTags, selectedCollection);
  };

  const applyFilters = (search, selectedTags, collection) => {
    console.log("Applying Filters:", { search, selectedTags, collection });
    let filtered = [...products];
  
    if (search) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    if (selectedTags.length > 0) {
      filtered = filtered.filter((product) => {
        // Safely extract product tags
        const productTagsRaw = product.tags || [];
        const productTags = Array.isArray(productTagsRaw)
          ? productTagsRaw
          : productTagsRaw.split(",").map((t) => t.trim());
  
        const productTagsLower = productTags.map((t) => t.toLowerCase());
        const match = selectedTags.every((tag) =>
          productTagsLower.includes(tag.toLowerCase())
        );
        console.log("Filtering by Tags:", { productTags, selectedTags, match });
        return match;
      });
    }
  
    if (collection) {
      filtered = filtered.filter(
        (product) => product.collection === collection
      );
    }
  
    setFilteredProducts(filtered);
  };
  
  

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    applyFilters(value, tags, selectedCollection);
  };

  const handleCollectionChange = (value) => {
    setSelectedCollection(value);
    applyFilters(searchTerm, tags, value);
  };

  // Single row selection
  const handleRowSelection = (id) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id]
    );
  };

  // "Select All" logic
  const handleSelectAll = () => {
    if (selectedItems.length === filteredProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredProducts.map(({ id }) => id));
    }
  };

  // Show modal for bulk edit
  useEffect(() => {
    if (selectedItems.length > 1) {
      setShowEditModal(true);
    } else {
      setShowEditModal(false);
    }
  }, [selectedItems]);

  // Modal content
  const modalContent = (
    <div style={{padding:"20px"}}>
    

      <Text >Editing {selectedItems.length} Products</Text>
      <div style={{display:"flex", gap:"40px", marginTop:"5px"}}>
      <TextField
                placeholder="Enter HSN for selection"
                />
      <TextField
                placeholder="Enter HSN for selection"
                />
                <Button varient="primary">Apply All</Button>
    
      </div>

      <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" , padding:"20px"}}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th style={{ padding: "10px", textAlign: "left" }}>Image</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Title</th>
            <th style={{ padding: "10px", textAlign: "left" }}>HSN</th>
            <th style={{ padding: "10px", textAlign: "left" }}>GST</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.map((id) => {
            const product = products.find((product) => product.id === id);
            return (
              <tr key={id} style={{ borderBottom: "1px solid #ccc" }}>  
                <td style={{ padding: "10px" }}>  <img
                  src={product.images[0]?.src || "Unknown Product"}
                  alt={product.title}
                  style={{
                    border: "0.1px solid black",
                    borderRadius: "5px",
                    width: "50px",
                    height: "50px",
                  }}
                /></td>
                <td style={{ padding: "10px" }}>{product?.title || "Unknown Product"}</td>
                <td style={{ padding: "10px" }}>
                <TextField
                placeholder="Enter HSN"
                  value={product?.HSN || ""}
                />
                  </td>
                <td style={{ padding: "10px" }}>
                <TextField
                placeholder="Enter GST"
                  value={product?.HSN || ""}
                />
                  </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <Frame>
      <div style={{ maxWidth: "80%", margin: "0 auto" }}>
        {/* Heading */}
        <div style={{ padding: "16px" }}>
          <Heading>Products</Heading>
          <p>Manage HSN & GST rates</p>
        </div>

        {/* Filters */}
        <LegacyCard>
          <Filters
            queryValue={searchTerm}
            onQueryChange={handleSearchChange}
            onQueryClear={() => handleSearchChange("")}
            filters={[
              {
                key: "taggedWith",
                label: "Tagged with",
                filter: (
                  <div>
                    <Stack spacing="tight">
                      <TextField
                        value={tagInput}
                        onChange={(value) => setTagInput(value)}
                        autoComplete="off"
                        placeholder="Add a tag"
                      />
                      <Button onClick={handleAddTag}>Add</Button>
                    </Stack>
                    <Stack spacing="tight" wrap>
                      {tags.map((tag) => (
                        <Tag key={tag} onRemove={() => handleRemoveTag(tag)}>
                          {tag}
                        </Tag>
                      ))}
                    </Stack>
                  </div>
                ),
              },
              {
                key: "collection",
                label: "Filter by Collection",
                filter: (
                  <Select
                    options={[
                      { label: "All Collections", value: "" },
                      { label: "Collection A", value: "collection_a" },
                      { label: "Collection B", value: "collection_b" },
                    ]}
                    onChange={handleCollectionChange}
                    value={selectedCollection}
                  />
                ),
              },
            ]}
          />
        </LegacyCard>

        {/* Product Table */}
        <IndexTable
          resourceName={{ singular: "product", plural: "products" }}
          itemCount={filteredProducts.length}
          headings={[
            { title: "Product Image" },
            { title: "Product Title" },
            { title: "HSN" },
            { title: "GST" },
          ]}
          selectedItems={selectedItems}
          onSelectionChange={handleSelectAll}
          bulkActions={[
            {
              content:
                selectedItems.length === filteredProducts.length
                  ? "Deselect All"
                  : "Select All",
              onAction: handleSelectAll,
            },
          ]}
        >
          {filteredProducts.map(({ id, title, images, HSN, GST }, index) => (
            <IndexTable.Row
              id={id}
              key={id}
              position={index}
              selected={selectedItems.includes(id)}
              onClick={() => handleRowSelection(id)}
            >
              <IndexTable.Cell>
                <img
                  src={images[0]?.src || ""}
                  alt={title}
                  style={{
                    border: "0.1px solid black",
                    borderRadius: "5px",
                    width: "50px",
                    height: "50px",
                  }}
                />
              </IndexTable.Cell>
              <IndexTable.Cell>{title}</IndexTable.Cell>
              <IndexTable.Cell>
                <TextField
                  value={HSN || ""}
                  onChange={(value) =>
                    console.log(`HSN for ${id} changed to ${value}`)
                  }
                />
              </IndexTable.Cell>
              <IndexTable.Cell>
                <TextField
                  value={GST || ""}
                  onChange={(value) =>
                    console.log(`GST for ${id} changed to ${value}`)
                  }
                />
              </IndexTable.Cell>
            </IndexTable.Row>
          ))}
        </IndexTable>
      </div>

      {/* Modal for editing selected products */}
      {showEditModal && (
        <Modal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Selected Products"
        >
          {modalContent}
        </Modal>
      )}
    </Frame>
  );
}
