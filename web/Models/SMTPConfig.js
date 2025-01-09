import mongoose from "mongoose";
import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();

const smtpSchema = new mongoose.Schema({
  shopId: { type: String, required: true, unique: true },
  smtpData: {
    host: { type: String, required: true },
    port: { type: Number, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }, // Encrypted password
    fromEmail: { type: String, required: true },
    fromName: { type: String, required: true },
    sendByOwnEmail: { type: Boolean, default: false },
    sendByAppEmail: { type: Boolean, default: true },
    sendOnOrderPlaced: { type: Boolean, default: false },
    emailFormat: {
      subject: { type: String, default: "Download Invoice" },
      cc: { type: [String], default: [] },
      bcc: { type: [String], default: [] },
      bodyText: {
        type: String,
        default: `Dear {{client_last_name}},\n\nPlease find the {{invoice_number}}.`,
      },
    },
  },
});

// Encrypt password before saving
smtpSchema.pre("save", function (next) {
  const algorithm = "aes-256-cbc";
  const secretKey = process.env.ENCRYPTION_SECRET_KEY;
  const iv = crypto.randomBytes(16);

  if (!secretKey || secretKey.length !== 32) {
    return next(new Error("Invalid ENCRYPTION_SECRET_KEY length. Must be 32 characters. ", secretKey.length));
  }

  if (this.isModified("smtpData.password")) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(this.smtpData.password, "utf8", "hex");
    encrypted += cipher.final("hex");
    this.smtpData.password = `${iv.toString("hex")}:${encrypted}`;
  }
  next();
});


const SMTPConfig = mongoose.model("SMTPConfig", smtpSchema);

export default SMTPConfig;
