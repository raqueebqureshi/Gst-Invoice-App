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
  Heading,
  LegacyStack,
  Tag,
  Select,
} from "@shopify/polaris";

export default function ProductIndexTable() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [storeDomain, setStoreDomain] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [isSaving, setIsSaving] = useState(false);




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
              setEmail(shopInfo.email);
            }
          } catch (error) {
            console.error("Error fetching shop info:", error);
          }
        };
        fetchShopInfo();
      }, []);


  // Fetch products from the server on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/all");
        const data = await response.json();
        const productsWithEditableFields = data.data.map((product) => ({
          ...product,
          editableHSN: product.HSN || "",
          editableGST: product.GST || "",
        }));
        setProducts(productsWithEditableFields);
        setFilteredProducts(productsWithEditableFields);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const fetchGSTHSNValues = async () => {
    try {
      if (!storeDomain || !email) {
        console.error("Missing storeDomain or email:", { storeDomain, email });
        throw new Error("Invalid storeDomain or email.");
      }
  
      const url = `/api/products/gst?storeDomain=${encodeURIComponent(storeDomain)}&email=${encodeURIComponent(email)}`;
      console.log("Fetching GST HSN Values with URL:", url);
  
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch GST values. Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Fetched GST Values:", data.gstValues);
  
      // Process fetched values (if required)
    } catch (error) {
      console.error("Error fetching GST values:", error);
    }
  };
  
  
  // Call the function
  fetchGSTHSNValues();
  

  // Handle row selection
  const handleRowSelection = (id) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id]
    );
  };

  // Handle "Select All" functionality
  const handleSelectAll = () => {
    if (selectedItems.length === filteredProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredProducts.map(({ id }) => id));
    }
  };

  // Handle changes in HSN and GST fields
  const handleInputChange = (id, field, value) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );

    setFilteredProducts((prevFilteredProducts) =>
      prevFilteredProducts.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  // Add a new tag
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  // Remove a tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };


  //update gst hsn
  const saveChanges = async () => {
    setIsSaving(true);
    const updates = selectedItems.map((id) => {
      const product = products.find((product) => product.id === id);
      return {
        id: product.id,
        HSN: product.editableHSN,
        GST: product.editableGST,
      };
    });
  
    const payload = {
      storeDomain,
      email,
      products: updates,
    };
  
    console.log("Payload to API:", payload);
  
    try {
      const response = await fetch("/api/products/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("API Error:", errorDetails);
        alert(`Failed to save changes: ${errorDetails.message}`);
        return;
      }
  
      const responseData = await response.json();
      console.log("API Response:", responseData);
      alert("Changes saved successfully!");
      setIsSaving(false);


      // Fetch updated products
      const updatedResponse = await fetch("/api/products/all");
      const updatedData = await updatedResponse.json();
  
      const productsWithEditableFields = updatedData.data.map((product) => ({
        ...product,
        editableHSN: product.HSN || "",
        editableGST: product.GST || "",
      }));
  
      setProducts(productsWithEditableFields);
      setFilteredProducts(productsWithEditableFields);
  
      // Clear selected items
      setSelectedItems([]);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("An error occurred while saving changes.");
    }
  };
  
  

  return (
    <Frame>
      <div style={{ maxWidth: "80%", margin: "0 auto" }}>
        <div style={{ padding: "16px" }}>
          <Heading>Products</Heading>
          <p>Manage HSN and GST for your products.</p>
        </div>

        {/* Filters */}
        <LegacyCard>
          <Filters
            queryValue={searchTerm}
            onQueryChange={(value) => setSearchTerm(value)}
            onQueryClear={() => setSearchTerm("")}
            filters={[
              {
                key: "taggedWith",
                label: "Tagged with",
                filter: (
                  <LegacyStack spacing="tight">
                    <TextField
                      value={tagInput}
                      onChange={(value) => setTagInput(value)}
                      placeholder="Add a tag"
                    />
                    <Button onClick={handleAddTag}>Add</Button>
                  </LegacyStack>
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
                    onChange={setSelectedCollection}
                    value={selectedCollection}
                  />
                ),
              },
            ]}
          />
          <LegacyStack spacing="tight" wrap>
            {tags.map((tag) => (
              <Tag key={tag} onRemove={() => handleRemoveTag(tag)}>
                {tag}
              </Tag>
            ))}
          </LegacyStack>
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
          {filteredProducts.map(({ id, title, images, editableHSN, editableGST }, index) => (
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
                  value={editableHSN}
                  onChange={(value) => handleInputChange(id, "editableHSN", value)}
                />
              </IndexTable.Cell>
              <IndexTable.Cell>
                <TextField
                  value={editableGST}
                  onChange={(value) => handleInputChange(id, "editableGST", value)}
                />
              </IndexTable.Cell>
            </IndexTable.Row>
          ))}
        </IndexTable>

        {/* Save Changes Button */}
        <div style={{ marginTop: "16px", textAlign: "right" }}>
        <Button primary onClick={saveChanges} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Frame>
  );
}
