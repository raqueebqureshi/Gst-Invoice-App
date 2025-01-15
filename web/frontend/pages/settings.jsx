import {
  Layout,
  Page,
  AlphaCard,
  Tabs,
  Button,
  FormLayout,
  LegacyStack,
  TextField,
  DropZone,
  Thumbnail,
} from "@shopify/polaris";
import { RiDeleteBinLine } from "react-icons/ri"; // FontAwesome
import { Collapsible, HorizontalStack, VerticalStack, Icon } from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import React, { useEffect, useState, useCallback } from "react";
import { set } from "mongoose";

export default function Settings() {
  const [selected, setSelected] = useState(0);
  const [storeDomain, setStoreDomain] = useState("");
  const [email, setEmail] = useState("");
  const [shopId, setshopId] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);
  const [uploadLogoStatus, setUploadLogoStatus] = useState("");
  const [uploadSignatureStatus, setUploadSignatureStatus] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");
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
  const [isSaving, setIsSaving] = useState(false);
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
    { id: "Logo-And-Signature-1", content: "Logo And Branding" },
    { id: "Addresses-1", content: "Address" },
    { id: "Social-1", content: "Social Links" },
  ];

  const [file, setFile] = useState(null); // Store the selected image file

  // Handle file drop
  const handleDrop = useCallback((_dropFiles, acceptedFiles, _rejectedFiles) => {
    setFile(acceptedFiles[0]); // Only take the first accepted file
  }, []);

  const handleTabChange = useCallback((selectedTabIndex) => setSelected(selectedTabIndex), []);

  const handleLogoDrop = useCallback((_dropFiles, acceptedFiles) => {
    setLogoFile(URL.createObjectURL(acceptedFiles[0]));
    if (acceptedFiles[0]) {
      handleLogoUpload(acceptedFiles[0]);
      console.log("acceptedFiles[0]", acceptedFiles[0]);
    }
  }, []);

  const handleSignatureDrop = useCallback((_dropFiles, acceptedFiles) => {
    setSignatureFile(URL.createObjectURL(acceptedFiles[0]));
    if (acceptedFiles[0]) {
      handleSignatureUpload(acceptedFiles[0]);
      console.log("acceptedFiles[0]", acceptedFiles[0]);
    }
  }, []);

  const handleShowToast = (message, error = false) => {
    setShowToast({ active: true, message, error });
  };
  //   // Fetch initial data for store domain and email
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
        setshopId(shopInfo.id || "");
        console.log("Store domain:", storeDomain);
        console.log("Email:", email);
        console.log("ShopID:", shopId);
      })
      .catch((error) => console.log("Error fetching shop info:", error));
  }, []);

  useEffect(() => {
    fetch(`/api/fetch-store-profile?shopId=${shopId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.profile) {
          const profileData = data.profile;

          // Set the individual states
          setStoreProfile(profileData.storeProfile || {});
          setImages(profileData.images || {});
          setAddresses(profileData.addresses || {});
          setSocialLinks(profileData.socialLinks || {});
          if (profileData.images.logoURL !== "" && profileData.images.logoURL !== null) {
            setLogoUrl(profileData.images.logoURL);
          }
          if (profileData.images.signatureURL !== "" && profileData.images.signatureURL !== null) {
            setSignatureUrl(profileData.images.signatureURL);
          }
          console.log("Shop Profile Data", profileData);
          console.log("Logo URL:", logoFile);
        }
      })
      .catch((error) => {
        console.error("Error fetching store profile:", error);
      });
  }, [shopId]);

  useEffect(() => {
    console.log("logoUrl:", logoUrl);
    console.log("signatureUrl:", signatureUrl);
    console.log("images", images);
  }, [logoUrl, signatureUrl]);

  useEffect(() => {
    setTimeout(() => {
      setUploadLogoStatus("");
      setUploadSignatureStatus("");
    }, 5000);
  }, [uploadLogoStatus, uploadSignatureStatus]);

  const handleSave = async () => {
    setIsSaving(true);
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
        setIsSaving(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to save settings:", errorData);
        setIsSaving(false);
      }
    } catch (error) {
      console.error("Error while saving settings:", error);
      setIsSaving(false);
    }
  };

  // Handle upload button click
  const handleLogoUpload = async (file) => {
    if (!file) {
      setUploadLogoStatus("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("logo", file); // This matches the multer key

    try {
      setUploadLogoStatus("Uploading...");
      const response = await fetch("/api/upload-logo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("data", data);
      setUploadLogoStatus("Uploaded successful!");
      setImages((prevImages) => ({
        ...prevImages,
        logoURL: data.logoURL,
      }));
      setLogoUrl(data.logoURL);
    } catch (error) {
      setUploadLogoStatus(`Upload failed: ${error.message}`);
    }
  };

  const handleLogoDelete = async (shopId) => {
    console.log("Deleting logo with URL:", shopId);
    if (!logoUrl) {
      setUploadLogoStatus("No logo to delete.");
      return;
    }

    try {
      setUploadLogoStatus("Deleting...");
      const response = await fetch("/api/remove-logo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId }), // Sending the image URL to delete
      });

      if (!response.ok) {
        throw new Error("Deletion failed");
      }

      const data = await response.json();
      console.log(data);
      setUploadLogoStatus("Logo deleted successfully!");
      setLogoUrl(""); // Clear the image URL after deletion
      setImages({
        ...images,
        logoURL: "",
      });
      setLogoFile(null); // Clear selected file if needed
    } catch (error) {
      setUploadLogoStatus(`Deletion failed: ${error.message}`);
    }
  };

  const handleSignatureUpload = async (file) => {
    if (!file) {
      setUploadSignatureStatus("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("signature", file); // This matches the multer key

    try {
      setUploadSignatureStatus("Uploading...");
      const response = await fetch("/api/upload-signature", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("data", data);
      setUploadSignatureStatus("Uploaded successful!");
      setImages((prevImages) => ({
        ...prevImages,
        signatureURL: data.signatureURL,
      }));
      setSignatureUrl(data.signatureURL);
    } catch (error) {
      setUploadSignatureStatus(`Upload failed: ${error.message}`);
    }
  };

  const handleSignatureDelete = async (shopId) => {
    console.log("Signature with URL:", shopId);
    if (!signatureUrl) {
      setUploadSignatureStatus("No Signature to delete.");
      return;
    }

    try {
      setUploadSignatureStatus("Deleting...");
      const response = await fetch("/api/remove-signature", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId }), // Sending the image URL to delete
      });

      if (!response.ok) {
        throw new Error("Deletion failed");
      }

      const data = await response.json();
      console.log(data);
      setUploadSignatureStatus("Signature deleted successfully!");
      setSignatureUrl(""); // Clear the image URL after deletion
      setImages({
        ...images,
        signatureURL: "",
      });
      setSignatureFile(null); // Clear selected file if needed
    } catch (error) {
      setUploadSignatureStatus(`Deletion failed: ${error.message}`);
    }
  };

  const [isSectionOpen, setIsSectionOpen] = useState({
    general: true,
    branding: true,
    address: true,
    social: true,
  });

  const toggleSection = (section) => setIsSectionOpen((prev) => ({ ...prev, [section]: !prev[section] }));

  return (
    <Page>
      <TitleBar title="Settings" />
      {/* <AlphaCard>
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
      </AlphaCard> */}

      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} />
      <div style={{ marginTop: "24px" }}>
        {selected === 0 && (
          <AlphaCard padding="5">
            <h2 style={sectionTitleStyle}>General Information</h2>
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  label="First Name"
                  placeholder="Enter first name"
                  value={storeProfile.firstName}
                  onChange={(value) => setStoreProfile({ ...storeProfile, firstName: value })}
                />
                <TextField
                  label="Last Name"
                  placeholder="Enter last name"
                  value={storeProfile.lastName}
                  onChange={(value) => setStoreProfile({ ...storeProfile, lastName: value })}
                />
              </FormLayout.Group>
              <TextField
                label="Brand Name"
                placeholder="Enter your brand name"
                value={storeProfile.brandName}
                onChange={(value) => setStoreProfile({ ...storeProfile, brandName: value })}
              />
              <FormLayout.Group>
                <TextField
                  label="Store Email"
                  type="email"
                  placeholder="example@domain.com"
                  value={storeProfile.storeEmail}
                  onChange={(value) => setStoreProfile({ ...storeProfile, storeEmail: value })}
                />
                <TextField
                  label="Phone Number"
                  placeholder="Enter phone number"
                  value={storeProfile.phone}
                  onChange={(value) => setStoreProfile({ ...storeProfile, phone: value })}
                />
              </FormLayout.Group>
              <TextField
                label="Website URL"
                placeholder="https://yourstore.com"
                value={storeProfile.websiteURL}
                onChange={(value) => setStoreProfile({ ...storeProfile, websiteURL: value })}
              />
              <TextField
                label="GST Number"
                placeholder="Enter GST number"
                value={storeProfile.gstNumber}
                onChange={(value) => setStoreProfile({ ...storeProfile, gstNumber: value })}
              />
            </FormLayout>
          </AlphaCard>
        )}

        {selected === 1 && (
          <AlphaCard padding="5">
            <h2 style={sectionTitleStyle}>Branding Information</h2>
            <FormLayout>
              <TextField
                label="Brand Color (Hex)"
                placeholder="#000000"
                type="text"
                value={storeProfile.brandColor}
                onChange={(value) => setStoreProfile({ ...storeProfile, brandColor: value })}
              />
              <FormLayout.Group>
                {/* Logo Image Upload */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontWeight: "bold" }}>Logo</label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        // width: 114,
                        // height: 114,
                        borderRadius: "8px",
                        overflow: "hidden",
                        display: "flex",

                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f4f6f8",
                      }}
                    >
                      <DropZone accept="image/*" onDrop={handleLogoDrop} allowMultiple={false}>
                        <div
                          style={{
                            display: "inline-flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "8px", // Optional for spacing
                            borderRadius: "8px",
                            backgroundColor: "#f4f6f8",
                          }}
                        >
                          {logoUrl ? (
                            <LegacyStack vertical spacing="tight" align="center">
                              <Thumbnail size="large" alt="Logo Image" source={logoUrl} />
                            </LegacyStack>
                          ) : (
                            <DropZone.FileUpload />
                          )}
                        </div>
                      </DropZone>
                    </div>
                  </div>
                  {<p>{uploadLogoStatus}</p>}
                  {logoUrl && (
                    <button
                      onClick={() => {
                        handleLogoDelete(shopId);
                      }}
                      style={{
                        backgroundColor: "#bf0711", // Optional: background for contrast
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <RiDeleteBinLine size={17} color="white" />
                      <span style={{ color: "white", fontWeight: "bold" }}>Remove</span>
                    </button>
                  )}
                </div>

                {/* Signature Image Upload */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <label style={{ fontWeight: "bold" }}>Signature</label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        // width: 114,
                        // height: 114,
                        borderRadius: "8px",
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f4f6f8",
                      }}
                    >
                      <DropZone accept="image/*" onDrop={handleSignatureDrop} allowMultiple={false}>
                        <div
                          style={{
                            display: "inline-flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "8px", // Optional for spacing
                            borderRadius: "8px",
                            backgroundColor: "#f4f6f8",
                          }}
                        >
                          {signatureUrl ? (
                            <LegacyStack vertical spacing="tight" align="center">
                              <Thumbnail size="large" alt="Signature Image" source={signatureUrl} />
                            </LegacyStack>
                          ) : (
                            <DropZone.FileUpload />
                          )}
                        </div>
                      </DropZone>
                    </div>
                  </div>
                  {<p>{uploadSignatureStatus}</p>}
                  {signatureUrl && (
                    <button
                      onClick={() => {
                        handleSignatureDelete(shopId);
                      }}
                      style={{
                        backgroundColor: "#bf0711", // Optional: background for contrast
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <RiDeleteBinLine size={17} color="white" />
                      <span style={{ color: "white", fontWeight: "bold" }}>Remove</span>
                    </button>
                  )}
                </div>
              </FormLayout.Group>

              <TextField
                label="Invoice Prefix"
                placeholder="e.g., INV-"
                value={storeProfile.invoicePrefix}
                onChange={(value) => setStoreProfile({ ...storeProfile, invoicePrefix: value })}
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
                placeholder="Enter initial invoice number"
              />
            </FormLayout>
          </AlphaCard>
        )}

        {selected === 2 && (
          <AlphaCard padding="5">
            <h2 style={sectionTitleStyle}>Address Information</h2>
            <FormLayout>
              <TextField
                label="Street Address"
                placeholder="Enter street address"
                value={addresses.address}
                onChange={(value) => setAddresses({ ...addresses, address: value })}
              />
              <FormLayout.Group>
                <TextField
                  label="Apartment/Suite"
                  placeholder="e.g., Apt 101"
                  value={addresses.apartment}
                  onChange={(value) => setAddresses({ ...addresses, apartment: value })}
                />
                <TextField
                  label="City"
                  placeholder="Enter city"
                  value={addresses.city}
                  onChange={(value) => setAddresses({ ...addresses, city: value })}
                />
              </FormLayout.Group>
              <FormLayout.Group>
                <TextField
                  label="Postal Code"
                  placeholder="Enter postal code"
                  value={addresses.postalCode}
                  onChange={(value) => setAddresses({ ...addresses, postalCode: value })}
                />
                <TextField
                  label="Country"
                  placeholder="Enter country"
                  value={addresses.country}
                  onChange={(value) => setAddresses({ ...addresses, country: value })}
                />
              </FormLayout.Group>
            </FormLayout>
          </AlphaCard>
        )}

        {selected === 3 && (
          <AlphaCard padding="5">
            <h2 style={sectionTitleStyle}>Social Media Links</h2>
            <FormLayout>
              <TextField
                label="Facebook URL"
                placeholder="Enter Facebook URL"
                value={socialLinks.facebookURL}
                onChange={(value) => setSocialLinks({ ...socialLinks, facebookURL: value })}
              />
              <TextField
                label="Twitter/X URL"
                placeholder="Enter Twitter/X URL"
                value={socialLinks.xURL}
                onChange={(value) => setSocialLinks({ ...socialLinks, xURL: value })}
              />
              <TextField
                label="Instagram URL"
                placeholder="Enter Instagram URL"
                value={socialLinks.instagramURL}
                onChange={(value) => setSocialLinks({ ...socialLinks, instagramURL: value })}
              />
              <TextField
                label="Pinterest URL"
                placeholder="Enter Pinterest URL"
                value={socialLinks.pinterestURL}
                onChange={(value) => setSocialLinks({ ...socialLinks, pinterestURL: value })}
              />
              <TextField
                label="YouTube URL"
                placeholder="Enter YouTube URL"
                value={socialLinks.youtubeURL}
                onChange={(value) => setSocialLinks({ ...socialLinks, youtubeURL: value })}
              />
            </FormLayout>
          </AlphaCard>
        )}

        <div style={footerButtonStyle}>
          <LegacyStack distribution="trailing">
            <Button primary onClick={handleSave} loading={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"} {/* Optional: changing text */}
            </Button>
          </LegacyStack>
        </div>
      </div>
    </Page>
  );
}

const sectionTitleStyle = {
  fontWeight: "600",
  fontSize: "20px",
  marginBottom: "16px",
};

const footerButtonStyle = {
  marginTop: "32px",
  textAlign: "right",
};

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

// import {
//   // Layout,
//   // Page,
//   AlphaCard,
//   Tabs,
//   Button,
//   TextField,
// } from "@shopify/polaris";
// import { TitleBar } from "@shopify/app-bridge-react";
// import { useEffect, useState, useCallback } from "react";

// export default function Settings() {
//   const [selected, setSelected] = useState(0);
//   const [storeDomain, setStoreDomain] = useState("");
//   const [email, setEmail] = useState("");
//   const [shopId, setshopId] = useState("")
//   const [showToast, setShowToast] = useState({
//       active: false,
//       message: "",
//       error: false,
//     });
//   const [storeProfile, setStoreProfile] = useState({
//     firstName: "",
//     lastName: "",
//     brandColor: "#000000",
//     invoiceNumber: 1001,
//     invoicePrefix: "INV-25-26",
//     brandName: "",
//     phone: "",
//     storeEmail: "",
//     websiteURL: "",
//     gstNumber: "",
//   });
//   const [images, setImages] = useState({
//     logoURL: "",
//     signatureURL: "",
//   });
//   const [addresses, setAddresses] = useState({
//     address: "",
//     apartment: "",
//     city: "",
//     postalCode: "",
//     country: "",
//   });
//   const [socialLinks, setSocialLinks] = useState({
//     facebookURL: "",
//     xURL: "",
//     instagramURL: "",
//     pinterestURL: "",
//     youtubeURL: "",
//   });

//   const tabs = [
//     { id: "Company-details-1", content: "Company Details" },
//     { id: "Logo-And-Signature-1", content: "Logo And Signature" },
//     { id: "Addresses-1", content: "Address" },
//     { id: "Social-1", content: "Social Links" },
//   ];

//   const handleTabChange = useCallback(
//     (selectedTabIndex) => setSelected(selectedTabIndex),
//     []
//   );

//   const handleShowToast = (message, error = false) => {
//     setShowToast({ active: true, message, error });
//   };
//   // Fetch initial data for store domain and email
//   useEffect(() => {
//     fetch("/api/2024-10/shop.json", {
//       method: "GET",
//       headers: { "Content-Type": "application/json" },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         const shopInfo = data?.data?.data?.[0];
//         console.log("Shop info:", shopInfo);
//         setStoreDomain(shopInfo.domain || "");
//         setEmail(shopInfo.email || "");
//         setshopId(shopInfo.id || "")
//         console.log("Store domain:", storeDomain);
//         console.log("Email:", email);
//       })
//       .catch((error) => console.log("Error fetching shop info:", error));
//   }, []);

//   const handleSave = async () => {
//     try {
//       const requestData = {
//         shopId,
//         storeProfile,
//         images,
//         addresses,
//         socialLinks,
//       };

//       const response = await fetch("/api/update-store-data", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestData), // Properly serialize the body
//       });

//       if (response.ok) {
//         const responseData = await response.json();
//         console.log("Settings saved successfully:", responseData);
//       } else {
//         const errorData = await response.json();
//         console.error("Failed to save settings:", errorData);
//       }
//     } catch (error) {
//       console.error("Error while saving settings:", error);
//     }
//   };

//   return (
//     <Page>
//       <TitleBar title="Settings" />
//       <AlphaCard>
//         <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
//           {selected === 0 && (
//             <div>
//               <TextField
//                 label="First Name"
//                 value={storeProfile.firstName}
//                 onChange={(value) =>
//                   setStoreProfile({ ...storeProfile, firstName: value })
//                 }
//               />
//               <TextField
//                 label="Last Name"
//                 value={storeProfile.lastName}
//                 onChange={(value) =>
//                   setStoreProfile({ ...storeProfile, lastName: value })
//                 }
//               />
//               <TextField
//                 label="Brand Color"
//                 value={storeProfile.brandColor}
//                 onChange={(value) =>
//                   setStoreProfile({ ...storeProfile, brandColor: value })
//                 }
//               />
//               <TextField
//                 label="Invoice Number"
//                 value={storeProfile.invoiceNumber}
//                 type="number"
//                 onChange={(value) =>
//                   setStoreProfile({
//                     ...storeProfile,
//                     invoiceNumber: Number(value),
//                   })
//                 }
//               />
//               <TextField
//                 label="Invoice Prefix"
//                 value={storeProfile.invoicePrefix}
//                 onChange={(value) =>
//                   setStoreProfile({ ...storeProfile, invoicePrefix: value })
//                 }
//               />
//               <TextField
//                 label="Brand Name"
//                 value={storeProfile.brandName}
//                 onChange={(value) =>
//                   setStoreProfile({ ...storeProfile, brandName: value })
//                 }
//               />
//               <TextField
//                 label="Phone"
//                 value={storeProfile.phone}
//                 onChange={(value) =>
//                   setStoreProfile({ ...storeProfile, phone: value })
//                 }
//               />
//               <TextField
//                 label="Store Email"
//                 value={storeProfile.storeEmail}
//                 onChange={(value) =>
//                   setStoreProfile({ ...storeProfile, storeEmail: value })
//                 }
//               />
//               <TextField
//                 label="Website URL"
//                 value={storeProfile.websiteURL}
//                 onChange={(value) =>
//                   setStoreProfile({ ...storeProfile, websiteURL: value })
//                 }
//               />
//               <TextField
//                 label="GST Number"
//                 value={storeProfile.gstNumber}
//                 onChange={(value) =>
//                   setStoreProfile({ ...storeProfile, gstNumber: value })
//                 }
//               />
//             </div>
//           )}
//           {selected === 1 && (
//             <div>
//               <TextField
//                 label="Logo URL"
//                 value={images.logoURL}
//                 onChange={(value) =>
//                   setImages({ ...images, logoURL: value })
//                 }
//               />
//               <TextField
//                 label="Signature URL"
//                 value={images.signatureURL}
//                 onChange={(value) =>
//                   setImages({ ...images, signatureURL: value })
//                 }
//               />
//             </div>
//           )}
//           {selected === 2 && (
//             <div>
//               <TextField
//                 label="Address"
//                 value={addresses.address}
//                 onChange={(value) =>
//                   setAddresses({ ...addresses, address: value })
//                 }
//               />
//               <TextField
//                 label="Apartment"
//                 value={addresses.apartment}
//                 onChange={(value) =>
//                   setAddresses({ ...addresses, apartment: value })
//                 }
//               />
//               <TextField
//                 label="City"
//                 value={addresses.city}
//                 onChange={(value) =>
//                   setAddresses({ ...addresses, city: value })
//                 }
//               />
//               <TextField
//                 label="Postal Code"
//                 value={addresses.postalCode}
//                 onChange={(value) =>
//                   setAddresses({ ...addresses, postalCode: value })
//                 }
//               />
//               <TextField
//                 label="Country"
//                 value={addresses.country}
//                 onChange={(value) =>
//                   setAddresses({ ...addresses, country: value })
//                 }
//               />
//             </div>
//           )}
//           {selected === 3 && (
//             <div>
//               <TextField
//                 label="Facebook URL"
//                 value={socialLinks.facebookURL}
//                 onChange={(value) =>
//                   setSocialLinks({ ...socialLinks, facebookURL: value })
//                 }
//               />
//               <TextField
//                 label="Twitter URL"
//                 value={socialLinks.xURL}
//                 onChange={(value) =>
//                   setSocialLinks({ ...socialLinks, xURL: value })
//                 }
//               />
//               <TextField
//                 label="Instagram URL"
//                 value={socialLinks.instagramURL}
//                 onChange={(value) =>
//                   setSocialLinks({ ...socialLinks, instagramURL: value })
//                 }
//               />
//               <TextField
//                 label="Pinterest URL"
//                 value={socialLinks.pinterestURL}
//                 onChange={(value) =>
//                   setSocialLinks({ ...socialLinks, pinterestURL: value })
//                 }
//               />
//               <TextField
//                 label="YouTube URL"
//                 value={socialLinks.youtubeURL}
//                 onChange={(value) =>
//                   setSocialLinks({ ...socialLinks, youtubeURL: value })
//                 }
//               />
//             </div>
//           )}
//         </Tabs>
//         <div style={{ marginTop: "20px", textAlign: "right" }}>
//           <Button primary onClick={handleSave}>
//             Save
//           </Button>
//         </div>
//       </AlphaCard>
//     </Page>
//   );
// }
