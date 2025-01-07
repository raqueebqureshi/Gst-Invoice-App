// import { 
//   Layout, 
//   Page, 
//   AlphaCard, 
//   Divider, 
//   FooterHelp, 
//   Link, 
//   LegacyCard, 
//   Tabs, 
//   Button, 
//   TextField 
// } from "@shopify/polaris";
// import { TitleBar } from "@shopify/app-bridge-react";
// import { useEffect, useState, useCallback } from "react";

// export default function Settings() {
//   const [shopDetails, setShopDetails] = useState({});
//   const [storeName, setStoreName] = useState("");
//   const [selected, setSelected] = useState(0);
//   const [logoFile, setLogoFile] = useState([]);
//   const [signatureFile, setSignatureFile] = useState([]);
//   const [email, setemail] = useState();
//   const [storeDomain, setstoreDomain] = useState();
//   const handleTabChange = useCallback(
//     (selectedTabIndex) => setSelected(selectedTabIndex),
//     []
//   );

//   const handleDropLogo = useCallback((files) => setLogoFile(files), []);
//   const handleDropSignature = useCallback((files) => setSignatureFile(files), []);

//   const tabs = [
//     { id: "Company-details-1", content: "Company Details", panelID: "company-details-content-1" },
//     { id: "Logo-And-Signature-1", content: "Logo And Signature", panelID: "logo-signature-content-1" },
//     { id: "Addresses-1", content: "Address", panelID: "address-content-1" },
//     { id: "Social-1", content: "Social Links", panelID: "social-links-content-1" },
//   ];

//   useEffect(() => {
//     fetch("/api/2024-10/shop.json", {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     })  
//       .then((response) => response.json())
//       .then((data) => {
//         if (data?.data?.data?.length > 0) {
//           const shopInfo = data.data.data[0];
//           setShopDetails(shopInfo);
//           setStoreName(shopInfo.name || "");
//           setemail(shopInfo.email);
//           setstoreDomain(shopInfo.domain);
//         }
//       })
//       .catch((error) => console.log("Fetch error:", error));
//   }, []);

//   return (
//     <>
//       <TitleBar title="Settings" style={{ fontWeight: "bold" }} />
//       <LegacyCard>
//         <div
//           style={{
//             width: "80%",
//             margin: "auto",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//             minHeight: "100vh",
//           }}
//         >
//           <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
//             <LegacyCard.Section>
//               {selected === 0 && (
//                 <AlphaCard>
//                   <TextField 
//                     label="Legal name of business" 
//                     value={shopDetails.name || ""} 
//                     onChange={() => {}}
//                   />
//                   <TextField 
//                     label="Phone" 
//                     value={shopDetails.phone || ""} 
//                     onChange={() => {}}
//                   />
//                   <Layout>
//                     <Layout.Section oneHalf>
//                       <TextField 
//                         label="Sale email" 
//                         value={shopDetails.email || ""} 
//                         onChange={() => {}}
//                       />
//                     </Layout.Section>
//                     <Layout.Section oneHalf>
//                       <TextField 
//                         label="Contact email" 
//                         value={shopDetails.customer_email || ""} 
//                         onChange={() => {}}
//                       />
//                     </Layout.Section>
//                   </Layout>
//                   <TextField 
//                     label="Website" 
//                     value={shopDetails.domain || ""} 
//                     onChange={() => {}}
//                   />
//                   <TextField 
//                     label="VAT number" 
//                     value={shopDetails.vat_number || ""} 
//                     onChange={() => {}}
//                   />
//                   <TextField 
//                     label="Registered number" 
//                     value={shopDetails.registered_number || ""} 
//                     onChange={() => {}}
//                   />
//                 </AlphaCard>
//               )}

//               {selected === 1 && (
//                 <AlphaCard>
//                   <p>Upload your store's logo and signature for use on invoices:</p>
//                   <Layout>
//                     <Layout.Section>
//                       <Button
//                         plain
//                         onClick={() => {
//                           alert("Select Logo from Shopify Files");
//                         }}
//                       >
//                         Select from Shopify Files
//                       </Button>
//                     </Layout.Section>
//                     <Layout.Section>
//                       <Button
//                         plain
//                         onClick={() => {
//                           alert("Select Signature from Shopify Files");
//                         }}
//                       >
//                         Select from Shopify Files
//                       </Button>
//                     </Layout.Section>
//                   </Layout>
//                 </AlphaCard>
//               )}

//               {selected === 2 && (
//                 <AlphaCard>
//                   <TextField 
//                     label="Address" 
//                     value={shopDetails.address1 || ""} 
//                     onChange={() => {}}
//                   />
//                   <TextField 
//                     label="Apartment" 
//                     value={shopDetails.address2 || ""} 
//                     onChange={() => {}}
//                   />
//                   <Layout>
//                     <Layout.Section oneHalf>
//                       <TextField 
//                         label="City" 
//                         value={shopDetails.city || ""} 
//                         onChange={() => {}}
//                       />
//                     </Layout.Section>
//                     <Layout.Section oneHalf>
//                       <TextField 
//                         label="Postal/ZIP code" 
//                         value={shopDetails.zip || ""} 
//                         onChange={() => {}}
//                       />
//                     </Layout.Section>
//                   </Layout>
//                   <TextField 
//                     label="Country" 
//                     value={shopDetails.country_name || ""} 
//                     onChange={() => {}}
//                   />
//                 </AlphaCard>
//               )}

//               {selected === 3 && (
//                 <AlphaCard>
//                   <TextField 
//                     label="Facebook" 
//                     value={shopDetails.facebook || ""} 
//                     onChange={() => {}}
//                   />
//                   <TextField 
//                     label="Twitter" 
//                     value={shopDetails.twitter || ""} 
//                     onChange={() => {}}
//                   />
//                   <TextField 
//                     label="Instagram" 
//                     value={shopDetails.instagram || ""} 
//                     onChange={() => {}}
//                   />
//                   <TextField 
//                     label="Pinterest" 
//                     value={shopDetails.pinterest || ""} 
//                     onChange={() => {}}
//                   />
//                   <TextField 
//                     label="YouTube" 
//                     value={shopDetails.youtube || ""} 
//                     onChange={() => {}}
//                   />
//                 </AlphaCard>
//               )}
//             </LegacyCard.Section>
//           </Tabs>
//           <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px", marginBottom: "40px" }}>
//             <Button primary onClick={() => alert("Settings saved!")}>
//               Save
//             </Button>
//           </div>
//         </div>
//       </LegacyCard>
//     </>
//   );
// }
















import {
  Layout,
  Page,
  AlphaCard,
  Tabs,
  Button,
  TextField,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useEffect, useState, useCallback } from "react";

export default function Settings() {
  const [selected, setSelected] = useState(0);
  const [storeDomain, setStoreDomain] = useState("");
  const [email, setEmail] = useState("");
  const [shopId, setshopId] = useState("")
  const [showToast, setShowToast] = useState({
      active: false,
      message: "",
      error: false,
    });
  const [storeProfile, setStoreProfile] = useState({
    firstName: "",
    lastName: "",
    brandColor: "#000000",
    invoiceNumber: 1001,
    invoicePrefix: "INV-25-26",
    brandName: "",
    phone: "",
    storeEmail: "",
    websiteURL: "",
    gstNumber: "",
  });
  const [images, setImages] = useState({
    logoURL: "",
    signatureURL: "",
  });
  const [addresses, setAddresses] = useState({
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [socialLinks, setSocialLinks] = useState({
    facebookURL: "",
    xURL: "",
    instagramURL: "",
    pinterestURL: "",
    youtubeURL: "",
  });

  const tabs = [
    { id: "Company-details-1", content: "Company Details" },
    { id: "Logo-And-Signature-1", content: "Logo And Signature" },
    { id: "Addresses-1", content: "Address" },
    { id: "Social-1", content: "Social Links" },
  ];

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const handleShowToast = (message, error = false) => {
    setShowToast({ active: true, message, error });
  };
  // Fetch initial data for store domain and email
  useEffect(() => {
    fetch("/api/2024-10/shop.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        const shopInfo = data?.data?.data?.[0];
        console.log("Shop info:", shopInfo);
        setStoreDomain(shopInfo.domain || "");
        setEmail(shopInfo.email || "");
        setshopId(shopInfo.id || "")
        console.log("Store domain:", storeDomain);
        console.log("Email:", email);
      })
      .catch((error) => console.log("Error fetching shop info:", error));
  }, []);

  const handleSave = async () => {
    try {
      const requestData = {
        shopId,
        storeProfile,
        images,
        addresses,
        socialLinks,
      };
  
      const response = await fetch("/api/update-store-data", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData), // Properly serialize the body
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Settings saved successfully:", responseData);
      } else {
        const errorData = await response.json();
        console.error("Failed to save settings:", errorData);
      }
    } catch (error) {
      console.error("Error while saving settings:", error);
    }
  };
  

  return (
    <Page>
      <TitleBar title="Settings" />
      <AlphaCard>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          {selected === 0 && (
            <div>
              <TextField
                label="First Name"
                value={storeProfile.firstName}
                onChange={(value) =>
                  setStoreProfile({ ...storeProfile, firstName: value })
                }
              />
              <TextField
                label="Last Name"
                value={storeProfile.lastName}
                onChange={(value) =>
                  setStoreProfile({ ...storeProfile, lastName: value })
                }
              />
              <TextField
                label="Brand Color"
                value={storeProfile.brandColor}
                onChange={(value) =>
                  setStoreProfile({ ...storeProfile, brandColor: value })
                }
              />
              <TextField
                label="Invoice Number"
                value={storeProfile.invoiceNumber}
                type="number"
                onChange={(value) =>
                  setStoreProfile({
                    ...storeProfile,
                    invoiceNumber: Number(value),
                  })
                }
              />
              <TextField
                label="Invoice Prefix"
                value={storeProfile.invoicePrefix}
                onChange={(value) =>
                  setStoreProfile({ ...storeProfile, invoicePrefix: value })
                }
              />
              <TextField
                label="Brand Name"
                value={storeProfile.brandName}
                onChange={(value) =>
                  setStoreProfile({ ...storeProfile, brandName: value })
                }
              />
              <TextField
                label="Phone"
                value={storeProfile.phone}
                onChange={(value) =>
                  setStoreProfile({ ...storeProfile, phone: value })
                }
              />
              <TextField
                label="Store Email"
                value={storeProfile.storeEmail}
                onChange={(value) =>
                  setStoreProfile({ ...storeProfile, storeEmail: value })
                }
              />
              <TextField
                label="Website URL"
                value={storeProfile.websiteURL}
                onChange={(value) =>
                  setStoreProfile({ ...storeProfile, websiteURL: value })
                }
              />
              <TextField
                label="GST Number"
                value={storeProfile.gstNumber}
                onChange={(value) =>
                  setStoreProfile({ ...storeProfile, gstNumber: value })
                }
              />
            </div>
          )}
          {selected === 1 && (
            <div>
              <TextField
                label="Logo URL"
                value={images.logoURL}
                onChange={(value) =>
                  setImages({ ...images, logoURL: value })
                }
              />
              <TextField
                label="Signature URL"
                value={images.signatureURL}
                onChange={(value) =>
                  setImages({ ...images, signatureURL: value })
                }
              />
            </div>
          )}
          {selected === 2 && (
            <div>
              <TextField
                label="Address"
                value={addresses.address}
                onChange={(value) =>
                  setAddresses({ ...addresses, address: value })
                }
              />
              <TextField
                label="Apartment"
                value={addresses.apartment}
                onChange={(value) =>
                  setAddresses({ ...addresses, apartment: value })
                }
              />
              <TextField
                label="City"
                value={addresses.city}
                onChange={(value) =>
                  setAddresses({ ...addresses, city: value })
                }
              />
              <TextField
                label="Postal Code"
                value={addresses.postalCode}
                onChange={(value) =>
                  setAddresses({ ...addresses, postalCode: value })
                }
              />
              <TextField
                label="Country"
                value={addresses.country}
                onChange={(value) =>
                  setAddresses({ ...addresses, country: value })
                }
              />
            </div>
          )}
          {selected === 3 && (
            <div>
              <TextField
                label="Facebook URL"
                value={socialLinks.facebookURL}
                onChange={(value) =>
                  setSocialLinks({ ...socialLinks, facebookURL: value })
                }
              />
              <TextField
                label="Twitter URL"
                value={socialLinks.xURL}
                onChange={(value) =>
                  setSocialLinks({ ...socialLinks, xURL: value })
                }
              />
              <TextField
                label="Instagram URL"
                value={socialLinks.instagramURL}
                onChange={(value) =>
                  setSocialLinks({ ...socialLinks, instagramURL: value })
                }
              />
              <TextField
                label="Pinterest URL"
                value={socialLinks.pinterestURL}
                onChange={(value) =>
                  setSocialLinks({ ...socialLinks, pinterestURL: value })
                }
              />
              <TextField
                label="YouTube URL"
                value={socialLinks.youtubeURL}
                onChange={(value) =>
                  setSocialLinks({ ...socialLinks, youtubeURL: value })
                }
              />
            </div>
          )}
        </Tabs>
        <div style={{ marginTop: "20px", textAlign: "right" }}>
          <Button primary onClick={handleSave}>
            Save
          </Button>
        </div>
      </AlphaCard>
    </Page>
  );
}
