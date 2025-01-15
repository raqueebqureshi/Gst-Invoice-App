import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import nodemailer from "nodemailer";
import multer from "multer";
import SMTPConfig from "../Models/SMTPConfig.js";
// Configure AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// // Define the function to send and upload invoices
// export const sendInvoiceAndUpload = async (req, res) => {


//   try {
//     const { customerEmail, orderId } = req.body;
//     const shopDetails = JSON.parse(req.body.shopDetails);
//     const pdfBuffer = req.file.buffer;

//     console.log("shopDetails",shopDetails , "orderId",orderId, "customerEmail",customerEmail);

//     if (!customerEmail || !orderId || !shopDetails) {
//       return res.status(400).json({ error: "Missing required fields." });
//     }

//     // Upload to AWS S3
//     const s3Key = `${shopDetails.name}/invoices/${orderId}.pdf`;

//     await s3.send(
//       new PutObjectCommand({
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: s3Key,
//         Body: pdfBuffer,
//         ContentType: "application/pdf", 
//       })
//     );

//     // Configure Email
//     const smtpConfig = {
//       host: process.env.SUPPORT_EMAIL_HOST,
//       port: process.env.SUPPORT_EMAIL_PORT,
//       secure: false,
//       auth: {
//         user: process.env.SUPPORT_EMAIL,
//         pass: process.env.SUPPORT_PASSWORD,
//       },
//     };

//     const transporter = nodemailer.createTransport(smtpConfig);

//     const emailSubject = `Invoice for Order #${orderId}`;
//     const emailBody = `
//       Dear Customer,

//       Thank you for shopping with us! Please find your invoice attached.

//       Best regards,
//       Team ${shopDetails.name}
//     `;

//     // Send Email with PDF Attachment
//     await transporter.sendMail({
//       from: `"${shopDetails.name}" <${process.env.SUPPORT_EMAIL}>`,
//       to: customerEmail,
//       subject: emailSubject,
//       text: emailBody,
//       attachments: [
//         {
//           filename: `Invoice-${orderId}.pdf`,
//           content: pdfBuffer,
//         },
//       ],
//     });

//     res.status(200).json({ message: "Invoice sent successfully." });
//   } catch (error) {
//     console.error("Error sending invoice:", error);
//     res.status(500).json({ error: "Failed to send invoice." });
//   }
// };




export const sendInvoiceAndUpload = async (req, res) => {
  try {
    const { customerEmail, orderId } = req.body;
    const shopDetails = JSON.parse(req.body.shopDetails);
    const pdfBuffer = req.file.buffer;

    console.log("shopDetails", shopDetails, "orderId", orderId, "customerEmail", customerEmail);

    if (!customerEmail || !orderId || !shopDetails) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Upload to AWS S3
    const s3Key = `${shopDetails.name}/invoices/${orderId}.pdf`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3Key,
        Body: pdfBuffer,
        ContentType: "application/pdf",
      })
    );

    // Fetch SMTP Configuration
    let smtpConfig = null;

    const shopSMTPConfig = await SMTPConfig.findOne({ shopId: shopDetails.id });
    console.log("shopSMTPConfig", shopSMTPConfig);
    if(!shopSMTPConfig) {
      return res.status(400).json({ error: "SMTP configuration not found." });
    }

    if (shopSMTPConfig.smtpData.sendByOwnEmail) {
      console.log("Using shop's own email settings");

      smtpConfig = {
        host: shopSMTPConfig.smtpData.host,
        port: shopSMTPConfig.smtpData.port,
        secure: false, // Set to true if using a secure connection
        auth: {
          user: shopSMTPConfig.smtpData.username,
          pass: shopSMTPConfig.smtpData.password, // No encryption, plain text
        },
      };
    } else {
      console.log("Using app default email settings");

      smtpConfig = {
        host: process.env.SUPPORT_EMAIL_HOST,
        port: process.env.SUPPORT_EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.SUPPORT_EMAIL,
          pass: process.env.SUPPORT_PASSWORD,
        },
      };
    }

    // Configure Nodemailer
    const transporter = nodemailer.createTransport(smtpConfig);

    const emailSubject = `Invoice for Order #${orderId}`;
    const emailBody = `
      Dear Customer,

      Thank you for shopping with us! Please find your invoice attached.

      Best regards,
      Team ${shopDetails.name}
    `;

    // Send Email with PDF Attachment
    await transporter.sendMail({
      from: `"${shopDetails.name}" <${smtpConfig.auth.user}>`,
      to: customerEmail,
      subject: emailSubject,
      text: emailBody,
      attachments: [
        {
          filename: `Invoice-${orderId}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    res.status(200).json({ message: "Invoice sent successfully." });
  } catch (error) {
    console.error("Error sending invoice:", error);
    res.status(500).json({ error: "Failed to send invoice." });
  }
};

// Multer middleware export
export const uploadMiddleware = upload.single("file");
