// 75Backend/models/ClientReview.js
import mongoose from 'mongoose'

const clientReviewSchema = new mongoose.Schema(
  {
    // ── Who submitted ──
    clientName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    clientEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    businessName: {
      type: String,
      default: '',
      trim: true,
    },

    // ── Review content ──
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
    },
    serviceUsed: {
      type: String,
      required: [true, 'Service used is required'],
      enum: [
        'Website Development',
        'Website Management',
        'App Development',
        'SEO Services',
        'UI/UX Design',
        'Digital Marketing',
        'Cloud & Hosting',
        'Cybersecurity',
        'Other',
      ],
    },

    // ── Admin moderation ──
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    adminResponse: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

export const ClientReview = mongoose.model('ClientReview', clientReviewSchema)