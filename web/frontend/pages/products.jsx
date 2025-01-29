import React, { useEffect, useState, useCallback, use } from "react";
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
  Modal,
} from "@shopify/polaris";
import ToastNotification from "../components/ToastNotification"; // Import the ToastNotification component


export default function ProductIndexTable() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [storeDomain, setStoreDomain] = useState("");
  const [email, setEmail] = useState("");
  const [productCount, setProductCount] = useState(0);
  const [draftProductCount, setDraftProductCount] = useState(0);
  const [activeProductCount, setActiveProductCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tagSearchTerm, setTagSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const [GSTHSNCodes, setGSTHSNCodes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bulkHSN, setBulkHSN] = useState("");
  const [bulkGST, setBulkGST] = useState("");

  const fetchShopInfo = async () => {
    try {
      const response = await fetch("/api/2024-10/shop.json", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      // console.log("API Response:", data.data.data[0]); // Check the response structure
      if (data?.data?.data?.length > 0) {
        const shopInfo = data.data.data[0];
        setStoreDomain(shopInfo.domain);
        setEmail(shopInfo.email);
      }
    } catch (error) {
      console.error("Error fetching shop info:", error);
    }
  };

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/products/all", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.data.length > 0) {
        const fetchedProducts = data.data;
        // console.log("fetchedProducts  :", fetchedProducts);
        const productsWithEditableFields = data.data.map((product) => ({
          ...product,
          editableHSN: product.HSN || "",
          editableGST: product.GST || "",
        }));
        // console.log("productsWithEditableFields:", productsWithEditableFields);
        setProducts(productsWithEditableFields);
        setFilteredProducts(productsWithEditableFields);
        // setProducts(fetchedProducts);
        // setFilteredProducts(fetchedProducts);
        // setProductCount(fetchedProducts.length);
        setProductCount(productsWithEditableFields.length);

        const activeCount = productsWithEditableFields.filter(
          (product) => product.status.toLowerCase() === "active"
        ).length;
        const draftCount = productsWithEditableFields.filter(
          (product) => product.status.toLowerCase() === "draft"
        ).length;

        setActiveProductCount(activeCount);
        setDraftProductCount(draftCount);
        setShowToast(true);
        setToastMessage("Products fetched successfully.");
        // console.log("storeDomain && email:", storeDomain, email);
        if (storeDomain && email) {
          // console.log("products--:", productsWithEditableFields);
          fetchGSTHSNValues(productsWithEditableFields); // Fetch GST HSN values
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [storeDomain, email]);

  const fetchGSTHSNValues = async (products) => {
    try {
      if (!storeDomain || !email) {
        console.error("Missing storeDomain or email:", {
          storeDomain,
          email: email,
        });
        throw new Error("Invalid storeDomain or email.");
      }

      const url = `/api/products/gsthsn?storeDomain=${encodeURIComponent(storeDomain)}&email=${encodeURIComponent(
        email
      )}`;
      // console.log("Fetching GST HSN Values with URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch GST values. Status: ${response.status}`);
      }

      const data = await response.json();
      // console.log("Fetched GST Values:", data.gstValues);

      setGSTHSNCodes(data.gstValues);

      // Update products with fetched GST values
      updateProductsWithGSTHSN(data.gstValues, products);
    } catch (error) {
      console.error("Error fetching GST values:", error);
    }
  };

  const updateProductsWithGSTHSN = (gstValues, products) => {
    // console.log("gstValues:", gstValues);
    // console.log("products:", products);
    if (products.length !== 0) {
      const updatedProducts = products.map((product) => {
        const matchedGSTHSN = gstValues.find((items) => {
          return Number(items.productId) === product.id;
        });

        return {
          ...product,
          hsn: matchedGSTHSN ? matchedGSTHSN.hsn : "N/A",
          gst: matchedGSTHSN ? matchedGSTHSN.gst : "N/A",
        };
      });

      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setProductCount(updatedProducts.length);

      const activeCount = updatedProducts.filter((product) => product.status.toLowerCase() === "active").length;
      const draftCount = updatedProducts.filter((product) => product.status.toLowerCase() === "draft").length;

      setActiveProductCount(activeCount);
      setDraftProductCount(draftCount);
      // console.log("Updated Products with GST/HSN:", updatedProducts);
      
    } else {
      updateProductsWithGSTHSN(gstValues);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchShopInfo(); // Fetch shop info first
    };

    fetchData(); // Call the fetchData function
  }, []); // Run only once on component mount

  useEffect(() => {
    const fetchData = async () => {
      if (storeDomain && email) {
        await fetchProducts(); // Fetch products after shop info is set
        // await fetchGSTHSNValues(); // Then fetch GST HSN values
      }
    };

    fetchData(); // Call the fetchData function
  }, [storeDomain, email]); // Run when storeDomain or storeEmail changes

  

  const syncProducts = async () => {
    setIsLoading(true);
    await fetchProducts();
    try {
      const response = await fetch("/api/add-store-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeDomain: storeDomain,
          email: email,
          products: products.map(({ id, title, editableHSN, editableGST }) => ({
            productId: id,
            productName: title,
            hsn: editableHSN,
            gst: editableGST,
          })),
        }),
      });

      // console.log("response.body:", response.body);

      if (response.ok) {
        // console.log("Products saved successfully to the database.");
        setShowToast(true);
        setToastMessage("Products synced successfully.");
      } else {
        console.error("Failed to save products to the database.");
      }
    } catch (error) {
      console.error("Error syncing products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }, [showToast]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchShopInfo();
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };

    initializeData();
  }, []);

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
      (product) => product.tags && product.tags.includes(tagSearchTerm.toLowerCase())
    );
    setFilteredProducts(taggedProducts);
    setSelectedTag(tagSearchTerm);
  };

  const handleRemoveTag = () => {
    setSelectedTag(null);
    setTagSearchTerm("");
    setFilteredProducts(products);
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedProducts.map(({ id }) => id);
    if (isAllSelected) {
      setSelectedItems((prevSelectedItems) => prevSelectedItems.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedItems((prevSelectedItems) => [
        ...prevSelectedItems,
        ...currentPageIds.filter((id) => !prevSelectedItems.includes(id)),
      ]);
    }
  };

  const handleRowSelection = (id) => {
    // console.log('handleRowSelection - id:', id);
    setSelectedItems((prevSelectedItems) => {
      
      if (prevSelectedItems.includes(id)) {
        // console.log('prevSelectedItems', prevSelectedItems);
        // If the row is already selected, remove it from the selection
        return prevSelectedItems.filter((itemId) => itemId !== id);
      } else {
        // Otherwise, add it to the selection
        // console.log('prevSelectedItems', prevSelectedItems);
        return [...prevSelectedItems, id];
      }
    });
  };

  const filteredByTab = filteredProducts.filter((product) => {
    const status = product.status.toLowerCase();
    if (activeTab === 0) return true;
    if (activeTab === 1) return status === "active";
    if (activeTab === 2) return status === "draft";
    if (activeTab === 3) return status === "archived";
    return false;
  });

  const paginatedProducts = filteredByTab.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const isAllSelected = paginatedProducts.length > 0 && paginatedProducts.every(({ id }) => selectedItems.includes(id));

  const [editableValues, setEditableValues] = useState(
    paginatedProducts.reduce((acc, product) => {
      acc[product.id] = {
        HSN: product.editableHSN || "",
        GST: product.editableGST || "",
      };
      return acc;
    }, {})
  );

  const handleHSNChange = (id, value) => {
    setEditableValues((prev) => {
      const updatedValues = {
        ...prev,
        [id]: {
          ...prev[id],
          HSN: value,
        },
      };

      // Update products with the new HSN value
      const updatedProducts = products.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            editableHSN: value, // Update editableHSN
          };
        }
        return product;
      });

      setProducts(updatedProducts); // Update the products state
      // console.log(`HSN for ${id} changed to ${value}`);
      // console.log("editableValues:", updatedValues);
      // console.log("products:", updatedProducts);

      return updatedValues; // Return the updated editable values
    });
  };

  const handleGSTChange = (id, value) => {
    setEditableValues((prev) => {
      const updatedValues = {
        ...prev,
        [id]: {
          ...prev[id],
          GST: value,
        },
      };

      // Update products with the new GST value
      const updatedProducts = products.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            editableGST: value, // Update editableGST
          };
        }
        return product;
      });

      setProducts(updatedProducts); // Update the products state
      // console.log(`GST for ${id} changed to ${value}`);
      // console.log("editableValues:", updatedValues);
      // console.log("products:", updatedProducts);

      return updatedValues; // Return the updated editable values
    });
  };
  const rowMarkup = paginatedProducts.map(({ id, title, images, status, hsn, gst }, index) => {
    const { HSN, GST } = editableValues[id] || {
      HSN: hsn || "",
      GST: gst || "",
    }; // Get current editable values

    return (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedItems.includes(id)}
        position={index}
        onClick={(e) => handleRowSelection(e.target.value)}
      >
        <IndexTable.Cell>
          <img
            src={images[0]?.src}
            alt={images[0]?.alt}
            style={{
              border: "0.1px solid black",
              borderRadius: "5px",
              width: "100%",
              maxWidth: "50px",
              height: "50px",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent event propagation
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
            onChange={(value) => handleHSNChange(id, value)}
            autoComplete="off"
            onClick={(e) => e.stopPropagation()} // Prevent event propagation
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            placeholder="Enter GST"
            value={GST}
            onChange={(value) => handleGSTChange(id, value)}
            autoComplete="off"
            onClick={(e) => e.stopPropagation()} // Prevent event propagation
          />
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  // const rowMarkup = paginatedProducts.map(
  //   ({ id, title, images, status, hsn, gst }, index) => (
  //     <IndexTable.Row
  //       id={id}
  //       key={id}
  //       position={index}
  //       selected={selectedItems.includes(id)}
  //       onClick={() => handleRowSelection(id)}
  //     >
  //       <IndexTable.Cell>
  //         <img
  //           src={images[0]?.src}
  //           alt={images[0]?.alt}
  //           style={styles.responsiveImage}
  //         />
  //       </IndexTable.Cell>
  //       <IndexTable.Cell>
  //         <span style={{ fontWeight: "bold" }}>{title}</span>
  //       </IndexTable.Cell>
  //       <IndexTable.Cell>{status}</IndexTable.Cell>
  //       <IndexTable.Cell>
  //         <TextField
  //           placeholder="Enter HSN"
  //           value={hsn}
  //           onChange={(value) => console.log(`HSN for ${id} changed to ${value}`)}
  //           autoComplete="off"
  //         />
  //       </IndexTable.Cell>
  //       <IndexTable.Cell>
  //         <TextField
  //           placeholder="Enter GST"
  //           value={gst}
  //           onChange={(value) => console.log(`GST for ${id} changed to ${value}`)}
  //           autoComplete="off"
  //         />
  //       </IndexTable.Cell>
  //     </IndexTable.Row>
  //   )
  // );

  // const rowMarkup = paginatedProducts.map(({ id, title, images, status, editableHSN, editableGST}, index) => {
  //   const [editHSN, setEditeHSN] = useState(editableHSN || ""); // Use current value or default to empty
  //   const [editGST, setEditGST] = useState(editableGST || ""); // Use current value or default to empty

  //   const handleHSNChange = (value) => {
  //     setEditeHSN(value);
  //     console.log(`HSN for ${id} changed to ${value}`);
  //   };

  //   const handleGSTChange = (value) => {
  //     setEditGST(value);
  //     console.log(`GST for ${id} changed to ${value}`);
  //   };

  //   return (
  //     <IndexTable.Row
  //       id={id}
  //       key={id}
  //       position={index}
  //       selected={selectedItems.includes(id)}
  //       onClick={() => handleRowSelection(id)}
  //     >
  //       <IndexTable.Cell>
  //         <img
  //           src={images[0]?.src}
  //           alt={images[0]?.alt}
  //           style={styles.responsiveImage}
  //         />
  //       </IndexTable.Cell>
  //       <IndexTable.Cell>
  //         <span style={{ fontWeight: "bold" }}>{title}</span>
  //       </IndexTable.Cell>
  //       <IndexTable.Cell>{status}</IndexTable.Cell>
  //       <IndexTable.Cell>
  //         <TextField
  //           placeholder="Enter HSN"
  //           value={editHSN}
  //           onChange={(value) => handleHSNChange(value)}
  //           autoComplete="off"
  //         />
  //       </IndexTable.Cell>
  //       <IndexTable.Cell>
  //         <TextField
  //           placeholder="Enter GST"
  //           value={editGST}
  //           onChange={(value) => handleGSTChange(value)}
  //           autoComplete="off"
  //         />
  //       </IndexTable.Cell>
  //     </IndexTable.Row>
  //   );
  // });

  const saveChanges = async () => {
    setIsSaving(true);
    const updates = selectedItems.map((id) => {
      const product = products.find((product) => product.id === id);

      // console.log(
      //   "id:",
      //   product.id,
      //   " HSN:",
      //   product.editableHSN,
      //   "GST:",
      //   product.editableGST,
      //   "storeDomain:",
      //   storeDomain,
      //   "email:",
      //   email
      // );

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
        setIsSaving(false);
        alert(`Failed to save changes: ${errorDetails.message}`);
        return;
      }

      const responseData = await response.json();
      console.log("API Response:", responseData);
      // alert("Changes saved successfully!");
      // Reset editable values to blank after successful save

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
      fetchProducts();
      setSelectedItems([]);
      setShowToast(true);
      setToastMessage("Products updated successfully.");
    } catch (error) {
      console.error("Error saving changes:", error);
      setIsSaving(false);
      alert("An error occurred while saving changes.");
    }
  };

  const saveBulkChanges = async () => {
    setIsSaving(true);
    const updates = selectedItems.map((id) => ({
      id,
      HSN: bulkHSN,
      GST: bulkGST,
    }));

    try {
      const response = await fetch("/api/products/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeDomain,
          email,
          products: updates,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("API Error:", errorDetails);
        setIsSaving(false);
        alert(`Failed to save changes: ${errorDetails.message}`);
        return;
      }

      // alert("Changes saved successfully!");
      setShowModal(false);
      setSelectedItems([]);
      fetchProducts();
      setShowToast(true);
      setToastMessage("Products updated successfully.");
    } catch (error) {
      console.error("Error saving changes:", error);
      // alert("An error occurred while saving changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Frame>
      <div
        style={{
          maxWidth: "100%",
          margin: "0 auto",
          padding: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "6px",
            marginBottom: "16px",
          }}
        >
          <strong style={{ fontSize: "20px" }}>Products</strong>
          <strong>Manage HSN & GST rates</strong>

          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Badge status="info" style={{ margin: "4px" }}>
              Total: {filteredByTab.length}
            </Badge>
            <Badge status="success" style={{ margin: "4px" }}>
              Active: {filteredByTab.filter((product) => product.status.toLowerCase() === "active").length}
            </Badge>
            <Badge status="warning" style={{ margin: "4px" }}>
              Draft: {filteredByTab.filter((product) => product.status.toLowerCase() === "draft").length}
            </Badge>
          </div>
        </div>
        <LegacyCard sectioned style={{ margin: "16px", maxWidth: "1600px" }}>
        <div
  style={{
    display: "grid",
    gridTemplateColumns: "3fr 3fr 3fr", // Three columns layout: 3 parts search fields, 1 part buttons
    gap: "6px", // Space between columns
    marginBottom: "26px",
    alignItems: "center",
    width: "100%",
  }}
>
  {/* Search Products Field */}
  <div
    style={{
      display: "flex",
      gap: "8px", // Space between TextField and Button
      width: "100%",
    }}
  >
    <TextField
      placeholder="Search products"
      value={searchTerm}
      onChange={(value) => setSearchTerm(value)}
      autoComplete="off"
      style={{ width: "100%" }}
    />
    <Button primary onClick={handleSearch}>
      Search
    </Button>
  </div>

  {/* Search by Tag Field */}
  <div
    style={{
      display: "flex",
      gap: "8px",
      width: "100%",
    }}
  >
    <TextField
      placeholder="Search by tag"
      value={tagSearchTerm}
      onChange={(value) => setTagSearchTerm(value)}
      autoComplete="off"
      style={{ width: "100%" }}
    />
    <Button primary onClick={handleTagSearch}>
      Find
    </Button>
  </div>

  {/* Buttons aligned right */}
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end", // Align buttons to the right
      gap: "8px",
    }}
  >
    <Button
      primary
      onClick={() => {
        if (selectedItems.length === 0) {
          alert("Please select a product to save changes");
          return;
        } else {
          saveChanges();
        }
      }}
      disabled={isSaving}
    >
      {isSaving ? "Saving..." : "Save Changes"}
    </Button>
    <Button primary onClick={syncProducts}>
      Sync Products
    </Button>
  </div>
</div>


          {/* Tag Display */}
{selectedTag && (
  <div
    style={{
      marginTop: "16px",
      display: "flex",
      justifyContent: "flex-start", // Align to the left
    }}
  >
    <Tag onRemove={handleRemoveTag}>{selectedTag}</Tag>
  </div>
)}


          

          {isLoading ? (
            <SkeletonPage>
              <SkeletonBodyText lines={4} />
            </SkeletonPage>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
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
                    { title: "GST" },
                  ]}
                  selectedItems={selectedItems}
                  selectedItemsCount={selectedItems.length}
                  onSelectionChange={handleSelectAll}
                  bulkActions={[
                    {
                      content: "Bulk Edit",
                      onAction: () => setShowModal(true),
                    },
                  ]}
                >
                  {rowMarkup}
                </IndexTable>
                <div
                  style={{
                    marginTop: "16px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Pagination
                    hasPrevious={currentPage > 1}
                    onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    hasNext={currentPage * itemsPerPage < filteredByTab.length}
                    onNext={() => setCurrentPage((prev) => prev + 1)}
                  />
                </div>
              </Tabs>
            </div>
          )}
        </LegacyCard>
      </div>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Bulk Edit HSN & GST"
        primaryAction={{
          content: "Save",
          onAction: saveBulkChanges,
          loading: isSaving,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => setShowModal(false),
          },
        ]}
      >
        <Modal.Section>
          <TextField
            label="HSN"
            placeholder="Enter HSN"
            value={bulkHSN}
            onChange={(value) => setBulkHSN(value)}
            autoComplete="off"
          />
          <TextField
            label="GST"
            placeholder="Enter GST"
            value={bulkGST}
            onChange={(value) => setBulkGST(value)}
            autoComplete="off"
          />
        </Modal.Section>
      </Modal>
      {showToast && 
      <ToastNotification
      message={toastMessage}
      duration={3000} // Optional, can be customized
    />}
    </Frame>
  );
}
