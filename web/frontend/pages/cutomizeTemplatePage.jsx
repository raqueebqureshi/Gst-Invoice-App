import React, { useEffect, useState, useCallback, use } from "react";
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
  Spinner,
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
 
  const navigate = useNavigate(); // Initialize useNavigate
  const [selectedFont, setSelectedFont] = useState("Roboto");
  const [storeDomain, setStoreDomain] = useState(null);
  const [email, setEmail] = useState(null);  
  const location = useLocation();
  const { state } = location;
  const [shopDetails, setShopDetails] = useState([]);
  const { templateId } = state || {};

  // console.log("templateId", templateId);

  const [showBrandingAndStyle, setShowBrandingAndStyle] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [showSupplier, setShowSupplier] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [showLineItems, setShowLineItems] = useState(false);
  const [showTotal, setShowTotal] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showDropdown, setShowDropdown] = useState(false);
  

  const [invoiceSettings, setInvoiceSettings] = useState({
    branding: {
      showLogo: false, // Taken from "showLogo"
      primaryColor: "#000000", // Added field
      fontFamily: "Arial", // Added field
    },
    // generalSettings: {
    //   showBrandingAndStyle: false,
    //   showOverview: false,
    //   showSupplier: false,
    //   showShipping: false,
    //   showBilling: false,
    //   showLineItems: false,
    //   showAdditionalText: false,
    //   showTotal: false,
    //   showFooters: false,
    //   showDropdown: false,
    // },
    headings: {
      shippingHeading: "Ship To", // Taken from shipping.heading
      billingHeading: "Bill To", // Taken from billing.heading
      supplierHeading: "Supplier", // Taken from supplier.heading
      documentTitle: "Tax Invoice", // Taken from overview.documentTitle
    },
    toggles: {
      showBillingChecked: false, // Taken from billing.showBilling
      showShippingChecked: false, // Taken from shipping.showShipping
      showSupplierChecked: false, // Taken from supplier.showSupplier
    },
    // tableNote: "Eg. All prices will be calculated in INR",
    overviewSettings: {
      showOrderId: false, // overview.showOrderId
      showInvoiceNumber: false, // overview.showInvoiceNumber
      //   showOrderIdBarcode: false, // overview.showOrderIdBarcode
      //   customizeInvoiceNumber: false, // overview.customizeInvoiceNumber
      issueDate: false, // overview.issueDate
      //   showTaxReverseText: false, // overview.showTaxReverseText
      //   showTrackingCompany: false, // overview.showTrackingCompany
      //   showTrackingNo: false, // overview.showTrackingNo
      //   showTrackingBarcode: false, // overview.showTrackingBarcode
      //   addNote: "", // overview.addNote

      //   showQrCode: false, // Added
      //   showDeliveryMethod: false, // overview.showDeliveryMethod
    },
    supplierSettings: {
      showSupplier: true, // supplier.showSupplier

      //   showHeading: false, // supplier.showHeading
      showBusinessName: false, // supplier.showBusinessName
      showAddress: false, // supplier.showAddress
      //   showApartment: false, // supplier.showApartment
      showCity: false, // supplier.showCity
      //   showVATNumber: false, // supplier.showVATNumber
      //   showRegisteredNumber: false, // supplier.showRegisteredNumber
      showEmail: false, // supplier.showEmail
      showPhone: false, // supplier.showPhone
      showGst: false, // supplier.showGSTIN
    },
    shippingSettings: {
      //   showShipping: true, // shipping.showShipping
      showHeading: true, // shipping.showHeading
      showFullName: true, // shipping.showFullName
      showAddress1: true, // shipping.showAddress1
      //   showAddress2: false, // shipping.showAddress2
      //   showCompany: true, // shipping.showCompany
      showCity: true, // shipping.showCity
      showPinCode: true, // shipping.showZipPinCode
      showState: true, // shipping.showState
      showCountry: true, // shipping.showCountry
      showEmail: true, // shipping.showEmail
      showPhone: true, // shipping.showPhone
      showGst: false, // shipping.showGSTIN
    },
    billingSettings: {
      //   showBilling: true, // billing.showBilling
      //   heading: "Bill To", // billing.heading
      showHeading: true, // billing.showHeading
      showFullName: true, // billing.showFullName
      showAddress1: true, // billing.showAddress1
      //   showAddress2: false, // billing.showAddress2
      showCompany: true, // billing.showCompany
      showCity: true, // billing.showCity
      showPinCode: true, // billing.showZipPinCode
      showState: true, // billing.showState
      showCountry: true, // billing.showCountry
      showEmail: true, // billing.showEmail
      showPhone: true, // billing.showPhone
      showGst: false, // billing.showGSTIN
    },
    lineItemsSettings: {
      showTitle: true, // lineItems.showVariantTitle
      showHsn: false, // lineItems.showHSN
      //   showProductImage: false, // lineItems.showProductImage
      //   showSKU: true, // lineItems.showSKU
      showUnitRate: true, // lineItems.showUnitRate
      showQuantity: true, // lineItems.showQuantity
      //   showTotalDiscount: false, // lineItems.showTotalDiscount
      //   showRateAsDiscountedPrice: false, // lineItems.showRateAsDiscountedPrice
      showTaxAmount: true, // lineItems.showTaxAmount
      showTotalPrice: true, // lineItems.showTotalPrice
    },
    totalSettings: {
      showSubtotal: true, // total.showSubtotal
      showDiscount: true, // total.showDiscount
      //   showShipping: true, // total.showShipping
      //   showShippingGstSplit: false, // total.showShippingGSTSplit
      //   showRefunded: false, // total.showRefunded
      showTax: true, // total.showTax
      showTotal: true, // total.showTotal
      showOutstanding: false, // total.showOutstanding
    },
    otherSettings: {
      thankYouNote: "Thanks for your purchase", // footer.thankYouNote
      note: "This is an electronically generated invoice, no signature is required", // footer.footerNote
      socialLinks: {
        Website: false,
        Facebook: false,
        Twitter: false,
        Instagram: false,
        Pinterest: false,
        Youtube: false,
      },
    },
  });

  const [InvoiceSetting2, setInvoiceSetting2] = useState({
    branding: {
      showLogo: true,
      primaryColor: "#000000",
      fontFamily: "Roboto",
    },
    overview: {
      documentTitle: "Tax Invoice",
      showOrderId: true,
      showInvoiceNumber: true,
      showOrderIdBarcode: false,
      customizeInvoiceNumber: false,
      issueDate: true,
      showTaxReverseText: false,
      showTrackingCompany: false,
      showTrackingNo: false,
      showTrackingBarcode: false,
      addNote: "",
      showDeliveryMethod: false,
    },
    supplier: {
      heading: "Supplier",
      showSupplier: true,
      supplier: "",
      showHeading: true,
      showBusinessName: true,
      showAddress: true,
      showApartment: false,
      showCity: true,
      showVATNumber: false,
      showRegisteredNumber: false,
      showEmail: true,
      showPhone: true,
      showGSTIN: false,
    },
    shipping: {
      showShipping: true,
      heading: "Ship To",
      showHeading: true,
      showFullName: true,
      showAddress1: true,
      showAddress2: false,
      showCompany: true,
      showCity: true,
      showZipPinCode: true,
      showState: true,
      showCountry: true,
      showEmail: true,
      showPhone: true,
      showGSTIN: false,
    },
    billing: {
      showBilling: true,
      heading: "Bill To",
      showHeading: true,
      showFullName: true,
      showAddress1: true,
      showAddress2: false,
      showCompany: true,
      showCity: true,
      showZipPinCode: true,
      showState: true,
      showCountry: true,
      showEmail: true,
      showPhone: true,
      showGSTIN: false,
    },
    lineItems: {
      showProductImage: false,
      showSKU: true,
      showVariantTitle: true,
      showQuantity: true,
      showHSN: false,
      showUnitRate: true,
      showTotalDiscount: false,
      showRateAsDiscountedPrice: false,
      showTaxAmount: true,
      showTotalPrice: true,
    },
    total: {
      showDiscount: true,
      showSubtotal: true,
      showShipping: true,
      showShippingGSTSplit: false,
      showRefunded: false,
      showTax: true,
      showOutstanding: false,
      showTotal: true,
    },
    footer: {
      socialNetworks: {
        showWebsite: false,
        showFacebook: false,
        showTwitter: false,
        showInstagram: false,
        showPinterest: false,
        showYoutube: false,
      },
      thankYouNote: "Thanks for your purchase",
      footerNote:
        "This is an electronically generated invoice, no signature is required",
    },
  });

  const demoOrder = [
    {
      line_items: [
        {
          id: 14721915060453,
          admin_graphql_api_id: "gid://shopify/LineItem/14721915060453",
          attributed_staffs: [],
          current_quantity: 1,
          fulfillable_quantity: 1,
          fulfillment_service: "manual",
          fulfillment_status: null,
          gift_card: false,
          grams: 5000,
          name: "Demo Product - Powder",
          price: "500.00",
          price_set: {
            shop_money: {
              amount: "500.00",
              currency_code: "INR",
            },
            presentment_money: {
              amount: "500.00",
              currency_code: "INR",
            },
          },
          product_exists: true,
          product_id: 123456789,
          properties: [],
          quantity: 1,
          requires_shipping: true,
          sku: "DEMO-SKU",
          taxable: true,
          title: "Demo Product",
          total_discount: "0.00",
          total_discount_set: {
            shop_money: {
              amount: "0.00",
              currency_code: "INR",
            },
            presentment_money: {
              amount: "0.00",
              currency_code: "INR",
            },
          },
          variant_id: 987654321,
          variant_inventory_management: "shopify",
          variant_title: "Powder",
          vendor: "Demo Vendor",
          tax_lines: [],
          duties: [],
          discount_allocations: [],
        },
      ],
      app_id: 123456,
      billing_address: {
        first_name: "John",
        address1: "123 Demo Street",
        phone: "+1234567890",
        city: "Demo City",
        zip: "12345",
        province: "Demo Province",
        country: "Demo Country",
        last_name: "Doe",
        address2: null,
        company: "Demo Company",
        latitude: 45.4191773,
        longitude: -75.6967303,
        name: "John Doe",
        country_code: "DC",
        province_code: "DP",
      },
      browser_ip: "192.168.1.1",
      buyer_accepts_marketing: false,
      cancel_reason: null,
      cancelled_at: null,
      cart_token: null,
      checkout_token: "demo-checkout-token",
      client_details: {
        accept_language: "en-US",
        browser_height: 1080,
        browser_ip: "192.168.1.1",
        browser_width: 1920,
        session_hash: null,
        user_agent: "Mozilla/5.0",
      },
      closed_at: null,
      company: null,
      confirmation_number: "DEMO123",
      created_at: "2024-01-01T00:00:00-00:00",
      currency: "INR",
      current_subtotal_price: "500.00",
      current_subtotal_price_set: {
        shop_money: {
          amount: "500.00",
          currency_code: "INR",
        },
        presentment_money: {
          amount: "500.00",
          currency_code: "INR",
        },
      },
      current_total_additional_fees_set: null,
      current_total_discounts: "0.00",
      current_total_discounts_set: {
        shop_money: {
          amount: "0.00",
          currency_code: "INR",
        },
        presentment_money: {
          amount: "0.00",
          currency_code: "INR",
        },
      },
      current_total_duties_set: null,
      current_total_price: "500.00",
      current_total_price_set: {
        shop_money: {
          amount: "500.00",
          currency_code: "INR",
        },
        presentment_money: {
          amount: "500.00",
          currency_code: "INR",
        },
      },
      current_total_tax: "0.00",
      current_total_tax_set: {
        shop_money: {
          amount: "0.00",
          currency_code: "INR",
        },
        presentment_money: {
          amount: "0.00",
          currency_code: "INR",
        },
      },
      customer: {
        created_at: "2024-01-01T00:00:00-00:00",
        currency: "INR",
        email: "john.doe@example.com",
        email_marketing_consent: {
          state: "subscribed",
          opt_in_level: "single_opt_in",
          consent_updated_at: null,
        },
        first_name: "John",
        id: 123456,
        last_name: "Doe",
        multipass_identifier: null,
        note: null,
        phone: "+1234567890",
        sms_marketing_consent: {
          state: "not_subscribed",
          opt_in_level: "single_opt_in",
          consent_updated_at: null,
          consent_collected_from: "OTHER",
        },
        state: "disabled",
        tags: "",
        tax_exempt: false,
        tax_exemptions: [],
        updated_at: "2024-01-01T00:00:00-00:00",
        verified_email: true,
        admin_graphql_api_id: "gid://shopify/Customer/123456",
      },
      customer_locale: "en",
      discount_applications: [],
      discount_codes: [],
      email: "john.doe@example.com",
      estimated_taxes: false,
      financial_status: "paid",
      fulfillment_status: null,
      fulfillments: [],
      id: 1234567890,
      landing_site: null,
      location_id: null,
      merchant_of_record_app_id: null,
      name: "#1234",
      note: null,
      note_attributes: [],
      number: 1234,
      order_number: 1234,
      order_status_url: "https://example.com/order/1234",
      original_total_additional_fees_set: null,
      original_total_duties_set: null,
      payment_gateway_names: ["manual"],
      payment_terms: null,
      phone: "+1234567890",
      po_number: null,
      presentment_currency: "INR",
      processed_at: "2024-01-01T00:00:00-00:00",
      referring_site: null,
      refunds: [],
      shipping_address: {
        first_name: "John",
        address1: "456 Demo Lane",
        phone: "+1234567890",
        city: "Demo City",
        zip: "67890",
        province: "Demo Province",
        country: "Demo Country",
        last_name: "Doe",
        address2: null,
        company: "Demo Shipping Co",
        latitude: 45.4191773,
        longitude: -75.6967303,
        name: "John Doe",
        country_code: "DC",
        province_code: "DP",
      },
      shipping_lines: [],
      source_identifier: "demo-source",
      source_name: "shopify_draft_order",
      source_url: null,
      subtotal_price: "500.00",
      subtotal_price_set: {
        shop_money: {
          amount: "500.00",
          currency_code: "INR",
        },
        presentment_money: {
          amount: "500.00",
          currency_code: "INR",
        },
      },
      tags: "",
      tax_lines: [],
      taxes_included: false,
      test: false,
      token: "demo-token",
      total_discounts: "0.00",
      total_discounts_set: {
        shop_money: {
          amount: "0.00",
          currency_code: "INR",
        },
        presentment_money: {
          amount: "0.00",
          currency_code: "INR",
        },
      },
      total_line_items_price: "500.00",
      total_line_items_price_set: {
        shop_money: {
          amount: "500.00",
          currency_code: "INR",
        },
        presentment_money: {
          amount: "500.00",
          currency_code: "INR",
        },
      },
      total_outstanding: "0.00",
      total_price: "500.00",
      total_price_set: {
        shop_money: {
          amount: "500.00",
          currency_code: "INR",
        },
        presentment_money: {
          amount: "500.00",
          currency_code: "INR",
        },
      },
      total_shipping_price_set: {
        shop_money: {
          amount: "0.00",
          currency_code: "INR",
        },
        presentment_money: {
          amount: "0.00",
          currency_code: "INR",
        },
      },
      total_tax: "0.00",
      total_tax_set: {
        shop_money: {
          amount: "0.00",
          currency_code: "INR",
        },
        presentment_money: {
          amount: "0.00",
          currency_code: "INR",
        },
      },
      total_tip_received: "0.00",
      total_weight: 5000,
      updated_at: "2024-01-01T00:00:00-00:00",
      user_id: 123456,
      admin_graphql_api_id: "gid://shopify/Order/1234567890",
      checkout_id: 987654321,
      confirmed: true,
      contact_email: "john.doe@example.com",
      device_id: null,
      landing_site_ref: null,
      reference: "demo-reference",
      tax_exempt: false,
    },
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
      border: "1px solid #dcdcde",
      borderRadius: "8px",
      overflow: "hidden",
      display: "inline-flex",  // Changed to "inline-flex" for child-based sizing
      justifyContent: "center",
      alignItems: "center",
      
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#f9fafb",
      width: "fit-content", // Automatically adjust width based on child content
      height: "fit-content", // Automatically adjust height based on child content
      padding: "16px", // Optional: Add padding to maintain spacing around content
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
      top: "72%", // Makes the list appear above the dropdown button
      left: "9%",
      backgroundColor: "#ffffff",
      border: "1px solid #dcdcde",
      borderRadius: "10px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      zIndex: 9999,
      maxHeight: "200px",
      overflowY: "auto",
      minWidth: "240px", // Ensures dropdown has a default width
      padding: "10px 0", // Adds spacing within the dropdown for content
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

  const updateInvoiceSetting = (section, key, value) => {
    setInvoiceSettings((prevSettings) => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [key]: value, // Dynamically set key-value pair
      },
    }));
  };

  const updateInvoiceSetting2 = (section, key, value) => {
    setInvoiceSetting2((prevSettings) => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [key]: value, // Dynamically update the key-value pair in the specified section
      },
    }));
  };

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
        // console.log("Store Details---!", response.data);
        if (response.data.data.length > 0) {
          // console.log("Store Details---", response.data.data[0]);
          setShopDetails(response.data.data[0]);
          if (shopDetails.length > 0) {
            // console.log("shopDetails", shopDetails);
          }
          setStoreDomain(response.data.data[0].domain);
          setEmail(response.data.data[0].email);
        }
      })
      .catch((error) =>  console.log(error));
  }, []);

  const fetchInvoiceSettings = async () => {
      // console.log("Sending request to fetch invoice settings");

      return fetch("/api/fetch-invoice-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, storeDomain: storeDomain }), // Replace with actual data
      })
        .then(async (response) => {
          if (!response.ok) {
            return response.text().then((errorText) => {
              throw new Error(
                errorText || `HTTP error! Status: ${response.status}`
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          // setInvoiceSettings(data);
          const settings = data;
          // console.log("Received response:", settings);
          // // console.log("Received response:", JSON.stringify(settings));
          if (settings) {
            setInvoiceSetting2((prevState) => ({
              ...prevState,
              ...settings,
            }));
            setSelectedFont(settings.branding.fontFamily);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching invoice settings:", error.message);
        });
    };

  useEffect(() => {
    

    if (storeDomain && email) {
      fetchInvoiceSettings();
    }
  }, [storeDomain, email]);

  // Example usage:
  const handleShowToast = (message, isError) => {
    // console.log(`${isError ? "Error" : "Info"}: ${message}`);
  };

  useEffect(() => {
    // console.log("Invoice Settings", InvoiceSetting2);
  }, [InvoiceSetting2]);

  const updateInvoiceSettingAPI = async () => {
    // console.log({
    //   email: email,
    //   storeDomain: storeDomain,
    //   updatedSettings: invoiceSettings,
    // });
    // const updatedSettings = invoiceSettings;
    return fetch("/api/update-invoice-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        storeDomain: storeDomain,
        updatedSettings: InvoiceSetting2,
      }), // Replace with actual data
    })
      .then(async (response) => {
        if (!response.ok) {
          return response.text().then((errorText) => {
            throw new Error(
              errorText || `HTTP error! Status: ${response.status}`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        // setInvoiceSettings(data);
        const updateSettings = data;
        console.log("Received updated response:", updateSettings);
        // navigate(-1);
        if (storeDomain && email) {
          fetchInvoiceSettings();
        }
      })
      .catch((error) => {
        console.error("Error updating invoice settings:", error.message);
      });
  };

  const renderInvoiceTemplate = (currentTemplate, shopdetails, order) => {
    switch (currentTemplate) {
      case 1:
        return (
          <InvoiceTemplate1 shopdetails={[shopdetails]} orders={[order]} invoiceSettings={InvoiceSetting2}/>
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
  };

  const colorOptions = [
    { label: "Black", value: "Black", color: "#000000" },
    { label: "Purple", value: "Purple", color: "#800080" },
    { label: "Light Green", value: "Light Green", color: "#90ee90" },
    { label: "Dark Blue", value: "Dark Blue", color: "#00008b" },
    // { label: "Custom", value: "Custom", color: "#000000" },
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
    // {
    //   icon: TextMajor,
    //   label: "Additional text",
    //   onClick: () => setShowAdditionalText(true),
    // },
    { icon: TaxMajor, label: "Total", onClick: () => setShowTotal(true) },
    { icon: FooterMajor, label: "Other", onClick: () => setShowFooter(true) },
  ];

  const handleColorSelect = (value) => {
    updateInvoiceSetting2("branding", "primaryColor", value);
    // console.log(
      // "invoiceSettings.branding.primaryColor",
      // invoiceSettings.branding.primaryColor
    // );
    // setPrimaryColor(value);
  };

  const fontOptions = [
    {
      label: "Roboto",
      preview: "Almost before we knew it.",
      fontFamily: "'Roboto', sans-serif", // Font family for Roboto
    },
    {
      label: "Merriweather",
      preview: "Almost before we knew it.",
      fontFamily: "'Merriweather', serif", // A formal, classic serif font
    },
  ];

  const handleFontSelect = (font) => {
    setSelectedFont(font);
    updateInvoiceSetting2("branding", "fontFamily", font);
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
              // console.log("Back button clicked");
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
          <Button primary onClick={() => updateInvoiceSettingAPI()}>
            Save Template
          </Button>
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
                      // console.log("Back arrow clicked");
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
                {showDropdown && (
                  <div
                    style={{
                      ...styles.dropdownList,
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
                          (e.currentTarget.style.backgroundColor = "#f6f6f7")
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
                              fontFamily: font.fontFamily,
                              fontSize: "14px",
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
                <div>
                  <Checkbox
                    label="Show logo"
                    checked={InvoiceSetting2.branding.showLogo} // Bind the state to the checkbox
                    onChange={(newChecked) =>
                      updateInvoiceSetting2("branding", "showLogo", newChecked)
                    } // Update state on change
                  />
                  {/* <p style={{ margin: "10px 0", fontWeight: "bold" }}>
                    Logo size
                  </p>
                  <RangeSlider
                    min={0}
                    max={100}
                    value={logoSize}
                    onChange={(value) => setLogoSize(value)}
                  />
                  <p style={{ marginTop: "10px" }}>{logoSize}px</p> */}

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
                          ...(InvoiceSetting2.branding.primaryColor ===
                          option.color
                            ? styles.colorOptionSelected
                            : {}),
                        }}
                        onClick={() => handleColorSelect(option.color)}
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

                    {/* <p style={{ marginTop: "20px" }}>Font size</p>
                    <RangeSlider
                      min={10}
                      max={20}
                      value={fontSize}
                      onChange={(value) => setFontSize(value)}
                    />
                    <p style={{ marginTop: "10px" }}>{fontSize}px</p> */}
                  </div>
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
                      // console.log("Back arrow clicked");
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
                  <strong style={{ marginBottom: "10px" }}>Document title</strong>

                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      flexDirection: "column", // Align items vertically
                      gap: "10px", // Add spacing between items
                    }}
                  >
                    {Object.keys(InvoiceSetting2.overview)
                      .filter(
                        (key) =>
                          ![
                            "addNote",
                            "showDeliveryMethod",
                            "customizeInvoiceNumber",
                            "showOrderIdBarcode",
                            "showTrackingBarcode",
                            "showTrackingCompany",
                            "showTrackingNo",
                            "showTaxReverseText",
                          ].includes(key)
                      ) // Filter out unwanted fields
                      .map((key) =>
                        typeof InvoiceSetting2.overview[key] === "boolean" ? (
                          <Checkbox
                            key={key}
                            label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                            checked={InvoiceSetting2.overview[key]}
                            onChange={() =>
                              updateInvoiceSetting2(
                                "overview",
                                key,
                                !InvoiceSetting2.overview[key]
                              )
                            }
                          />
                        ) : (
                          <TextField
                            key={key}
                            value={InvoiceSetting2.overview[key]}
                            onChange={(value) =>
                              updateInvoiceSetting2("overview", key, value)
                            }
                            placeholder={`Enter ${key
                              .replace(/([A-Z])/g, " $1")
                              .toLowerCase()}`}
                          />
                        )
                      )}
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
                      // console.log("Back arrow clicked");
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
                  
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      flexDirection: "column", // Align items vertically
                      gap: "10px", // Add spacing between items
                    }}
                  >
                    {Object.keys(InvoiceSetting2.supplier)
                      .filter(
                        (key) =>
                          ![
                            "showApartment",
                            "showBusinessName",
                            "showRegisteredNumber",
                            "showVATNumber",
                            "supplier",
                            
                          ].includes(key)
                      ) // Filter out unwanted fields
                      .map((key) =>
                        typeof InvoiceSetting2.supplier[key] === "boolean" ? (
                          <Checkbox
                            key={key}
                            label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                            checked={InvoiceSetting2.supplier[key]}
                            onChange={() =>
                              updateInvoiceSetting2("supplier", key, !InvoiceSetting2.supplier[key])
                            }
                          />
                        ) : (
                          <>
                            <strong style={{ marginBottom: "0px" }}>Heading</strong>
                            <TextField
                              key={key}
                              value={InvoiceSetting2.supplier[key]}
                              onChange={(value) => updateInvoiceSetting2("supplier", key, value)}
                              placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                            />
                          </>
                        )
                      )}
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
                      // console.log("Back arrow clicked");
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
                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      flexDirection: "column", // Align items vertically
                      gap: "10px", // Add spacing between items
                    }}
                  >
                    {Object.keys(InvoiceSetting2.shipping)
                      .filter(
                        (key) =>
                          ![
                            "showAddress2",
                          ].includes(key)
                      ) // Filter out unwanted fields
                      .map((key) =>
                        typeof InvoiceSetting2.shipping[key] === "boolean" ? (
                          <Checkbox
                            key={key}
                            label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                            checked={InvoiceSetting2.shipping[key]}
                            onChange={() =>
                              updateInvoiceSetting2(
                                "shipping",
                                key,
                                !InvoiceSetting2.shipping[key]
                              )
                            }
                          />
                        ) : (
                          <>
                          <strong style={{ marginBottom: "0px" }}>Heading</strong>
                          <TextField
                            key={key}
                            value={InvoiceSetting2.shipping[key]}
                            onChange={(value) =>
                              updateInvoiceSetting2("shipping", key, value)
                            }
                            placeholder={`Enter ${key
                              .replace(/([A-Z])/g, " $1")
                              .toLowerCase()}`}
                          />
                          </>
                          
                        )
                      )}
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
                      // console.log("Back arrow clicked");
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
                  
                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      flexDirection: "column", // Align items vertically
                      gap: "10px", // Add spacing between items
                    }}
                  >
                    {Object.keys(InvoiceSetting2.billing)
                      .filter(
                        (key) =>
                          ![
                            "showAddress2",
                            
                          ].includes(key)
                      ) // Filter out unwanted fields
                      .map((key) =>
                        typeof InvoiceSetting2.billing[key] === "boolean" ? (
                          <Checkbox
                            key={key}
                            label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                            checked={InvoiceSetting2.billing[key]}
                            onChange={() =>
                              updateInvoiceSetting2(
                                "billing",
                                key,
                                !InvoiceSetting2.billing[key]
                              )
                            }
                          />
                        ) : (
                          <>
                          <strong style={{ marginBottom: "0px" }}>Heading</strong>
                          <TextField
                            key={key}
                            value={InvoiceSetting2.billing[key]}
                            onChange={(value) =>
                              updateInvoiceSetting2("billing", key, value)
                            }
                            placeholder={`Enter ${key
                              .replace(/([A-Z])/g, " $1")
                              .toLowerCase()}`}
                          />
                          </>
                          
                        )
                      )}
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
                      // console.log("Back arrow clicked");
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
                    {Object.keys(InvoiceSetting2.lineItems)
                      .filter(
                        (key) =>
                          ![
                            "showProductImage",
                            "showRateAsDiscountedPrice",
                            "showSKU",
                            "showTotalDiscount",

                            
                          ].includes(key)
                      ) // Filter out unwanted fields
                      .map((key) =>
                        typeof InvoiceSetting2.lineItems[key] === "boolean" ? (
                          <Checkbox
                            key={key}
                            label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                            checked={InvoiceSetting2.lineItems[key]}
                            onChange={() =>
                              updateInvoiceSetting2(
                                "lineItems",
                                key,
                                !InvoiceSetting2.lineItems[key]
                              )
                            }
                          />
                        ) : (
                          <>
                          <strong style={{ marginBottom: "0px" }}>Heading</strong>
                          <TextField
                            key={key}
                            value={InvoiceSetting2.lineItems[key]}
                            onChange={(value) =>
                              updateInvoiceSetting2("lineItems", key, value)
                            }
                            placeholder={`Enter ${key
                              .replace(/([A-Z])/g, " $1")
                              .toLowerCase()}`}
                          />
                          </>
                          
                        )
                      )}
                  </div>
                </div>
              </div>
            ) :
            showTotal ? (
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
                      // console.log("Back arrow clicked");
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
                   {Object.keys(InvoiceSetting2.total)
                      .filter(
                        (key) =>
                          ![
                            "showShippingGSTSplit",
                            "showShipping",
                            "showRefunded",
                            "showOutstanding"
                            
                          ].includes(key)
                      ) // Filter out unwanted fields
                      .map((key) =>
                        typeof InvoiceSetting2.total[key] === "boolean" ? (
                          <Checkbox
                            key={key}
                            label={key.replace(/([A-Z])/g, " $1").toLowerCase()}
                            checked={InvoiceSetting2.total[key]}
                            onChange={() =>
                              updateInvoiceSetting2(
                                "total",
                                key,
                                !InvoiceSetting2.total[key]
                              )
                            }
                          />
                        ) : (
                          <>
                          <strong style={{ marginBottom: "0px" }}>Heading</strong>
                          <TextField
                            key={key}
                            value={InvoiceSetting2.total[key]}
                            onChange={(value) =>
                              updateInvoiceSetting2("total", key, value)
                            }
                            placeholder={`Enter ${key
                              .replace(/([A-Z])/g, " $1")
                              .toLowerCase()}`}
                          />
                          </>
                          
                        )
                      )}
                  </div>
                  {/* <p style={{ margin: "20px 0", fontWeight: "bold" }}>
                    Table note
                  </p>
                  <TextField
                    value={tableNote}
                    onChange={(value) => setTableNote(value)}
                    placeholder="Eg. All prices will be calculated in INR"
                  /> */}
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
                  <span>Others</span>
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
                    Thank you note
                  </p>
                  <TextField
                    multiline={4}
                    maxLength={1000}
                    value={InvoiceSetting2.footer.thankYouNote}
                    onChange={(value) =>
                      updateInvoiceSetting2(
                        "footer",
                        "thankYouNote",
                        value
                      )
                    }
                    placeholder="Enter your thank you note"
                  />

                  <p style={{ marginTop: "20px", fontWeight: "bold" }}>
                    Customer note
                  </p>
                  <TextField
                    multiline={4}
                    maxLength={1000}
                    value={InvoiceSetting2.footer.footerNote}
                    onChange={(value) =>
                      updateInvoiceSetting2("footer", "footerNote", value)
                    }
                    placeholder="Enter footer note"
                  />

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
          {loading ? (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '150px' }}>
        <Spinner accessibilityLabel="Loading Spinner" size="large" />
      </div>
    ) : (
          <div style={styles.previewContainer}>
            {/* <span>Template preview</span> */}
            <div
              style={{
                padding: "0px",
                overflowY: "auto",
                overflowX: "auto",
                maxHeight: "100%",
              }}
            >
              {(shopDetails.id && (
                <>
                
                  {renderInvoiceTemplate(templateId, shopDetails, demoOrder[0])}
                </>
              )) ||
                "No template available"}
            </div>

          </div>
          )}
        </AlphaCard>
      </div>
    </div>
  );
}
