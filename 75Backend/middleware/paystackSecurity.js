// 75Backend/middleware/paystackSecurity.js
import crypto from "crypto";
import { securityLog } from "./securityLogger.js";

// ═══════════════════════════════════════════════════════════
// PAYSTACK WEBHOOK SIGNATURE VERIFICATION
// Prevents hackers from faking successful payment notifications
// ═══════════════════════════════════════════════════════════
export function verifyPaystackSignature(req, res, next) {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    securityLog.critical("MISSING_PAYSTACK_SECRET", { ip: req.ip });
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  const signature = req.headers["x-paystack-signature"];

  if (!signature) {
    securityLog.critical("PAYSTACK_NO_SIGNATURE", { ip: req.ip });
    return res.status(401).json({ error: "No signature provided" });
  }

  const rawBody =
    typeof req.body === "string" ? req.body : JSON.stringify(req.body);

  const computedHash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  // Timing-safe comparison (prevents timing attacks)
  const isValid = crypto.timingSafeEqual(
    Buffer.from(computedHash, "hex"),
    Buffer.from(signature, "hex")
  );

  if (!isValid) {
    securityLog.critical("PAYSTACK_INVALID_SIGNATURE", {
      ip: req.ip,
      expected: computedHash.substring(0, 20) + "...",
      received: signature.substring(0, 20) + "...",
    });
    return res.status(401).json({ error: "Invalid signature" });
  }

  next();
}

// ═══════════════════════════════════════════════════════════
// VERIFY TRANSACTION DIRECTLY WITH PAYSTACK API
// Call this BEFORE delivering any product
// ═══════════════════════════════════════════════════════════
export async function verifyTransactionWithPaystack(reference) {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!data.status) {
      securityLog.warning("PAYSTACK_VERIFY_FAILED", { reference });
      return { verified: false, reason: "Paystack API error" };
    }

    if (data.data.status !== "success") {
      securityLog.warning("PAYSTACK_PAYMENT_NOT_SUCCESS", {
        reference,
        status: data.data.status,
      });
      return { verified: false, reason: `Payment status: ${data.data.status}` };
    }

    return {
      verified: true,
      amount: data.data.amount / 100,
      currency: data.data.currency,
      customerEmail: data.data.customer?.email,
      reference: data.data.reference,
      gatewayResponse: data.data.gateway_response,
      paidAt: data.data.paid_at,
      channel: data.data.channel,
    };
  } catch (err) {
    securityLog.critical("PAYSTACK_VERIFY_ERROR", {
      reference,
      error: err.message,
    });
    return { verified: false, reason: "Verification service unavailable" };
  }
}

// ═══════════════════════════════════════════════════════════
// AMOUNT TAMPERING DETECTION
// Compares what customer paid vs what order actually costs
// ═══════════════════════════════════════════════════════════
export function verifyPaymentAmount(paidAmountKobo, expectedAmountNaira) {
  const expectedKobo = Math.round(expectedAmountNaira * 100);
  const tolerance = 100; // Allow ₦1 tolerance for rounding

  if (Math.abs(paidAmountKobo - expectedKobo) > tolerance) {
    securityLog.critical("AMOUNT_TAMPERING_DETECTED", {
      expected: `₦${expectedAmountNaira}`,
      paid: `₦${paidAmountKobo / 100}`,
      difference: `₦${Math.abs(paidAmountKobo - expectedKobo) / 100}`,
    });
    return false;
  }

  return true;
}

// ═══════════════════════════════════════════════════════════
// DUPLICATE PAYMENT DETECTION
// Prevents processing the same webhook twice
// ═══════════════════════════════════════════════════════════
const processedReferences = new Map();

export function isDuplicatePayment(reference) {
  if (processedReferences.has(reference)) {
    securityLog.warning("DUPLICATE_PAYMENT_ATTEMPT", { reference });
    return true;
  }

  processedReferences.set(reference, Date.now());

  // Clean old entries (older than 24 hours)
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  for (const [ref, time] of processedReferences) {
    if (time < oneDayAgo) processedReferences.delete(ref);
  }

  return false;
}