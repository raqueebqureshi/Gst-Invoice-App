import React, { useEffect, useState, useCallback } from "react";
import {
  IndexTable,
  LegacyCard,
  Tabs,
  TextField,
  Toast,
  Frame,
  Button,
  Stack,
  SkeletonPage,
  SkeletonBodyText,
} from "@shopify/polaris";

export default function ProductIndexTable() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [storeDomain, setStoreDomain] = useState("");
  const [storeEmail, setStoreEmail] = useState(""); // Store's email
  const [productCount, setProductCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Fetch products and calculate product count
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
        setProductCount(fetchedProducts.length); // Set product count
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
    await fetchProducts(); // Ensure products are fetched before syncing

    try {
      const response = await fetch("/api/add-store-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeDomain,
          email: storeEmail,
          products: products.map(({ id, title }) => ({
            productId: id,
            productName: title,
            hsn: "", // Initially empty
            gst: "", // Initially empty
          })),
        }),
      });

      if (response.ok) {
        console.log("Products saved successfully to the database.");
        setShowToast(true); // Show Toast for successful sync
      } else {
        console.error("Failed to save products to the database.");
      }
    } catch (error) {
      console.error("Error syncing products:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Fetch store info on component mount
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
          setStoreEmail(shopInfo.email); // Set store email
        }
      } catch (error) {
        console.error("Error fetching shop info:", error);
      }
    };

    fetchShopInfo();
    fetchProducts();
  }, [fetchProducts]);

  // Search functionality
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

  // Tab Filtering
  const filteredByTab = filteredProducts.filter((product) => {
    const status = product.status.toLowerCase();
    if (activeTab === 0) return true;
    if (activeTab === 1) return status === "active";
    if (activeTab === 2) return status === "draft";
    if (activeTab === 3) return status === "archived";
    return false;
  });

  const rowMarkup = filteredByTab.map(
    ({ id, title, images, status, HSN = "", GST = "" }, index) => (
      <IndexTable.Row id={id} key={id} position={index}>
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
            onChange={(value) => console.log(`HSN for ${id} changed to ${value}`)}
            autoComplete="off"
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            placeholder="Enter Tax"
            value={GST}
            onChange={(value) => console.log(`GST for ${id} changed to ${value}`)}
            autoComplete="off"
          />
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  return (
    <Frame>
      <LegacyCard>
        {/* Search and Sync Bar */}
        <div style={{ display: "flex", alignItems: "center", padding: "16px" }}>
          <div style={{ flex: 1, display: "flex", gap: "8px" }}>
            <TextField
              placeholder="Search products"
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              autoComplete="off"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
          <Button primary onClick={syncProducts}>
            Sync Products
          </Button>
        </div>

        {/* Tabs and Products Table */}
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
            onSelect={setActiveTab}
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
            >
              {rowMarkup}
            </IndexTable>
          </Tabs>
        )}
      </LegacyCard>

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          content="Product Sync completed!"
          onDismiss={() => setShowToast(false)}
        />
      )}
    </Frame>
  );
}
