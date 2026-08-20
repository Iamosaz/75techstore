import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: 'Not provided',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['general', 'support', 'repair', 'business', 'feedback', 'complaint'],
      default: 'general',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;