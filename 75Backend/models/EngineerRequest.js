// 75Backend/models/EngineerRequest.js
import mongoose from 'mongoose'

const engineerRequestSchema = new mongoose.Schema(
  {
    // ✅ Links to your existing User model
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gadgetType: {
      type: String,
      required: [true, 'Gadget type is required'],
      enum: ['Laptop', 'Desktop', 'Smartphone', 'Tablet',
             'Printer', 'Networking', 'Other'],
    },
    brand: {
      type: String,
      required: [true, 'Device brand is required'],
      trim: true,
    },
    issueDescription: {
      type: String,
      required: [true, 'Please describe the issue'],
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    assignedEngineerName: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

export const EngineerRequest = mongoose.model('EngineerRequest', engineerRequestSchema)