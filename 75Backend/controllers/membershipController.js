// 75Backend/controllers/membershipController.js
import axios from 'axios';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Tier prices in Naira (monthly / yearly)
const TIER_PRICES = {
  silver: { monthly: 3000, yearly: 36000 },
  gold: { monthly: 5000, yearly: 50000 },
  platinum: { monthly: 10000, yearly: 100000 }
};

// ══════════════════════════════════════════════════════════
// 💳 1. INITIALIZE MEMBERSHIP PAYMENT
// ══════════════════════════════════════════════════════════
export const initializeMembershipPayment = async (req, res) => {
  try {
    const { tier, billingCycle = 'monthly', email } = req.body;

    const normalizedTier = tier?.toLowerCase();
    const cycle = billingCycle === 'yearly' ? 'yearly' : 'monthly';
    const amount = TIER_PRICES[normalizedTier]?.[cycle];

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Invalid membership tier selected.'
      });
    }

    const customerEmail = email || req.user?.email;
    if (!customerEmail) {
      return res.status(400).json({
        success: false,
        message: 'Customer email is required. Please log in first.'
      });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.error('❌ PAYSTACK_SECRET_KEY is missing in backend .env');
      return res.status(500).json({
        success: false,
        message: 'Paystack Secret Key is not configured on backend.'
      });
    }

    const amountInKobo = amount * 100;
    const clientRedirectUrl =
      process.env.FRONTEND_URL
        ? `${process.env.FRONTEND_URL}/membership-verify`
        : 'http://localhost:5173/membership-verify';

    // Only store userId if it is a valid MongoDB ObjectId
    const validUserId = req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)
      ? req.user._id.toString()
      : null;

    const paystackResponse = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: customerEmail,
        amount: amountInKobo,
        callback_url: clientRedirectUrl,
        metadata: {
          membershipTier: normalizedTier,
          billingCycle: cycle,
          userId: validUserId,
          custom_fields: [
            {
              display_name: 'Membership Plan',
              variable_name: 'membership_plan',
              value: `${normalizedTier.toUpperCase()} VIP (${cycle})`
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        authorizationUrl: paystackResponse.data.data.authorization_url,
        authorization_url: paystackResponse.data.data.authorization_url,
        accessCode: paystackResponse.data.data.access_code,
        reference: paystackResponse.data.data.reference
      }
    });
  } catch (error) {
    console.error('❌ Membership Init Error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to initialize payment.'
    });
  }
};

// ══════════════════════════════════════════════════════════
// 🔍 2. VERIFY MEMBERSHIP PAYMENT (Hardened & Bug-Free)
// ══════════════════════════════════════════════════════════
export const verifyMembershipPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Transaction reference is required.'
      });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      console.error('❌ PAYSTACK_SECRET_KEY is missing in backend .env');
      return res.status(500).json({
        success: false,
        message: 'Paystack Secret Key is missing in backend configuration.'
      });
    }

    // Call Paystack API to verify reference
    let paystackResponse;
    try {
      paystackResponse = await axios.get(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          headers: {
            Authorization: `Bearer ${paystackSecret}`
          }
        }
      );
    } catch (paystackErr) {
      console.error('❌ Paystack Verification API Error:', paystackErr.response?.data || paystackErr.message);
      return res.status(400).json({
        success: false,
        message: paystackErr.response?.data?.message || 'Paystack could not find or verify this transaction reference.'
      });
    }

    const data = paystackResponse.data.data;

    if (data.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: `Transaction status is '${data.status}', payment was not successful.`
      });
    }

    const tier = (data.metadata?.membershipTier || 'gold').toLowerCase();
    const cycle = (data.metadata?.billingCycle || 'monthly').toLowerCase();
    const rawUserId = data.metadata?.userId;
    const customerEmail = data.customer?.email;

    // Calculate expiry date: 30 days for monthly, 365 days for yearly
    const expiryDate = new Date();
    if (cycle === 'yearly') {
      expiryDate.setDate(expiryDate.getDate() + 365);
    } else {
      expiryDate.setDate(expiryDate.getDate() + 30);
    }

    let updatedUser = null;

    // 🛡️ Safe User Update: Check ObjectId validity first
    if (rawUserId && rawUserId !== 'null' && rawUserId !== 'undefined' && mongoose.Types.ObjectId.isValid(rawUserId)) {
      try {
        updatedUser = await User.findByIdAndUpdate(
          rawUserId,
          {
            membershipTier: tier,
            membershipExpiry: expiryDate,
            membershipBillingCycle: cycle
          },
          { new: true }
        ).select('-password');
      } catch (err) {
        console.warn('⚠️ User lookup by ID failed, falling back to email:', err.message);
      }
    }

    // Fallback: lookup by case-insensitive email if ID wasn't found
    if (!updatedUser && customerEmail) {
      try {
        updatedUser = await User.findOneAndUpdate(
          { email: new RegExp(`^${customerEmail.trim()}$`, 'i') },
          {
            membershipTier: tier,
            membershipExpiry: expiryDate,
            membershipBillingCycle: cycle
          },
          { new: true }
        ).select('-password');
      } catch (err) {
        console.warn('⚠️ User lookup by email failed:', err.message);
      }
    }

    console.log(`✅ Membership verified successfully for: ${customerEmail || rawUserId} (${tier.toUpperCase()} VIP)`);

    return res.status(200).json({
      success: true,
      message: `🎉 Payment confirmed! Your ${tier.toUpperCase()} VIP membership is now active.`,
      data: {
        reference: data.reference,
        amount: data.amount / 100,
        membershipTier: tier,
        membershipExpiry: expiryDate,
        billingCycle: cycle,
        user: updatedUser || {
          name: customerEmail?.split('@')[0] || 'VIP Member',
          email: customerEmail,
          membershipTier: tier,
          membershipExpiry: expiryDate
        }
      }
    });
  } catch (error) {
    console.error('❌ Unexpected Membership Verify Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'An unexpected error occurred during payment verification.'
    });
  }
};

// ══════════════════════════════════════════════════════════
// 👤 3. GET CURRENT USER'S MEMBERSHIP
// ═══════════════════════════════════════════════════
export const getMyMembership = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.'
      });
    }

    const user = await User.findById(req.user._id).select(
      'membershipTier membershipExpiry membershipBillingCycle'
    );

    if (!user || !user.membershipTier) {
      return res.status(200).json({
        success: true,
        hasMembership: false,
        message: 'No active membership.'
      });
    }

    const isActive = user.membershipExpiry && new Date(user.membershipExpiry) > new Date();

    return res.status(200).json({
      success: true,
      hasMembership: isActive,
      data: {
        tier: user.membershipTier,
        expiry: user.membershipExpiry,
        billingCycle: user.membershipBillingCycle || 'monthly',
        isActive
      }
    });
  } catch (error) {
    console.error('Get membership error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch membership data.'
    });
  }
};