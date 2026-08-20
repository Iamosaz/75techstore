// 75Backend/models/RepairBooking.js
import mongoose from 'mongoose'

const repairBookingSchema = new mongoose.Schema(
  {
    // ── Auto-generated Repair Tracking ID ──
    repairId: {
      type: String,
      unique: true,
    },

    // ── Customer Info (no login required) ──
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Phone number is required'],
    },

    // ── Device Info ──
    deviceType: {
      type: String,
      required: [true, 'Device type is required'],
      enum: [
        'Smartphone', 'Laptop', 'Desktop', 'Tablet',
        'Gaming Console', 'Smartwatch', 'Monitor',
        'Printer', 'Other'
      ],
    },
    deviceBrand: {
      type: String,
      required: [true, 'Device brand is required'],
      trim: true,
    },
    deviceModel: {
      type: String,
      default: '',
      trim: true,
    },
    issueCategory: {
      type: String,
      required: [true, 'Issue category is required'],
      enum: [
        'Screen/Display', 'Battery', 'Charging Port',
        'Software/OS', 'Motherboard', 'Keyboard',
        'Water Damage', 'Speaker/Mic', 'Camera',
        'Storage/RAM Upgrade', 'Virus Removal',
        'Data Recovery', 'General Diagnosis', 'Other'
      ],
    },
    issueDescription: {
      type: String,
      required: [true, 'Please describe the issue'],
    },

    // ── Drop-off Method ──
    dropOffMethod: {
      type: String,
      enum: ['Walk-in', 'Dispatch'],
      default: 'Walk-in',
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred date is required'],
    },
    preferredTime: {
      type: String,
      required: [true, 'Preferred time is required'],
      enum: [
        '9:00 AM - 10:00 AM',
        '10:00 AM - 11:00 AM',
        '11:00 AM - 12:00 PM',
        '12:00 PM - 1:00 PM',
        '1:00 PM - 2:00 PM',
        '2:00 PM - 3:00 PM',
        '3:00 PM - 4:00 PM',
        '4:00 PM - 5:00 PM',
      ],
    },
    dispatchAddress: {
      type: String,
      default: '',
    },

    // ── Repair Status (Admin manages) ──
    status: {
      type: String,
      enum: [
        'Booked',
        'Device Received',
        'Diagnosing',
        'Awaiting Parts',
        'Repairing',
        'Testing',
        'Ready for Pickup',
        'Completed',
        'Cancelled',
      ],
      default: 'Booked',
    },

    // ── Admin Fields ──
    diagnosisNotes: {
      type: String,
      default: '',
    },
    estimatedCost: {
      type: String,
      default: '',
    },
    assignedTechnician: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

// ── Auto-generate repair ID before saving ──
repairBookingSchema.pre('save', async function (next) {
  if (!this.repairId) {
    const count = await mongoose.model('RepairBooking').countDocuments()
    const num = String(count + 1).padStart(4, '0')
    this.repairId = `75TR-${num}`
  }
  next()
})

export const RepairBooking = mongoose.model('RepairBooking', repairBookingSchema)