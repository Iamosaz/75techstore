import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tier: {
      type: String,
      enum: ['silver', 'gold', 'platinum'],
      required: true,
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    paystackReference: {
      type: String,
      required: true,
      unique: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Membership = mongoose.model('Membership', membershipSchema);
export default Membership;