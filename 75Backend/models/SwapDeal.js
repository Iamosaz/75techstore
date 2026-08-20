// 75Backend/models/SwapDeal.js
import mongoose from 'mongoose'

const swapDealSchema = new mongoose.Schema(
  {
    // ── Auto-generated Swap ID ──
    swapId: {
      type: String,
      unique: true,
    },

    // ── Customer Info ──
    customerName: {
      type: String,
      required: [true, 'Your name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'WhatsApp/Phone number is required'],
    },
    customerEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },

    // ── Their Device (What they're giving) ──
    deviceBrand: {
      type: String,
      required: [true, 'Device brand is required'],
      enum: ['iPhone', 'Samsung'],
    },
    deviceModel: {
      type: String,
      required: [true, 'Device model is required'],
      trim: true,
    },
    deviceStorage: {
      type: String,
      required: [true, 'Storage capacity is required'],
      enum: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'],
    },
    deviceCondition: {
      type: String,
      required: [true, 'Device condition is required'],
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
    },

    // ── Device Issues / Description ──
    hasRepairs: {
      type: Boolean,
      default: false,
    },
    repairDetails: {
      type: String,
      default: '',
    },
    hasChangedParts: {
      type: Boolean,
      default: false,
    },
    changedPartsDetails: {
      type: String,
      default: '',
    },

    // ── iPhone specific ──
    batteryHealth: {
      type: String,
      default: '',
    },

    // ── Media (Photos & Video) ──
    mediaUrls: [{
      type: String,
    }],

    // ── What they want ──
    wantedBrand: {
      type: String,
      required: [true, 'Please tell us what device you want'],
      enum: ['iPhone', 'Samsung', 'Open to suggestions'],
    },
    wantedModel: {
      type: String,
      default: '',
      trim: true,
    },
    wantedStorage: {
      type: String,
      default: '',
    },

    // ── Admin Management ──
    status: {
      type: String,
      enum: [
        'Pending Review',
        'Under Assessment',
        'Offer Made',
        'Offer Accepted',
        'Offer Declined',
        'Swap Completed',
        'Cancelled',
      ],
      default: 'Pending Review',
    },
    offeredValue: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    assessedBy: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

// ── Auto-generate Swap ID ──
swapDealSchema.pre('save', async function (next) {
  if (!this.swapId) {
    const count = await mongoose.model('SwapDeal').countDocuments()
    this.swapId = `75SW-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

export const SwapDeal = mongoose.model('SwapDeal', swapDealSchema)