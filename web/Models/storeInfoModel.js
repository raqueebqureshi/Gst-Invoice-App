import mongoose from "mongoose";

const StoreProfileSchema = new mongoose.Schema({
  storeDomain: { type: String, required: true, unique: true }, // Unique store domain
  email: { type: String, required: true }, // Store email
  shopId: { type: String, required: true }, // Store ID
  dateOfInstall: { type: Date, default: Date.now }, // Installation date
  previousOrderMonthCount: { type: Number, default: 0 }, // Previous order month count, can be changed

  storeProfile: {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    brandColor: { type: String, default: "#000000" }, // Default brand color
    invoiceNumber: { type: Number, default: 1001 }, // Start invoice number from 1001
    invoicePrefix: { type: String, default: "INV-25-26" }, // Default prefix
    brandName: { type: String, default: "" },
    phone: { type: String, default: "" },
    storeEmail: { type: String, default: "" },
    websiteURL: { type: String, default: "" },
    gstNumber: { type: String, default: "" },
  },

  images: {
    logoURL: { type: String, default: "" }, // Logo URL
    signatureURL: { type: String, default: "" }, // Signature URL
  },

  addresses: {
    address: { type: String, default: "" },
    apartment: { type: String, default: "" },
    city: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    country: { type: String, default: "" },
  },

  socialLinks: {
    facebookURL: { type: String, default: "" },
    xURL: { type: String, default: "" },
    instagramURL: { type: String, default: "" },
    pinterestURL: { type: String, default: "" },
    youtubeURL: { type: String, default: "" },
  },

  plans: {
    planId: { type: Number, default: 0 }, // Default plan ID 0 for free 1 for pro and 2 for business
    planStartDate: { type: Date, default: null }, // Plan start date
  },

  stats: {
    totalInvoiceDownload: { type: Number, default: 0 }, // Total invoice downloads
    totalInvoicePrint: { type: Number, default: 0 }, // Total invoice prints
    totalInvoiceSent: { type: Number, default: 0 }, // Total invoices sent
  },
  taxes: {
    isAppTax: { type: Boolean, default: false },
    tax_includedOnProduct: { type: Boolean, default: true },
  }
});

// Create the model
const StoreProfile =
  mongoose.models.StoreProfile ||
  mongoose.model("StoreProfile", StoreProfileSchema);

export default StoreProfile;
