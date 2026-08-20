// 75Backend/models/DigitalProject.js
import mongoose from 'mongoose'

const digitalProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
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
    imageUrl: {
      type: String,
      required: [true, 'Project screenshot is required'],
    },
    liveUrl: {
      type: String,
      default: '',
    },
    techUsed: [{
      type: String,
      trim: true,
    }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export const DigitalProject = mongoose.model('DigitalProject', digitalProjectSchema)