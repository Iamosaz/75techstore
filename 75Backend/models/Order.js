// 75Backend/models/Order.js
import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  condition: {
    type: String,
    enum: ['Brand New', 'UK Used', 'Refurbished'],
    default: 'Brand New'
  },
  grade: {
    type: String,
    enum: ['Grade A', 'Grade B', 'Grade C', 'N/A'],
    default: 'N/A'
  }
})

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  landmark: {
    type: String,
    default: ''
  }
})

const orderSchema = new mongoose.Schema(
  {
    // Who placed the order
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Order reference number e.g 75TECH-1234567
    orderNumber: {
      type: String,
      unique: true
    },

    // Items in the order
    items: [orderItemSchema],

    // Shipping details
    shippingAddress: shippingAddressSchema,

    // Payment
    paymentMethod: {
      type: String,
      enum: ['Paystack', 'Bank Transfer', 'Cash on Delivery'],
      default: 'Paystack'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paystackReference: {
      type: String,
      default: ''
    },

    // Pricing breakdown
    subtotal: {
      type: Number,
      required: true
    },
    shippingFee: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },

    // Order Status
    orderStatus: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
      ],
      default: 'pending'
    },

    // Tracking history - every status change is recorded
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            'pending',
            'confirmed',
            'processing',
            'shipped',
            'delivered',
            'cancelled'
          ]
        },
        message: {
          type: String,
          default: ''
        },
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // Delivery
    estimatedDelivery: {
      type: Date,
      default: null
    },
    deliveredAt: {
      type: Date,
      default: null
    },

    // Notes
    customerNote: {
      type: String,
      default: ''
    },
    adminNote: {
      type: String,
      default: ''
    },

    isCancelled: {
      type: Boolean,
      default: false
    },
    cancelReason: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

// Auto generate order number before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
    this.orderNumber = `75TECH-${timestamp}${random}`
  }
  next()
})

export const Order = mongoose.model('Order', orderSchema)