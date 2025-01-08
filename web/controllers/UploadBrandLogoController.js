// Import required modules
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const uuid = require("uuid").v4;

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Logo API
const uploadLogo = async (req, res) => {
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


module.exports = { uploadLogo };
