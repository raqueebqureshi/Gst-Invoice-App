import mongoose from "mongoose";
import bcrypt from "bcrypt";

const smtpSchema = new mongoose.Schema({
  shopId: { type: String, required: true, unique: true }, // Unique identifier for the store
  smtpData:{
  host: { type: String, required: true },
  port: { type: Number, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  fromEmail: { type: String, required: true },
  fromName: { type: String, required: true },
  sendByOwnEmail: { type: Boolean, default: false },
  sendByAppEmail: { type: Boolean, default: true },
  sendOnOrderPlaced: { type: Boolean, default: false },
  emailFormat: {
    subject: { type: String, default: "Download Invoice" },
    cc: { type: [String], default: [] }, // Array of email addresses for CC
    bcc: { type: [String], default: [] }, // Array of email addresses for BCC
    bodyText: {
      type: String,
      default: `Dear {{client_last_name}},

Please find the {{invoice_number}} of order created at {{order_date}}.

To download this invoice, click the following link:

{{link}}

Best regards,
{{shop_name}}`,
    },
  },
  } 
});

// Encrypt password before saving
smtpSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Instance method to match password
smtpSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const SMTPConfig = mongoose.model("SMTPConfig", smtpSchema);

export default SMTPConfig;
