import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import nodemailer from "nodemailer";
import multer from "multer";

// Configure AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Define the function to send and upload invoices
export const sendInvoiceAndUpload = async (req, res) => {
  try {
    const { customerEmail, orderId, storeDetails } = req.body;
    const pdfBuffer = req.file.buffer;

    if (!customerEmail || !orderId || !storeDetails) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Upload to AWS S3
    const s3Key = `${storeDetails.name}/invoices/${orderId}.pdf`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3Key,
        Body: pdfBuffer,
        ContentType: "application/pdf",
      })
    );

    // Configure Email
    const smtpConfig = {
      host: process.env.SUPPORT_EMAIL_HOST,
      port: process.env.SUPPORT_EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    const emailSubject = `Invoice for Order #${orderId}`;
    const emailBody = `
      Dear Customer,

      Thank you for shopping with us! Please find your invoice attached.

      Best regards,
      ${storeDetails}
    `;

    // Send Email with PDF Attachment
    await transporter.sendMail({
      from: `"${storeDetails}" <${process.env.SUPPORT_EMAIL}>`,
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
