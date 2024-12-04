import { 
  Layout, 
  Page, 
  AlphaCard, 
  Divider, 
  FooterHelp, 
  Link, 
  LegacyCard, 
  Tabs, 
  Button, 
  TextField 
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useEffect, useState, useCallback } from "react";

export default function Settings() {
  const [shopDetails, setShopDetails] = useState({});
  const [storeName, setStoreName] = useState("");
  const [selected, setSelected] = useState(0);
  const [logoFile, setLogoFile] = useState([]);
  const [signatureFile, setSignatureFile] = useState([]);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const handleDropLogo = useCallback((files) => setLogoFile(files), []);
  const handleDropSignature = useCallback((files) => setSignatureFile(files), []);

  const tabs = [
    { id: "Company-details-1", content: "Company Details", panelID: "company-details-content-1" },
    { id: "Logo-And-Signature-1", content: "Logo And Signature", panelID: "logo-signature-content-1" },
    { id: "Addresses-1", content: "Address", panelID: "address-content-1" },
    { id: "Social-1", content: "Social Links", panelID: "social-links-content-1" },
  ];

  useEffect(() => {
    fetch("/api/2024-10/shop.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data?.data?.data?.length > 0) {
          const shopInfo = data.data.data[0];
          setShopDetails(shopInfo);
          setStoreName(shopInfo.name || "");
        }
      })
      .catch((error) => console.log("Fetch error:", error));
  }, []);

  return (
    <>
      <TitleBar title="Settings" style={{ fontWeight: "bold" }} />
      <LegacyCard>
        <div
          style={{
            width: "80%",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "100vh",
          }}
        >
          <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
            <LegacyCard.Section>
              {selected === 0 && (
                <AlphaCard>
                  <TextField 
                    label="Legal name of business" 
                    value={shopDetails.name || ""} 
                    onChange={() => {}}
                  />
                  <TextField 
                    label="Phone" 
                    value={shopDetails.phone || ""} 
                    onChange={() => {}}
                  />
                  <Layout>
                    <Layout.Section oneHalf>
                      <TextField 
                        label="Sale email" 
                        value={shopDetails.email || ""} 
                        onChange={() => {}}
                      />
                    </Layout.Section>
                    <Layout.Section oneHalf>
                      <TextField 
                        label="Contact email" 
                        value={shopDetails.customer_email || ""} 
                        onChange={() => {}}
                      />
                    </Layout.Section>
                  </Layout>
                  <TextField 
                    label="Website" 
                    value={shopDetails.domain || ""} 
                    onChange={() => {}}
                  />
                  <TextField 
                    label="VAT number" 
                    value={shopDetails.vat_number || ""} 
                    onChange={() => {}}
                  />
                  <TextField 
                    label="Registered number" 
                    value={shopDetails.registered_number || ""} 
                    onChange={() => {}}
                  />
                </AlphaCard>
              )}

              {selected === 1 && (
                <AlphaCard>
                  <p>Upload your store's logo and signature for use on invoices:</p>
                  <Layout>
                    <Layout.Section>
                      <Button
                        plain
                        onClick={() => {
                          alert("Select Logo from Shopify Files");
                        }}
                      >
                        Select from Shopify Files
                      </Button>
                    </Layout.Section>
                    <Layout.Section>
                      <Button
                        plain
                        onClick={() => {
                          alert("Select Signature from Shopify Files");
                        }}
                      >
                        Select from Shopify Files
                      </Button>
                    </Layout.Section>
                  </Layout>
                </AlphaCard>
              )}

              {selected === 2 && (
                <AlphaCard>
                  <TextField 
                    label="Address" 
                    value={shopDetails.address1 || ""} 
                    onChange={() => {}}
                  />
                  <TextField 
                    label="Apartment" 
                    value={shopDetails.address2 || ""} 
                    onChange={() => {}}
                  />
                  <Layout>
                    <Layout.Section oneHalf>
                      <TextField 
                        label="City" 
                        value={shopDetails.city || ""} 
                        onChange={() => {}}
                      />
                    </Layout.Section>
                    <Layout.Section oneHalf>
                      <TextField 
                        label="Postal/ZIP code" 
                        value={shopDetails.zip || ""} 
                        onChange={() => {}}
                      />
                    </Layout.Section>
                  </Layout>
                  <TextField 
                    label="Country" 
                    value={shopDetails.country_name || ""} 
                    onChange={() => {}}
                  />
                </AlphaCard>
              )}

              {selected === 3 && (
                <AlphaCard>
                  <TextField 
                    label="Facebook" 
                    value={shopDetails.facebook || ""} 
                    onChange={() => {}}
                  />
                  <TextField 
                    label="Twitter" 
                    value={shopDetails.twitter || ""} 
                    onChange={() => {}}
                  />
                  <TextField 
                    label="Instagram" 
                    value={shopDetails.instagram || ""} 
                    onChange={() => {}}
                  />
                  <TextField 
                    label="Pinterest" 
                    value={shopDetails.pinterest || ""} 
                    onChange={() => {}}
                  />
                  <TextField 
                    label="YouTube" 
                    value={shopDetails.youtube || ""} 
                    onChange={() => {}}
                  />
                </AlphaCard>
              )}
            </LegacyCard.Section>
          </Tabs>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", marginBottom: "40px" }}>
            <Button primary onClick={() => alert("Settings saved!")}>
              Save
            </Button>
          </div>
        </div>
      </LegacyCard>
    </>
  );
}
