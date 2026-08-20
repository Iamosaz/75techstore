// 75Backend/models/Product.js
import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: 0,
      default: 0
    },
    // ✅ Same categories as before - no duplication
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Laptops', 'Phones', 'Tablets', 'Accessories',
        'Monitors', 'Storage', 'Networking', 'Gaming',
        'Audio', 'Cameras', 'Printers', 'Software',
        'Wearables', 'Smart Home', 'Components', 'Consoles',
        'Other'
      ]
    },
    // ✅ NEW - Condition separates UK Used from Brand New
    condition: {
      type: String,
      enum: ['Brand New', 'UK Used', 'Refurbished'],
      default: 'Brand New',
    },
    // ✅ NEW - Grade for used items
    grade: {
      type: String,
      enum: ['Grade A', 'Grade B', 'Grade C', 'N/A'],
      default: 'N/A',
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true
    },
    imageUrl: {
      type: String,
      default: ''
    },
    isFeatured:    { type: Boolean, default: false },
    isTopPick:     { type: Boolean, default: false },
    isBestSelling: { type: Boolean, default: false },
    isNewArrival:  { type: Boolean, default: false },
    isDealOfDay:   { type: Boolean, default: false },
    discount:      { type: Number,  default: 0, min: 0 },
    offerEnds:     { type: Date,    default: null },
    sold:          { type: Number,  default: 0 },
    imageSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    rating:     { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
)

export const Product = mongoose.model('Product', productSchema)