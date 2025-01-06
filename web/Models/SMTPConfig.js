// models/SMTPConfig.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const smtpSchema = new mongoose.Schema({
  host: { type: String, required: true },
  port: { type: Number, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  fromEmail: { type: String, required: true },
  fromName: { type: String, required: true },
  enabled: { type: Boolean, default: false },
});

// Encrypt password before saving
smtpSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Instance method to match password
smtpSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const SMTPConfig = mongoose.model(
    'SMTPConfig', smtpSchema
);

export default SMTPConfig;