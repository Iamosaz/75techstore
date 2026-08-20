// 75Backend/controllers/membershipController.js
import Membership from '../models/Membership.js';
import User from '../models/User.js';
import axios from 'axios';

const TIER_PRICING = {
  silver:   { monthly: 2000,  yearly: 20000 },
  gold:     { monthly: 5000,  yearly: 50000 },
  platinum: { monthly: 10000, yearly: 100000 },
};

/* ─────────────────────────────────────────
   1. Initialize Paystack Payment
   POST /api/membership/initialize
───────────────────────────────────────── */
export const initializePayment = async (req, res) => {
  try {
    const { tier, billingCycle } = req.body;

    if (!tier || !TIER_PRICING[tier]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected.',
      });
    }

    const selectedCycle = billingCycle === 'yearly' ? 'yearly' : 'monthly';
    const amount = TIER_PRICING[tier][selectedCycle];
    const amountInKobo = amount * 100;

    // req.user is supplied directly by your protect middleware
    const user = req.user;

    const paystackRes = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: user.email,
        amount: amountInKobo,
        metadata: {
          userId: user._id.toString(),
          tier,
          billingCycle: selectedCycle,
          type: 'membership',
        },
        callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/membership/verify`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (paystackRes.data?.status && paystackRes.data?.data?.authorization_url) {
      return res.status(200).json({
        success: true,
        data: {
          authorizationUrl: paystackRes.data.data.authorization_url,
          reference: paystackRes.data.data.reference,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Failed to initialize Paystack checkout.',
      });
    }
  } catch (error) {
    console.error('❌ Paystack Init Error:', error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: error?.response?.data?.message || 'Payment initialization failed.',
    });
  }
};

/* ─────────────────────────────────────────
   2. Verify Paystack Payment
   GET /api/membership/verify/:reference
───────────────────────────────────────── */
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = paystackRes.data?.data;

    if (paymentData?.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Transaction failed on Paystack.',
      });
    }

    const { tier, billingCycle, userId } = paymentData.metadata;
    const amountPaid = paymentData.amount / 100;

    let membership = await Membership.findOne({ paystackReference: reference });
    if (membership) {
      return res.status(200).json({
        success: true,
        message: 'Membership already active.',
        data: membership,
      });
    }

    const startDate = new Date();
    const expiryDate = new Date();
    if (billingCycle === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    }

    membership = await Membership.create({
      user: userId,
      tier,
      billingCycle,
      amountPaid,
      paystackReference: reference,
      paymentStatus: 'paid',
      status: 'active',
      startDate,
      expiryDate,
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        membershipTier: tier,
        membershipExpiry: expiryDate,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'VIP Membership successfully activated!',
      data: {
        membership,
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
          membershipTier: updatedUser.membershipTier,
          membershipExpiry: updatedUser.membershipExpiry,
        },
      },
    });
  } catch (error) {
    console.error('❌ Verification Error:', error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify transaction with Paystack.',
    });
  }
};

/* ─────────────────────────────────────────
   3. Get Current Membership
   GET /api/membership/my-membership
───────────────────────────────────────── */
export const getMyMembership = async (req, res) => {
  try {
    const membership = await Membership.findOne({
      user: req.user._id,
      status: 'active',
    }).sort({ createdAt: -1 });

    if (!membership) {
      return res.status(200).json({ success: true, hasMembership: false });
    }

    if (new Date() > membership.expiryDate) {
      membership.status = 'expired';
      await membership.save();
      await User.findByIdAndUpdate(req.user._id, { membershipTier: 'none' });
      return res.status(200).json({ success: true, hasMembership: false, message: 'Expired' });
    }

    return res.status(200).json({ success: true, hasMembership: true, data: membership });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};