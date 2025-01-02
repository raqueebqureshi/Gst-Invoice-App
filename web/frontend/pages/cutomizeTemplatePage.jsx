import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Icon,
  AlphaCard,
  Popover,
  ActionList,
  RangeSlider,
  Checkbox,
  Select,
  TextField,
} from "@shopify/polaris";
import {
  ImageMajor,
  HomeMajor,
  StoreMajor,
  OrdersMajor,
  ChecklistMajor,
  TextMajor,
  TaxMajor,
  FooterMajor,
  ArrowLeftMinor,
} from "@shopify/polaris-icons";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { InvoiceTemplate1 } from "../invoiceTemplates/invoice-template1";
import { InvoiceTemplate2 } from "../invoiceTemplates/invoice-template2";
import { InvoiceTemplate3 } from "../invoiceTemplates/invoice-template3";

export default function CustomizeTemplate() {


    const demoOrder = [
        {
            "line_items": [
              {
                "id": 14721915060453,
                "admin_graphql_api_id": "gid://shopify/LineItem/14721915060453",
                "attributed_staffs": [],
                "current_quantity": 1,
                "fulfillable_quantity": 1,
                "fulfillment_service": "manual",
                "fulfillment_status": null,
                "gift_card": false,
                "grams": 5000,
                "name": "Demo Product - Powder",
                "price": "500.00",
                "price_set": {
                  "shop_money": {
                    "amount": "500.00",
                    "currency_code": "INR"
                  },
                  "presentment_money": {
                    "amount": "500.00",
                    "currency_code": "INR"
                  }
                },
                "product_exists": true,
                "product_id": 123456789,
                "properties": [],
                "quantity": 1,
                "requires_shipping": true,
                "sku": "DEMO-SKU",
                "taxable": true,
                "title": "Demo Product",
                "total_discount": "0.00",
                "total_discount_set": {
                  "shop_money": {
                    "amount": "0.00",
                    "currency_code": "USD"
                  },
                  "presentment_money": {
                    "amount": "0.00",
                    "currency_code": "USD"
                  }
                },
                "variant_id": 987654321,
                "variant_inventory_management": "shopify",
                "variant_title": "Powder",
                "vendor": "Demo Vendor",
                "tax_lines": [],
                "duties": [],
                "discount_allocations": []
              }
            ],
            "app_id": 123456,
            "billing_address": {
              "first_name": "John",
              "address1": "123 Demo Street",
              "phone": "+1234567890",
              "city": "Demo City",
              "zip": "12345",
              "province": "Demo Province",
              "country": "Demo Country",
              "last_name": "Doe",
              "address2": null,
              "company": "Demo Company",
              "latitude": 45.4191773,
              "longitude": -75.6967303,
              "name": "John Doe",
              "country_code": "DC",
              "province_code": "DP"
            },
            "browser_ip": "192.168.1.1",
            "buyer_accepts_marketing": false,
            "cancel_reason": null,
            "cancelled_at": null,
            "cart_token": null,
            "checkout_token": "demo-checkout-token",
            "client_details": {
              "accept_language": "en-US",
              "browser_height": 1080,
              "browser_ip": "192.168.1.1",
              "browser_width": 1920,
              "session_hash": null,
              "user_agent": "Mozilla/5.0"
            },
            "closed_at": null,
            "company": null,
            "confirmation_number": "DEMO123",
            "created_at": "2024-01-01T00:00:00-00:00",
            "currency": "USD",
            "current_subtotal_price": "500.00",
            "current_subtotal_price_set": {
              "shop_money": {
                "amount": "500.00",
                "currency_code": "USD"
              },
              "presentment_money": {
                "amount": "500.00",
                "currency_code": "USD"
              }
            },
            "current_total_additional_fees_set": null,
            "current_total_discounts": "0.00",
            "current_total_discounts_set": {
              "shop_money": {
                "amount": "0.00",
                "currency_code": "USD"
              },
              "presentment_money": {
                "amount": "0.00",
                "currency_code": "USD"
              }
            },
            "current_total_duties_set": null,
            "current_total_price": "500.00",
            "current_total_price_set": {
              "shop_money": {
                "amount": "500.00",
                "currency_code": "USD"
              },
              "presentment_money": {
                "amount": "500.00",
                "currency_code": "USD"
              }
            },
            "current_total_tax": "0.00",
            "current_total_tax_set": {
              "shop_money": {
                "amount": "0.00",
                "currency_code": "USD"
              },
              "presentment_money": {
                "amount": "0.00",
                "currency_code": "USD"
              }
            },
            "customer": {
              "created_at": "2024-01-01T00:00:00-00:00",
              "currency": "USD",
              "email": "john.doe@example.com",
              "email_marketing_consent": {
                "state": "subscribed",
                "opt_in_level": "single_opt_in",
                "consent_updated_at": null
              },
              "first_name": "John",
              "id": 123456,
              "last_name": "Doe",
              "multipass_identifier": null,
              "note": null,
              "phone": "+1234567890",
              "sms_marketing_consent": {
                "state": "not_subscribed",
                "opt_in_level": "single_opt_in",
                "consent_updated_at": null,
                "consent_collected_from": "OTHER"
              },
              "state": "disabled",
              "tags": "",
              "tax_exempt": false,
              "tax_exemptions": [],
              "updated_at": "2024-01-01T00:00:00-00:00",
              "verified_email": true,
              "admin_graphql_api_id": "gid://shopify/Customer/123456"
            },
            "customer_locale": "en",
            "discount_applications": [],
            "discount_codes": [],
            "email": "john.doe@example.com",
            "estimated_taxes": false,
            "financial_status": "paid",
            "fulfillment_status": null,
            "fulfillments": [],
            "id": 1234567890,
            "landing_site": null,
            "location_id": null,
            "merchant_of_record_app_id": null,
            "name": "#1234",
            "note": null,
            "note_attributes": [],
            "number": 1234,
            "order_number": 1234,
            "order_status_url": "https://example.com/order/1234",
            "original_total_additional_fees_set": null,
            "original_total_duties_set": null,
            "payment_gateway_names": ["manual"],
            "payment_terms": null,
            "phone": "+1234567890",
            "po_number": null,
            "presentment_currency": "USD",
            "processed_at": "2024-01-01T00:00:00-00:00",
            "referring_site": null,
            "refunds": [],
            "shipping_address": {
              "first_name": "John",
              "address1": "456 Demo Lane",
              "phone": "+1234567890",
              "city": "Demo City",
              "zip": "67890",
              "province": "Demo Province",
              "country": "Demo Country",
              "last_name": "Doe",
              "address2": null,
              "company": "Demo Shipping Co",
              "latitude": 45.4191773,
              "longitude": -75.6967303,
              "name": "John Doe",
              "country_code": "DC",
              "province_code": "DP"
            },
            "shipping_lines": [],
            "source_identifier": "demo-source",
            "source_name": "shopify_draft_order",
            "source_url": null,
            "subtotal_price": "500.00",
            "subtotal_price_set": {
              "shop_money": {
                "amount": "500.00",
                "currency_code": "USD"
              },
              "presentment_money": {
                "amount": "500.00",
                "currency_code": "USD"
              }
            },
            "tags": "",
            "tax_lines": [],
            "taxes_included": false,
            "test": false,
            "token": "demo-token",
            "total_discounts": "0.00",
            "total_discounts_set": {
              "shop_money": {
                "amount": "0.00",
                "currency_code": "USD"
              },
              "presentment_money": {
                "amount": "0.00",
                "currency_code": "USD"
              }
            },
            "total_line_items_price": "500.00",
            "total_line_items_price_set": {
              "shop_money": {
                "amount": "500.00",
                "currency_code": "USD"
              },
              "presentment_money": {
                "amount": "500.00",
                "currency_code": "USD"
              }
            },
            "total_outstanding": "0.00",
            "total_price": "500.00",
            "total_price_set": {
              "shop_money": {
                "amount": "500.00",
                "currency_code": "USD"
              },
              "presentment_money": {
                "amount": "500.00",
                "currency_code": "USD"
              }
            },
            "total_shipping_price_set": {
              "shop_money": {
                "amount": "0.00",
                "currency_code": "USD"
              },
              "presentment_money": {
                "amount": "0.00",
                "currency_code": "USD"
              }
            },
            "total_tax": "0.00",
            "total_tax_set": {
              "shop_money": {
                "amount": "0.00",
                "currency_code": "USD"
              },
              "presentment_money": {
                "amount": "0.00",
                "currency_code": "USD"
              }
            },
            "total_tip_received": "0.00",
            "total_weight": 5000,
            "updated_at": "2024-01-01T00:00:00-00:00",
            "user_id": 123456,
            "admin_graphql_api_id": "gid://shopify/Order/1234567890",
            "checkout_id": 987654321,
            "confirmed": true,
            "contact_email": "john.doe@example.com",
            "device_id": null,
            "landing_site_ref": null,
            "reference": "demo-reference",
            "tax_exempt": false
          }
          
      ];
  const styles = {
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px",
      borderBottom: "1px solid #dcdcde",
      backgroundColor: "#f6f6f7",
    },
    titleSection: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "16px",
      fontWeight: "600",
    },
    buttonSection: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    container: {
      display: "grid",
      gridTemplateColumns: "1fr 2fr",
      gap: "20px",
      padding: "20px",
      backgroundColor: "#f6f6f7",
    },
    alphaCardCustomize: {
      borderRadius: "12px",
      padding: "20px",
      height: "fit-content",
      backgroundColor: "#ffffff",
    },
    alphaCardPreview: {
      borderRadius: "12px",
      padding: "20px",
      backgroundColor: "#ffffff",
    },
    sidebarTitle: {
      display: "grid",
      gridTemplateColumns: "1fr 6fr",
      fontSize: "16px",
      fontWeight: "600",
      paddingLeft: "0px",
      marginBottom: "20px",
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 1px",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.2s",
      fontSize: "14px",
      fontWeight: "500",
    },
    menuItemHover: {
      backgroundColor: "#f1f3f5",
    },
    menuText: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },

    previewContainer: {
      width: "100%",
    //   height: demoOrder  ? "auto" : "600px",
      border: "1px solid #dcdcde",
      borderRadius: "8px",
      overflow: "hidden",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#f9fafb",
    },
    button: {
      width: "120px",
      textAlign: "center",
    },
    colorOption: {
      display: "flex",
      alignItems: "center",
      padding: "10px",
      cursor: "pointer",
      borderRadius: "8px",
      transition: "background-color 0.3s",
    },
    colorOptionSelected: {
      backgroundColor: "#f1f3f5",
    },
    colorCircle: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      marginRight: "10px",
    },
    colorLabel: {
      fontSize: "14px",
      fontWeight: "500",
    },
    dropdownContainer: {
      position: "relative",
      marginTop: "10px",
    },
    dropdownButton: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px",
      border: "1px solid #dcdcde",
      borderRadius: "10px",
      cursor: "pointer",
      backgroundColor: "#ffffff",
    },
    dropdownList: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: "#ffffff",
      border: "1px solid #dcdcde",
      borderRadius: "10px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      zIndex: 10,
      maxHeight: "200px",
      overflowY: "auto",
    },
    dropdownItem: {
      padding: "10px",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    dropdownItemHover: {
      backgroundColor: "#f6f6f7",
    },
    dropdownItemSelected: {
      fontWeight: "bold",
    },
    // sidebarTitle: {
    //     display: "flex",
    //     alignItems: "center",
    //     gap: "10px",
    //     fontSize: "16px",
    //     fontWeight: "600",
    //     marginBottom: "20px",
    //   },
    //   menuItem: {
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "space-between",
    //     padding: "10px 15px",
    //     borderRadius: "5px",
    //     cursor: "pointer",
    //     transition: "background-color 0.2s",
    //     fontSize: "14px",
    //     fontWeight: "500",
    //   },
    //   menuItemHover: {
    //     backgroundColor: "#f1f3f5",
    //   },
    //   menuText: {
    //     display: "flex",
    //     alignItems: "center",
    //     gap: "10px",
    //   },
    sectionTitle: {
      fontWeight: "bold",
      margin: "20px 0 10px",
    },
  };
  const [primaryColor, setPrimaryColor] = useState("Black");
  const [popoverActive, setPopoverActive] = useState(false);
  const [showBrandingAndStyle, setShowBrandingAndStyle] = useState(false);
  const [logoSize, setLogoSize] = useState(50);
  const [fontSize, setFontSize] = useState(14);
  const navigate = useNavigate(); // Initialize useNavigate
  const [selectedFont, setSelectedFont] = useState("Roboto");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [storeDomain, setStoreDomain] = useState(null);
  const [email, setEmail] = useState(null);
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const [orders, setOrders] = useState([]);
  const location = useLocation();
  const { state } = location;
  const [shopDetails, setShopDetails] = useState([]);
  const { templateId } = state || {};

  console.log("templateId", templateId);

  const handleSupplierCheckboxChange = (key) => {
    setSupplierSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Fetch store details
  useEffect(() => {
    fetch("/api/2024-10/shop.json", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((request) => request.json())
      .then((response) => {
        console.log("Store Details---!", response.data);
        if (response.data.data.length > 0) {
          // console.log("Store Details---", response.data.data[0]);
          setShopDetails(response.data.data[0]);
          if(shopDetails.length > 0){
            console.log('shopDetails',shopDetails);}
            setStoreDomain(shopDetails.domain);
            // console.log(shopDetails.email);
            setEmail(shopDetails.email);
            console.log('storeDomain',storeDomain , 'email',email);
        }
      })
      .catch((error) => console.log(error));
  }, [email, storeDomain]);

  // useEffect(() => {
  //   fetch("/api/2024-10/orders.json", {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   })
  //     .then((request) => request.json())
  //     .then((response) => {
  //       if (response.data) {
  //         setOrders(response.data);
  //         if(orders.length > 0){
  //         console.log('orders',orders);}
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
        
  //       handleShowToast("Internal Server Error 500", true);
  //     });
  // }, []);



  useEffect(() => {
    const fetchInvoiceSettings = async () => {
      const requestBody = {
        email: email , // Replace with actual email
        storeDomain: storeDomain, // Replace with actual storeDomain
      };
  
      try {
        const response = await fetch("/fetch-invoice-settings", {
          method: "POST", // Change to POST
          headers: { "Content-Type": "application/json" },
          body: requestBody , // Send email and storeDomain in body
        });
  
      
  
        const responseData = await response.json();
        console.log("API Response:", responseData);
  
        // Optional: Handle the data as needed
        if (responseData.data) {
          console.log("Fetched Data:", responseData.data);
        }
      } catch (error) {
        console.error("Error fetching invoice settings:", error);
      }
    };
  
    fetchInvoiceSettings();
  }, []);
  

  
  

  const [showOverview, setShowOverview] = useState(false);
  const [documentTitle, setDocumentTitle] = useState("Tax Invoice");
  const [overviewSettings, setOverviewSettings] = useState({
    showOrderId: true,
    showInvoiceNumber: true,
    showOrderIdBarcode: false,
    customizeInvoiceNumber: false,
    issueDate: true,
    showTaxReverseText: false,
    showTrackingCompany: false,
    showTrackingNo: false,
    showTrackingBarcode: false,
    addNote: false,
    showQrCode: false,
    showDeliveryMethod: false,
  });
  const [showShipping, setShowShipping] = useState(false);
  const [showShippingChecked, setShowShippingChecked] = useState(true);
  const [shippingHeading, setShippingHeading] = useState("Ship To");
  const [shippingSettings, setShippingSettings] = useState({
    showHeading: true,
    showFullName: true,
    showAddress1: true,
    showAddress2: true,
    showCompany: true,
    showCity: true,
    showZIPPinCode: true,
    showState: true,
    showCountry: true,
    showEmail: true,
    showPhone: true,
    showGSTIN: true,
  });
  const [showBilling, setShowBilling] = useState(false);
  const [showBillingChecked, setShowBillingChecked] = useState(true);
  const [billingHeading, setBillingHeading] = useState("Billed To");
  const [billingSettings, setBillingSettings] = useState({
    showHeading: true,
    showFullName: true,
    showAddress1: true,
    showAddress2: true,
    showCompany: true,
    showCity: true,
    showZIPPinCode: true,
    showState: true,
    showCountry: true,
    showEmail: true,
    showPhone: true,
    showGSTIN: true,
  });

  const [showTotal, setShowTotal] = useState(false);
  const [tableNote, setTableNote] = useState(
    "Eg. All prices will be calculated in USD"
  );
  const [showSupplier, setShowSupplier] = useState(false);
  const [showSupplierChecked, setShowSupplierChecked] = useState(true);
  const [supplierHeading, setSupplierHeading] = useState("Supplier");
  const [supplierSettings, setSupplierSettings] = useState({
    showHeading: true,
    showBusinessName: true,
    showAddress: true,
    showApartment: false,
    showCity: false,
    showVATNumber: false,
    showRegisteredNumber: false,
    showEmail: true,
    showPhone: true,
    showGSTIN: true,
  });
  const [totalSettings, setTotalSettings] = useState({
    showDiscount: true,
    showSubtotal: true,
    showShipping: true,
    showShippingGSTSplit: true,
    showRefunded: false,
    showTax: true,
    showOutstanding: true,
    showTotal: true,
  });
  const [showAdditionalText, setShowAdditionalText] = useState(false);
  const [additionalTextSettings, setAdditionalTextSettings] = useState({
    showAdditionalText: false,
    showPaymentGateway: false,
  });

  const [showLineItems, setShowLineItems] = useState(false);

  const [lineItemsSettings, setLineItemsSettings] = useState({
    general: {
      checkbox: false,
      productImage: false,
      sku: false,
      variantTitle: true,
      vendor: false,
      quantity: true,
      hsn: false,
      originLocation: false,
      showProperties: false,
    },
    priceAndRate: {
      rateOrUnitPrice: true,
      totalDiscount: false,
      showCompareAtPrice: true,
      rateAsDiscountedPrice: false,
      splitDiscountedRateAndRate: false,
      taxAmount: true,
      totalPrice: true,
    },
    showProductMetafields: false,
    showProductVariantMetafields: false,
    sortBy: "Default",
  });

  const [showFooter, setShowFooter] = useState(false);

  const [footerSettings, setFooterSettings] = useState({
    showNote: false,
    noteHeading: "",
    thankYouNote: "",
    footerNote:
      "This is an electronically generated invoice, no signature is required",
    hideSocialLinks: false,
    socialLinks: {
      Website: true,
      Facebook: true,
      Twitter: true,
      Instagram: true,
      Pinterest: true,
      Youtube: true,
    },
  });

  const handlelineItemCheckboxChange = (
    section,
    key,
    settings,
    setSettings
  ) => {
    setLineItemsSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key],
      },
    }));
  };

  const handleTotalCheckboxChange = (key) => {
    setTotalSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleBillingCheckboxChange = (key) => {
    setBillingSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleShippingCheckboxChange = (key) => {
    setShippingSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCheckboxChange = (key) => {
    setOverviewSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const menuItems2 = [
    {
      label: "Overview",
      onClick: () => setShowOverview(true),
    },
    { label: "Other Options" },
  ];

  const templateStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "300px", // Set desired width for the template
  height: "400px", // Set desired height for the template
  border: "1px solid #ccc", // Optional border for better visibility
  borderRadius: "8px",
  overflow: "hidden", // Ensures content doesn't spill outside the box
  backgroundColor: "#fff",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Optional shadow
  margin: "10px", // Spacing between templates
  position: "relative", // Enables precise positioning of content
  textAlign: "center", // Centers text within the box
};

const renderInvoiceTemplate = (currentTemplate, shopdetails, order) => {
    switch (currentTemplate) {
        case 1:
          return (
            <InvoiceTemplate1 shopdetails={[shopdetails]} orders={[order]} />
          );
        case 2:
          return (
            <InvoiceTemplate2 shopdetails={[shopdetails]} orders={[order]} />
          );
        case 3:
          return (
            <InvoiceTemplate3 shopdetails={[shopdetails]} orders={[order]} />
          );
        default:
          console.error("Invalid template ID:", currentTemplate);
          return null; // Return null if no valid template is found
      }

}
  

  const colorOptions = [
    { label: "Black", value: "Black", color: "#000000" },
    { label: "Purple", value: "Purple", color: "#800080" },
    { label: "Light Green", value: "Light Green", color: "#90ee90" },
    { label: "Dark Blue", value: "Dark Blue", color: "#00008b" },
    { label: "Custom", value: "Custom", color: "#000000" },
  ];

  const menuItems = [
    {
      icon: ImageMajor,
      label: "Branding and Style",
      onClick: () => setShowBrandingAndStyle(true),
    },
    {
      icon: HomeMajor,
      label: "Overview",
      onClick: () => setShowOverview(true),
    },

    {
      icon: StoreMajor,
      label: "Supplier",
      onClick: () => setShowSupplier(true),
    },
    {
      icon: OrdersMajor,
      label: "Shipping",
      onClick: () => setShowShipping(true),
    },
    {
      icon: OrdersMajor,
      label: "Billing",
      onClick: () => setShowBilling(true),
    },
    {
      icon: ChecklistMajor,
      label: "Line items",
      onClick: () => setShowLineItems(true),
    },
    {
      icon: TextMajor,
      label: "Additional text",
      onClick: () => setShowAdditionalText(true),
    },
    { icon: TaxMajor, label: "Total", onClick: () => setShowTotal(true) },
    { icon: FooterMajor, label: "Footer", onClick: () => setShowFooter(true) },
  ];

  const handleColorSelect = (value) => {
    setPrimaryColor(value);
  };

  const fontOptions = [
    {
      label: "Work Sans",
      preview: "Almost before we knew it, we had left the ground.",
    },
    {
      label: "Source Sans Pro",
      preview: "Almost before we knew it, we had left the ground.",
    },
    {
      label: "Roboto",
      preview: "Almost before we knew it, we had left the ground.",
    },
    {
      label: "Poppins",
      preview: "Almost before we knew it, we had left the ground.",
    },
    {
      label: "Open Sans",
      preview: "Almost before we knew it, we had left the ground.",
    },
  ];

  const handleFontSelect = (font) => {
    setSelectedFont(font);
    setShowDropdown(false);
  };

  return (
    <div
      style={{
        paddingLeft: "50px",
        paddingRight: "50px",
        backgroundColor: "#f6f6f7",
        height: "100vh",
      }}
    >
      {" "}
      {/* Added padding */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <div
            style={{
              cursor: "pointer", // Changes the cursor to a pointer
              display: "flex", // Ensures proper alignment
              alignItems: "center",
              justifyContent: "center",
              width: "24px", // Defines a clickable area
              height: "24px",
            }}
            onClick={() => {
              console.log("Back button clicked");
              navigate(-1);
            }}
          >
            <Icon
              source={ArrowLeftMinor}
              color="base" // Optional: Adjust the color for better visibility
              style={{ width: "16px", height: "16px" }}
            />
          </div>
          <span>Customize template</span>
        </div>

        <div style={styles.buttonSection}>
          {/* <Popover
            active={popoverActive}
            activator={
              <Button onClick={togglePopoverActive}>Actions</Button>
            }
            onClose={togglePopoverActive}
          >
            <ActionList
              items={[
                { content: 'Action 1' },
                { content: 'Action 2' },
              ]}
            />
          </Popover> */}
          <Button primary>Save Template</Button>
        </div>
      </div>
      <div style={styles.container}>
        <div>
          <AlphaCard style={styles.alphaCardCustomize}>
            {showBrandingAndStyle ? (
              <div>
                <div style={styles.sidebarTitle}>
                  <div
                    style={{
                      cursor: "pointer", // Ensure the cursor changes to a pointer on hover
                      display: "flex", // Flex for alignment
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px", // Set a clickable area
                      height: "24px",
                    }}
                    onClick={() => {
                      console.log("Back arrow clicked");
                      setShowBrandingAndStyle(false);
                    }}
                  >
                    <Icon
                      source={ArrowLeftMinor}
                      color="base" // Optional: Adjust the color for better visibility
                      style={{ width: "16px", height: "16px" }}
                    />
                  </div>

                  <span>Branding and Style</span>
                </div>
                <div>
                  <Checkbox
                    label="Show logo"
                    checked={showLogo} // Bind the state to the checkbox
                    onChange={(newChecked) => setShowLogo(newChecked)} // Update state on change
                  />
                  <p style={{ margin: "10px 0", fontWeight: "bold" }}>
                    Logo size
                  </p>
                  <RangeSlider
                    min={0}
                    max={100}
                    value={logoSize}
                    onChange={(value) => setLogoSize(value)}
                  />
                  <p style={{ marginTop: "10px" }}>{logoSize}px</p>

                  <p style={{ margin: "10px 0", fontWeight: "bold" }}>
                    Primary color
                  </p>
                  <hr />
                  <div>
                    {colorOptions.map((option) => (
                      <div
                        key={option.value}
                        style={{
                          ...styles.colorOption,
                          ...(primaryColor === option.value
                            ? styles.colorOptionSelected
                            : {}),
                        }}
                        onClick={() => handleColorSelect(option.value)}
                      >
                        <div
                          style={{
                            ...styles.colorCircle,
                            backgroundColor: option.color,
                          }}
                        ></div>
                        <span style={styles.colorLabel}>{option.label}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ margin: "10px 0", fontWeight: "bold" }}>Header</p>

                  <hr />
                  <p style={{ margin: "10px 0" }}>Font Family</p>
                  <div style={styles.dropdownContainer}>
                    <div
                      style={styles.dropdownButton}
                      onClick={() => setShowDropdown((prev) => !prev)}
                    >
                      {selectedFont}
                      <span>▼</span>
                    </div>

                    {showDropdown && (
                      <div
                        style={{
                          ...styles.dropdownList,
                          position: "absolute", // Position it relative to the dropdown button
                          top: "35%", // Open below the dropdown button
                          left: 0, // Align to the left of the button
                          // width: '200px', // Reduce the width of the dropdown

                          zIndex: 1000, // Ensure it appears above other elements
                          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // Add depth
                        }}
                      >
                        {fontOptions.map((font) => (
                          <div
                            key={font.label}
                            style={{
                              ...styles.dropdownItem,
                              ...(selectedFont === font.label
                                ? styles.dropdownItemSelected
                                : {}),
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#f6f6f7")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "transparent")
                            }
                            onClick={() => handleFontSelect(font.label)}
                          >
                            <div>
                              <strong>{font.label}</strong>
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: "12px",
                                  color: "#666666",
                                }}
                              >
                                {font.preview}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <p style={{ marginTop: "20px" }}>Font size</p>
                    <RangeSlider
                      min={10}
                      max={20}
                      value={fontSize}
                      onChange={(value) => setFontSize(value)}
                    />
                    <p style={{ marginTop: "10px" }}>{fontSize}px</p>
                    <hr />
                  </div>
                  <p style={{ margin: "10px 0" }}>Custom CSS</p>
                  <TextField
                    multiline={4}
                    //   value={customCSS}
                    onChange={(value) => setCustomCSS(value)} // Add this handler
                    placeholder="Enter custom CSS here"
                  />
                </div>
              </div>
            ) : showOverview ? (
              <div>
                <div style={styles.sidebarTitle}>
                  <div
                    style={{
                      cursor: "pointer", // Ensure the cursor changes to a pointer on hover
                      display: "flex", // Flex for alignment
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px", // Set a clickable area
                      height: "24px",
                    }}
                    onClick={() => {
                      console.log("Back arrow clicked");
                      setShowOverview(false);
                    }}
                  >
                    <Icon
                      source={ArrowLeftMinor}
                      color="base" // Optional: Adjust the color for better visibility
                      style={{ width: "16px", height: "16px" }}
                    />
                  </div>

                  <span>Overview</span>
                </div>
                <div>
                  <p style={{ marginBottom: "10px" }}>Document title</p>
                  <TextField
                    value={documentTitle}
                    onChange={(value) => setDocumentTitle(value)}
                    placeholder="Enter document title"
                  />
                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      flexDirection: "column", // Align items vertically
                      gap: "10px", // Add spacing between items
                    }}
                  >
                    {Object.keys(overviewSettings).map((key) => (
                      <Checkbox
                        key={key}
                        label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        checked={overviewSettings[key]}
                        onChange={() => handleCheckboxChange(key)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : showSupplier ? (
              <div>
                <div style={styles.sidebarTitle}>
                  <div
                    style={{
                      cursor: "pointer", // Pointer for hover effect
                      display: "flex", // Flex for alignment
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px", // Clickable area
                      height: "24px",
                    }}
                    onClick={() => {
                      console.log("Back arrow clicked");
                      setShowSupplier(false);
                    }}
                  >
                    <Icon
                      source={ArrowLeftMinor}
                      color="base" // Adjust visibility
                      style={{ width: "16px", height: "16px" }}
                    />
                  </div>
                  <span>Supplier</span>
                </div>
                <div>
                  <Checkbox
                    label="Show supplier"
                    checked={showSupplierChecked} // Bind the state
                    onChange={(newChecked) =>
                      setShowSupplierChecked(newChecked)
                    } // Update state on change
                  />
                  <p style={{ margin: "20px 0", fontWeight: "bold" }}>
                    Options
                  </p>
                  <p style={{ marginBottom: "10px" }}>Heading</p>
                  <TextField
                    value={supplierHeading}
                    onChange={(value) => setSupplierHeading(value)}
                    placeholder="Enter heading"
                  />
                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      flexDirection: "column", // Align items vertically
                      gap: "10px", // Add spacing between items
                    }}
                  >
                    {Object.keys(supplierSettings).map((key) => (
                      <Checkbox
                        key={key}
                        label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        checked={supplierSettings[key]}
                        onChange={() => handleSupplierCheckboxChange(key)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : showShipping ? (
              <div>
                <div style={styles.sidebarTitle}>
                  <div
                    style={{
                      cursor: "pointer", // Pointer for hover effect
                      display: "flex", // Flex for alignment
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px", // Clickable area
                      height: "24px",
                    }}
                    onClick={() => {
                      console.log("Back arrow clicked");
                      setShowShipping(false);
                    }}
                  >
                    <Icon
                      source={ArrowLeftMinor}
                      color="base" // Adjust visibility
                      style={{ width: "16px", height: "16px" }}
                    />
                  </div>
                  <span>Shipping</span>
                </div>
                <div>
                  <Checkbox
                    label="Show shipping"
                    checked={showShippingChecked} // Bind the state
                    onChange={(newChecked) =>
                      setShowShippingChecked(newChecked)
                    } // Update state on change
                  />
                  <p style={{ margin: "20px 0", fontWeight: "bold" }}>
                    Options
                  </p>
                  <p style={{ marginBottom: "10px" }}>Heading</p>
                  <TextField
                    value={shippingHeading}
                    onChange={(value) => setShippingHeading(value)}
                    placeholder="Enter heading"
                  />
                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      flexDirection: "column", // Align items vertically
                      gap: "10px", // Add spacing between items
                    }}
                  >
                    {Object.keys(shippingSettings).map((key) => (
                      <Checkbox
                        key={key}
                        label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        checked={shippingSettings[key]}
                        onChange={() => handleShippingCheckboxChange(key)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : showBilling ? (
              <div>
                <div style={styles.sidebarTitle}>
                  <div
                    style={{
                      cursor: "pointer", // Pointer for hover effect
                      display: "flex", // Flex for alignment
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px", // Clickable area
                      height: "24px",
                    }}
                    onClick={() => {
                      console.log("Back arrow clicked");
                      setShowBilling(false);
                    }}
                  >
                    <Icon
                      source={ArrowLeftMinor}
                      color="base" // Adjust visibility
                      style={{ width: "16px", height: "16px" }}
                    />
                  </div>
                  <span>Billing</span>
                </div>
                <div>
                  <Checkbox
                    label="Show billing"
                    checked={showBillingChecked} // Bind the state
                    onChange={(newChecked) => setShowBillingChecked(newChecked)} // Update state on change
                  />
                  <p style={{ margin: "20px 0", fontWeight: "bold" }}>
                    Options
                  </p>
                  <p style={{ marginBottom: "10px" }}>Heading</p>
                  <TextField
                    value={billingHeading}
                    onChange={(value) => setBillingHeading(value)}
                    placeholder="Enter heading"
                  />
                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      flexDirection: "column", // Align items vertically
                      gap: "10px", // Add spacing between items
                    }}
                  >
                    {Object.keys(billingSettings).map((key) => (
                      <Checkbox
                        key={key}
                        label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        checked={billingSettings[key]}
                        onChange={() => handleBillingCheckboxChange(key)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : showLineItems ? (
              <div>
                <div style={styles.sidebarTitle}>
                  <div
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px",
                    }}
                    onClick={() => {
                      console.log("Back arrow clicked");
                      setShowLineItems(false);
                    }}
                  >
                    <Icon
                      source={ArrowLeftMinor}
                      color="base"
                      style={{ width: "16px", height: "16px" }}
                    />
                  </div>
                  <span>Line items</span>
                </div>
                <div>
                  <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
                    General
                  </p>
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {Object.keys(lineItemsSettings.general).map((key) => (
                      <Checkbox
                        key={key}
                        label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        checked={lineItemsSettings.general[key]}
                        onChange={() =>
                          handlelineItemCheckboxChange(
                            "general",
                            key,
                            lineItemsSettings,
                            setLineItemsSettings
                          )
                        }
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      marginTop: "20px",
                      marginBottom: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    Price and Rate
                  </p>
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {Object.keys(lineItemsSettings.priceAndRate).map((key) => (
                      <Checkbox
                        key={key}
                        label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        checked={lineItemsSettings.priceAndRate[key]}
                        onChange={() =>
                          handlelineItemCheckboxChange(
                            "priceAndRate",
                            key,
                            lineItemsSettings,
                            setLineItemsSettings
                          )
                        }
                      />
                    ))}
                  </div>
                  <p style={{ marginTop: "20px", marginBottom: "10px" }}>
                    <Checkbox
                      label="Show product metafields"
                      checked={lineItemsSettings.showProductMetafields}
                      onChange={() =>
                        setLineItemsSettings((prev) => ({
                          ...prev,
                          showProductMetafields: !prev.showProductMetafields,
                        }))
                      }
                    />
                  </p>
                  <p>
                    <Checkbox
                      label="Show product variant metafields"
                      checked={lineItemsSettings.showProductVariantMetafields}
                      onChange={() =>
                        setLineItemsSettings((prev) => ({
                          ...prev,
                          showProductVariantMetafields:
                            !prev.showProductVariantMetafields,
                        }))
                      }
                    />
                  </p>
                  <p style={{ marginTop: "20px", fontWeight: "bold" }}>
                    Sort Items by
                  </p>
                  <Select
                    options={["Default", "Price", "Name"]}
                    value={lineItemsSettings.sortBy}
                    onChange={(value) =>
                      setLineItemsSettings((prev) => ({
                        ...prev,
                        sortBy: value,
                      }))
                    }
                  />
                </div>
              </div>
            ) : showAdditionalText ? (
              <div>
                <div style={styles.sidebarTitle}>
                  <div
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px",
                    }}
                    onClick={() => {
                      console.log("Back arrow clicked");
                      setShowAdditionalText(false);
                    }}
                  >
                    <Icon
                      source={ArrowLeftMinor}
                      color="base"
                      style={{ width: "16px", height: "16px" }}
                    />
                  </div>
                  <span>Additional text</span>
                </div>
                <div>
                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <Checkbox
                      label="Show additional text"
                      checked={additionalTextSettings.showAdditionalText}
                      onChange={() =>
                        setAdditionalTextSettings((prev) => ({
                          ...prev,
                          showAdditionalText: !prev.showAdditionalText,
                        }))
                      }
                    />
                    <Checkbox
                      label="Show payment gateway"
                      checked={additionalTextSettings.showPaymentGateway}
                      onChange={() =>
                        setAdditionalTextSettings((prev) => ({
                          ...prev,
                          showPaymentGateway: !prev.showPaymentGateway,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            ) : showTotal ? (
              <div>
                <div style={styles.sidebarTitle}>
                  <div
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px",
                    }}
                    onClick={() => {
                      console.log("Back arrow clicked");
                      setShowTotal(false);
                    }}
                  >
                    <Icon
                      source={ArrowLeftMinor}
                      color="base"
                      style={{ width: "16px", height: "16px" }}
                    />
                  </div>
                  <span>Total</span>
                </div>
                <div>
                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {Object.keys(totalSettings).map((key) => (
                      <Checkbox
                        key={key}
                        label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        checked={totalSettings[key]}
                        onChange={() => handleTotalCheckboxChange(key)}
                      />
                    ))}
                  </div>
                  <p style={{ margin: "20px 0", fontWeight: "bold" }}>
                    Table note
                  </p>
                  <TextField
                    value={tableNote}
                    onChange={(value) => setTableNote(value)}
                    placeholder="Eg. All prices will be calculated in USD"
                  />
                </div>
              </div>
            ) : showFooter ? (
              <div>
                <div style={styles.sidebarTitle}>
                  <div
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px",
                    }}
                    onClick={() => setShowFooter(false)}
                  >
                    <Icon
                      source={ArrowLeftMinor}
                      color="base"
                      style={{ width: "16px", height: "16px" }}
                    />
                  </div>
                  <span>Footer</span>
                </div>
                <div>
                  <p style={{ marginBottom: "10px" }}>
                    To show signature, upload signature in{" "}
                    <a
                      href="/settings"
                      style={{ color: "#0070f3", textDecoration: "underline" }}
                    >
                      settings
                    </a>
                  </p>

                  <p style={{ marginTop: "20px", fontWeight: "bold" }}>
                    Customer note
                  </p>
                  <Checkbox
                    label="Show note"
                    checked={footerSettings.showNote}
                    onChange={(newValue) =>
                      setFooterSettings((prev) => ({
                        ...prev,
                        showNote: newValue,
                      }))
                    }
                  />

                  <p style={{ marginTop: "20px", fontWeight: "bold" }}>
                    Customer note options
                  </p>
                  <TextField
                    label="Note heading"
                    value={footerSettings.noteHeading}
                    onChange={(value) =>
                      setFooterSettings((prev) => ({
                        ...prev,
                        noteHeading: value,
                      }))
                    }
                    placeholder="Enter note heading"
                  />
                  <p
                    style={{
                      fontSize: "12px",
                      marginTop: "10px",
                      color: "#6b6b6b",
                    }}
                  >
                    Please note that this field is only shown if there is a
                    customer note set for the order during the checkout.
                  </p>

                  <p style={{ marginTop: "20px", fontWeight: "bold" }}>
                    Thank you note
                  </p>
                  <TextField
                    multiline={4}
                    maxLength={1000}
                    value={footerSettings.thankYouNote}
                    onChange={(value) =>
                      setFooterSettings((prev) => ({
                        ...prev,
                        thankYouNote: value,
                      }))
                    }
                    placeholder="Enter your thank you note"
                  />

                  <p style={{ marginTop: "20px", fontWeight: "bold" }}>
                    Footer note
                  </p>
                  <TextField
                    multiline={4}
                    maxLength={1000}
                    value={footerSettings.footerNote}
                    onChange={(value) =>
                      setFooterSettings((prev) => ({
                        ...prev,
                        footerNote: value,
                      }))
                    }
                    placeholder="Enter footer note"
                  />

                  <p style={{ marginTop: "20px", fontWeight: "bold" }}>
                    Social networks
                  </p>
                  <Checkbox
                    label="Hide social links on print"
                    checked={footerSettings.hideSocialLinks}
                    onChange={(newValue) =>
                      setFooterSettings((prev) => ({
                        ...prev,
                        hideSocialLinks: newValue,
                      }))
                    }
                  />

                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {Object.keys(footerSettings.socialLinks).map((key) => (
                      <Checkbox
                        key={key}
                        label={`Show ${key}`}
                        checked={footerSettings.socialLinks[key]}
                        onChange={() =>
                          setFooterSettings((prev) => ({
                            ...prev,
                            socialLinks: {
                              ...prev.socialLinks,
                              [key]: !prev.socialLinks[key],
                            },
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={styles.sidebarTitle}>Customize</div>
                <div>
                  {menuItems.map((item, index) => (
                    <div
                      key={index}
                      style={styles.menuItem}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f1f3f5")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                      onClick={item.onClick}
                    >
                      <div style={styles.menuText}>
                        {/* Render the icon */}
                        <Icon source={item.icon} />
                        {item.label}
                      </div>
                      <span>›</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AlphaCard>
        </div>
        <AlphaCard style={styles.alphaCardPreview}>
          <div style={styles.sidebarTitle}>Preview</div>
          <div style={styles.previewContainer}>
            {/* <span>Template preview</span> */}
            <div style={{ padding: "0px", overflowY: "auto", overflowX: "auto", maxHeight: "100%" }}>
        {orders.length > 0 &&(<>{renderInvoiceTemplate(templateId, shopDetails, demoOrder[0])}</>)|| 'No template available'} 
      </div>
            
            
            
          </div>
        </AlphaCard>
      </div>
    </div>
  );
}
