import {
  Layout,
  Page,
  AlphaCard,
  Tabs,
  Button,
  Badge,
  FormLayout,
  LegacyStack,
  TextField,
  DropZone,
  Thumbnail,
  Banner,
  Checkbox
 } from "@shopify/polaris";
 import ToastNotification from "../components/ToastNotification";
 
 
 
 
 import { RiDeleteBinLine } from "react-icons/ri"; // FontAwesome
 import { Collapsible, HorizontalStack, VerticalStack, Icon } from "@shopify/polaris";
 import { TbReceiptTax } from "react-icons/tb";
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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  // const [showToast, setShowToast] = useState({
  //   active: false,
  //   message: "",
  //   error: false,
  // });
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
  const [isEnabledByAppTax, setIsEnabledByAppTax] = useState(false);
  const [isTaxIncluded, setIsTaxIncluded] = useState(false);
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
    { id: "Taxation-1", content: "Taxation" },
  ];
 
 
  const [file, setFile] = useState(null); // Store the selected image file
 
 
  // Handle file drop
  const handleDrop = useCallback((_dropFiles, acceptedFiles, _rejectedFiles) => {
    setFile(acceptedFiles[0]); // Only take the first accepted file
  }, []);
 
 
  const handleTabChange = useCallback((selectedTabIndex) => setSelected(selectedTabIndex), []);
 
 
  const handleTabChange1 = useCallback((newIndex) => {
    if (newIndex >= 0 && newIndex < tabs.length) {
      setSelected(newIndex);
    }
  }, [tabs]);
 
 
  const handleLogoDrop = useCallback((_dropFiles, acceptedFiles) => {
    setLogoFile(URL.createObjectURL(acceptedFiles[0]));
    if (acceptedFiles[0]) {
      handleLogoUpload(acceptedFiles[0]);
      // console.log("acceptedFiles[0]", acceptedFiles[0]);
    }
  }, []);
 
 
  const handleSignatureDrop = useCallback((_dropFiles, acceptedFiles) => {
    setSignatureFile(URL.createObjectURL(acceptedFiles[0]));
    if (acceptedFiles[0]) {
      handleSignatureUpload(acceptedFiles[0]);
      // console.log("acceptedFiles[0]", acceptedFiles[0]);
    }
  }, []);
 
 
  // const handleShowToast = (message, error = false) => {
  //   setShowToast({ active: true, message, error });
  // };
  //   // Fetch initial data for store domain and email
 
 
  const updateToggleSettingbyApp = async (shopId, taxChangeRequest) => {
    try {
      // console.log("shopId:", shopId);
      // console.log("sendByAppEmail:", sendByAppEmail);
      if (!shopId) {
        console.error("Missing shopId.");
        throw new Error("Invalid shopId.");
      }
     
      const response = await fetch(`/api/update-tax-settings?storeDomain=${storeDomain}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          taxChangeRequest
        })
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch settings. Status: ${response.status}`);
      }
      const data = await response.json();
      // console.log("fetchToggleSetting:", data);
     setIsEnabledByAppTax(data.updatedConfig.isAppTax);
     setShowToast(true);
     if(data.updatedConfig.isAppTax){
      setToastMessage('App tax has been configured.');
     }else{
      setToastMessage('App tax has been disabled.');
     }
   
    } catch (error) {
      console.error("Error while fetching settings:", error);
    }
  };
 
 
  const handleButtonByAppToggle = () => {
    setIsEnabledByAppTax((prev) => !prev);
    if(isEnabledByAppTax){
      updateToggleSettingbyApp(shopId, !isEnabledByAppTax);
    }else{
      updateToggleSettingbyApp(shopId, !isEnabledByAppTax);
    }
   
  };
 
 
  useEffect(() => {
    setTimeout(() => {
      if (showToast) {
        setShowToast(false);
      }
    }, 3000);
  }, [showToast]);
 
 
  useEffect(() => {
    fetch("/api/2024-10/shop.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        const shopInfo = data?.data?.data?.[0];
        // console.log("Shop info:", shopInfo);
        setStoreDomain(shopInfo.domain || "");
        setEmail(shopInfo.email || "");
        setshopId(shopInfo.id || "");
        // console.log("Store domain:", storeDomain);
        // console.log("Email:", email);
        // console.log("ShopID:", shopId);
      })
      .catch((error) => console.log("Error fetching shop info:", error));
  }, []);
 
 
  useEffect(() => {
    if(shopId){
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
          setIsEnabledByAppTax(profileData.taxes.isAppTax || false);
          setIsTaxIncluded(profileData.taxes.tax_includedOnProduct || false);
          // console.log("Shop Profile Data", profileData);
          // console.log("Logo URL:", logoFile);
        }
      })
      .catch((error) => {
        console.error("Error fetching store profile:", error);
      });}
  }, [shopId]);
 
 
  useEffect(() => {
    // console.log("logoUrl:", logoUrl);
    // console.log("signatureUrl:", signatureUrl);
    // console.log("images", images);
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
        // console.log("Settings saved successfully:", responseData);
        setIsSaving(false);
        setShowToast(true);
        setToastMessage("Settings saved successfully!");
      } else {
        const errorData = await response.json();
        console.error(":", errorData);
        setIsSaving(false);
        setShowToast(true);
        setToastMessage("Failed to save settings!");
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
      // console.log("data", data);
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
    // console.log("Deleting logo with URL:", shopId);
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
      // console.log(data);
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
      // console.log("data", data);
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
    // console.log("Signature with URL:", shopId);
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
      // console.log(data);
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
 
 
  // const handleTaxIncludedChange = useCallback(
  //   (newChecked) => setIsTaxIncluded(newChecked),
  //   [],
  // );
 
 
  const handleTaxIncludedChange = () => {
    setIsTaxIncluded((prev) => !prev);
    if(isTaxIncluded){
      updateCheckTaxIncluded(shopId, !isTaxIncluded);
    }else{
      updateCheckTaxIncluded(shopId, !isTaxIncluded);
    }
   
  };
 
 
  const updateCheckTaxIncluded = async (shopId, taxIncludedRequest) => {
    try {
      // console.log("shopId:", shopId);
      // console.log("sendByAppEmail:", sendByAppEmail);
      if (!shopId) {
        console.error("Missing shopId.");
        throw new Error("Invalid shopId.");
      }
     
      const response = await fetch(`/api/update-tax-included?storeDomain=${storeDomain}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          taxIncludedRequest
        })
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch settings. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("fetchToggleSetting:", data);
      setIsTaxIncluded(data.updatedConfig.tax_includedOnProduct);
     setShowToast(true);
     if(data.updatedConfig.tax_includedOnProduct){
      setToastMessage('Taxes will be included in product price.');
     }else{
      setToastMessage('Taxes will be excluded from product price.');
     }
   
    } catch (error) {
      console.error("Error while fetching settings:", error);
    }
  };
 
 
 
 
  return (
    <Page>
      <TitleBar title="Settings" />
    
 
 
    {/* <Layout>
    <Layout.Section>
 <Banner title="Under maintenance" status="warning">
 
 
 <p>
                    {" "}
                    Due to ongoing maintenance, some features may be
                    experiencing temporary issues. <strong>
                      Logo upload
                    </strong>, <strong>Signature upload</strong>, and{" "}
                    <strong>Invoice send through email</strong> are currently not working. We
                    appreciate your patience and assure you that everything will
                    be resolved shortly. Thank you for bearing with us.{" "}
                  </p>    </Banner></Layout.Section>
    </Layout> */}
 
 
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
        {selected === 4 && (
          <div style={{marginTop: '20px', padding: '20px',}}>
         
 
 
 
 
         
          <AlphaCard>
            <VerticalStack gap="0">
              <div style={styles.headerContainer}>
                <div style={styles.titleSection}>
                  <TbReceiptTax style={{height: '20px', width:'20px'}}/>
                  <h2 style={styles.titleText}>App Tax Rates</h2>
                </div>
                <LegacyStack alignment="center" spacing="tight">
                  <Badge status={isEnabledByAppTax ? "success" : "critical"}>
                    {isEnabledByAppTax ? "Enabled" : "Disabled"}
                  </Badge>
                  <div onClick={handleButtonByAppToggle} style={styles.toggleWrapper}>
                    <div
                      style={{
                        ...styles.toggleCircle,
                        ...(isEnabledByAppTax ? styles.on : styles.off),
                      }}
                    ></div>
                  </div>
                </LegacyStack>
              </div>
  
  
  
  
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: '20px' }}>
               
                <p style={{ color: isEnabledByAppTax ? "black" : "gray" }}>
                By default, app will take tax rates from shopify. If you want to use custom tax rates from app then enable this. Assumes you have set 12% tax rate for product in the app, then the invoice will have that tax rate included in the total amount.
                </p>
              </div>
            </VerticalStack>
 
 
            {/* <div  style={{ display: "flex",  alignItems: "start", marginTop: '20px' }}>
            <Checkbox
      // label="Include sales tax in product price and shipping rate"
      checked={isTaxIncluded}
      disabled={!isEnabledByAppTax}
      onChange={handleTaxIncludedChange}
    />
    <div style={{ justifyContent: "space-between", alignItems: "start", marginTop: '3px' }}>
    <p style={{ color: isEnabledByAppTax ? "black" : "gray"  }}>
    Include sales tax in product price and shipping rate
                </p>
                <p style={{ color:  isEnabledByAppTax ? "gray" : "#d1d5db" }}>
                Assumes a 18% tax rate, which is adjusted to local tax rates in markets</p>
                </div>
              </div> */}
          </AlphaCard>
        </div>
 
 
       
        )}
 {showToast && (
                  <div
                    style={{
                      position: "fixed",
                      bottom: "20px",
                      right: "20px",
                      zIndex: 9999,
                    }}
                  >
                    <ToastNotification message={toastMessage} duration={3000} />
                  </div>
                )}
        <div style={footerButtonStyle}>
          <LegacyStack distribution="trailing">
          <Button disabled={selected === 0} onClick={() => handleTabChange(selected - 1)}>
          Previous
        </Button>
        <Button disabled={selected === tabs.length - 1} onClick={() => handleTabChange(selected + 1)}>
          Next
        </Button>
            <Button primary onClick={handleSave} loading={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"} {/* Optional: changing text */}
            </Button>
           
          </LegacyStack>
          {/* Navigation Buttons */}
     
        </div>
       
      </div>
    </Page>
  );
 }
 
 
 const styles = {
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "0px",
  },
  titleSection: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
  titleText: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
  },
  collapsibleContainer: {
    padding: "12px",
    backgroundColor: "#f4f6f8",
    borderRadius: "8px",
    cursor: "pointer",
  },
  collapsibleHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "4px",
  },
  toggleWrapper: {
    width: "40px",
    height: "20px",
    borderRadius: "5px",
    backgroundColor: "#333", // Off background
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "2px",
    transition: "background-color 0.3s ease-in-out",
  },
  toggleCircle: {
    width: "16px",
    height: "16px",
    borderRadius: "20%",
    backgroundColor: "#fff",
    transition: "transform 0.3s ease-in-out",
  },
  on: {
    backgroundColor: "#0f0f0f0", // Green when enabled
    transform: "translateX(20px)",
  },
  off: {
    backgroundColor: "#f0f0f0", // Light gray background for off
    transform: "translateX(0px)",
  },
 };
 
 
 const sectionTitleStyle = {
  fontWeight: "600",
  fontSize: "20px",
  marginBottom: "16px",
 };
 
 
 const footerButtonStyle = {
  marginTop: "32px",
  textAlign: "right",
 };
 
 
 
 
 
 