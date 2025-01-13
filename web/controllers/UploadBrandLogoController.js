// Import required modules
import dotenv from "dotenv";
import multer from "multer";
import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";


import StoreProfile from "../Models/storeInfoModel.js";
// Configure AWS S3
// Load environment variables
dotenv.config();

// Use uuidv4 for generating unique IDs

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });
// const uuid = require("uuid").v4;

// Upload Logo API
export const uploadLogo = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "File is required." });
    }

    // Generate unique file path for the logo
    const fileName = `Shopify_Invoice_App_Logos/${uuid()}-${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Upload the logo to S3
    console.log(`Uploading logo to S3: ${fileName}`);
    const data = await s3.upload(params).promise();

    // Respond with the uploaded logo URL
    res.status(200).json({
      success: true,
      message: "Logo uploaded successfully.",
      logoURL: data.Location,
    });
  } catch (err) {
    console.error("Error during upload process:", err);
    res.status(500).json({ success: false, message: "Error uploading logo." });
  }
};

// Remove Logo API
export async function removeLogo(req, res) {
    try {
      const { shopId } = req.body; // Ensure shopId is sent in the request body
  
      // Validate required fields
      if (!shopId) {
        return res.status(400).json({ success: false, message: "Shop ID is required." });
      }
  
      // Fetch the store profile by shopId
      const storeProfile = await StoreProfile.findOne({ shopId });
      if (!storeProfile || !storeProfile.images?.logoURL) {
        return res
          .status(404)
          .json({ success: false, message: "Store profile or logo not found." });
      }
  
      // Extract the old logo key
      const logoKey = storeProfile.images.logoURL.split('/').slice(-2).join('/');
      console.log(`Deleting logo: ${logoKey}`);
  
      // Delete the logo from S3
      await s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: logoKey }).promise();
  
      // Remove the logo URL from the database
      storeProfile.images.logoURL = ""; // Or set it to an empty string
      await storeProfile.save();
  
      // Respond with success message
      res.status(200).json({ success: true, message: "Logo removed successfully." });
    } catch (err) {
      console.error("Error during logo deletion process:", err);
      res.status(500).json({ success: false, message: "Error removing logo." });
    }
  }



// Upload Signature API
export const uploadSignature = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "File is required." });
    }

    // Generate unique file path for the signature
    const fileName = `Shopify_Invoice_App_Signatures/${uuid()}-${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    // Upload the signature to S3
    console.log(`Uploading signature to S3: ${fileName}`);
    const data = await s3.upload(params).promise();

    // Respond with the uploaded signature URL
    res.status(200).json({
      success: true,
      message: "Signature uploaded successfully.",
      signatureURL: data.Location,
    });
  } catch (err) {
    console.error("Error during signature upload process:", err);
    res.status(500).json({ success: false, message: "Error uploading signature." });
  }
};




// Remove Signature API
export const removeSignature = async (req, res) => {
  try {
    const { shopId } = req.body; // Ensure shopId is sent in the request body

    // Validate required fields
    if (!shopId) {
      return res.status(400).json({ success: false, message: "Shop ID is required." });
    }

    // Fetch the store profile by shopId
    const storeProfile = await StoreProfile.findOne({ shopId });
    if (!storeProfile || !storeProfile.images?.signatureURL) {
      return res
        .status(404)
        .json({ success: false, message: "Store profile or signature not found." });
    }

    // Extract the old signature key
    const signatureKey = storeProfile.images.signatureURL.split('/').slice(-2).join('/');
    console.log(`Deleting signature: ${signatureKey}`);

    // Delete the signature from S3
    await s3.deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: signatureKey }).promise();

    // Remove the signature URL from the database
    storeProfile.images.signatureURL = ""; // Or set it to an empty string
    await storeProfile.save();

    // Respond with success message
    res.status(200).json({ success: true, message: "Signature removed successfully." });
  } catch (err) {
    console.error("Error during signature deletion process:", err);
    res.status(500).json({ success: false, message: "Error removing signature." });
  }
};