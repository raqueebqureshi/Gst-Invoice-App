
import mongoose from 'mongoose';

const InvoiceTemplateSchema = new mongoose.Schema({
  email: { type: String, required: true }, // Add email
  storeDomain: { type: String, required: true }, // Add store domain
  shopId: { type: String, required: true }, // Add shop ID
  branding: {
    showLogo: { type: Boolean, default: false },
    primaryColor: { type: String, default: "#000000" },
    fontFamily: { type: String, default: "Montserrat, sans-serif" },
    showSignature: { type: Boolean, default: false },
  },
  overview: {
    documentTitle: { type: String, default: "Tax Invoice" },
    showOrderId: { type: Boolean, default: true },
    showInvoiceNumber: { type: Boolean, default: true },
    showOrderIdBarcode: { type: Boolean, default: false },
    customizeInvoiceNumber: { type: Boolean, default: false },
    issueDate: { type: Boolean, default: true },
    showTaxReverseText: { type: Boolean, default: false },
    showTrackingCompany: { type: Boolean, default: false },
    showTrackingNo: { type: Boolean, default: false },
    showTrackingBarcode: { type: Boolean, default: false },
    addNote: { type: String, default: "" },
    showDeliveryMethod: { type: Boolean, default: false },
  },
  supplier: {
    heading: { type: String, default: "Supplier" },
    showSupplier: { type: Boolean, default: true },
    supplier: { type: String, default: "" },
    showHeading: { type: Boolean, default: true },
    showBusinessName: { type: Boolean, default: true },
    showAddress: { type: Boolean, default: true },
    showApartment: { type: Boolean, default: false },
    showCity: { type: Boolean, default: true },
    showVATNumber: { type: Boolean, default: false },
    showRegisteredNumber: { type: Boolean, default: false },
    showEmail: { type: Boolean, default: true },
    showPhone: { type: Boolean, default: true },
    showGSTIN: { type: Boolean, default: true },
  },
  shipping: {
    showShipping: { type: Boolean, default: true },
    heading: { type: String, default: "Ship To" },
    showHeading: { type: Boolean, default: true },
    showFullName: { type: Boolean, default: true },
    showAddress1: { type: Boolean, default: true },
    showAddress2: { type: Boolean, default: false },
    showCompany: { type: Boolean, default: true },
    showCity: { type: Boolean, default: true },
    showZipPinCode: { type: Boolean, default: true },
    showState: { type: Boolean, default: true },
    showCountry: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: true },
    showPhone: { type: Boolean, default: true },
    showGSTIN: { type: Boolean, default: false },
  },
  billing: {
    showBilling: { type: Boolean, default: true },
    heading: { type: String, default: "Bill To" },
    showHeading: { type: Boolean, default: true },
    showFullName: { type: Boolean, default: true },
    showAddress1: { type: Boolean, default: true },
    showAddress2: { type: Boolean, default: false },
    showCompany: { type: Boolean, default: true },
    showCity: { type: Boolean, default: true },
    showZipPinCode: { type: Boolean, default: true },
    showState: { type: Boolean, default: true },
    showCountry: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: true },
    showPhone: { type: Boolean, default: true },
    showGSTIN: { type: Boolean, default: false },
  },
  lineItems: {
    showProductImage: { type: Boolean, default: false },
    showSKU: { type: Boolean, default: true },
    showVariantTitle: { type: Boolean, default: true },
    showQuantity: { type: Boolean, default: true },
    showHSN: { type: Boolean, default: false },
    showUnitRate: { type: Boolean, default: true },
    showTotalDiscount: { type: Boolean, default: false },
    showRateAsDiscountedPrice: { type: Boolean, default: false },
    showTaxAmount: { type: Boolean, default: true },
    showTotalPrice: { type: Boolean, default: true },
  },
  total: {
    showDiscount: { type: Boolean, default: true },
    showSubtotal: { type: Boolean, default: true },
    showShipping: { type: Boolean, default: true },
    showShippingGSTSplit: { type: Boolean, default: false },
    showRefunded: { type: Boolean, default: false },
    showTax: { type: Boolean, default: true },
    showOutstanding: { type: Boolean, default: false },
    showTotal: { type: Boolean, default: true },
  },
  footer: {
    thankYouNote: {
      type: String,
      default: "Thanks for your purchase",
    },
    footerNote: {
      type: String,
      default:
        "This is an electronically generated invoice, no signature is required",
    },
    socialNetworks: {
      showWebsite: { type: Boolean, default: false },
      showFacebook: { type: Boolean, default: false },
      showTwitter: { type: Boolean, default: false },
      showInstagram: { type: Boolean, default: false },
      showPinterest: { type: Boolean, default: false },
      showYoutube: { type: Boolean, default: false },
    },
  },
});

const InvoiceTemplate = mongoose.model(
  "InvoiceTemplate",
  InvoiceTemplateSchema
);

export default InvoiceTemplate;
