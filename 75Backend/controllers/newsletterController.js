// 75Backend/controllers/newsletterController.js
import Newsletter from '../models/Newsletter.js';
import axios from 'axios';

/* ─────────────────────────────────────────
   Send email helper — same as orderController
───────────────────────────────────────── */
const sendEmail = async ({ to, toName, subject, html }) => {
  try {
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name:  '75TechStore',
          email: '75techstore@gmail.com',
        },
        to: [{ email: to, name: toName || to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          'api-key':      process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    )
    console.log(`✅ Email sent to ${to}`)
  } catch (error) {
    console.error('❌ Brevo email error:', error?.response?.data || error.message)
  }
}

/* ─────────────────────────────────────────
   Welcome email HTML
───────────────────────────────────────── */
const welcomeHtml = (subscriberEmail) => `
  <!DOCTYPE html>
  <html>
    <head><meta charset="utf-8" /></head>
    <body style="margin:0;padding:0;background:#f9fafb;
      font-family:Arial,sans-serif;">

      <div style="max-width:600px;margin:20px auto;
        background:#ffffff;border-radius:8px;
        overflow:hidden;border:1px solid #e0e0e0">

        <!-- Header -->
        <div style="background:#1d4ed8;padding:20px;
          border-radius:8px 8px 0 0">
          <h1 style="color:white;margin:0;font-size:22px">
            🎉 Welcome to 75TechStore Newsletter!
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:20px;background:#f9fafb;">
          <h2 style="color:#374151">
            You are officially subscribed! 🎉
          </h2>
          <p style="color:#6b7280;">
            Thank you for joining 75TechStore.
            Here is what you will get:
          </p>

          <div style="background:white;padding:16px;
            border-radius:8px;border:1px solid #e0e0e0;
            margin:16px 0;">
            <p style="color:#374151;margin:0 0 10px;">
              🔥 Exclusive deals &amp; flash sales
            </p>
            <p style="color:#374151;margin:0 0 10px;">
              📱 New product launch alerts
            </p>
            <p style="color:#374151;margin:0 0 10px;">
              🔧 Tech tips &amp; repair guides
            </p>
            <p style="color:#374151;margin:0;">
              🎁 Members-only discounts
            </p>
          </div>

          <div style="text-align:center;margin:24px 0;">
            <a href="https://75techstore.com.ng/shop"
              style="display:inline-block;background:#1d4ed8;
              color:#fff;text-decoration:none;
              padding:14px 32px;border-radius:8px;
              font-weight:700;font-size:15px;">
              Shop Now →
            </a>
          </div>

          <p style="color:#9ca3af;font-size:12px;
            text-align:center;">
            Do not want these emails?
            <a href="https://75techstore.com.ng/unsubscribe?email=${encodeURIComponent(subscriberEmail)}"
              style="color:#1d4ed8;">
              Unsubscribe here
            </a>
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#1d4ed8;padding:16px;
          border-radius:0 0 8px 8px;text-align:center;">
          <p style="color:white;margin:0;font-size:14px;">
            Thank you for joining
            <strong>75TechStore</strong>!
          </p>
          <p style="color:#bfdbfe;margin:4px 0;font-size:12px;">
            75techstore@gmail.com · +234 703 562 0709
          </p>
        </div>

      </div>
    </body>
  </html>
`

/* ─────────────────────────────────────────
   Owner notification HTML
───────────────────────────────────────── */
const ownerHtml = (subscriberEmail) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">

    <div style="background:#1d4ed8;padding:20px;border-radius:8px 8px 0 0">
      <h1 style="color:white;margin:0;font-size:22px">
        📬 New Newsletter Subscriber!
      </h1>
    </div>

    <div style="padding:20px;background:#f9fafb;border:1px solid #e0e0e0">
      <table style="border-collapse:collapse;width:100%;background:white">
        <tr style="background:#1d4ed8;color:white">
          <th style="padding:10px;text-align:left;width:120px">Field</th>
          <th style="padding:10px;text-align:left">Details</th>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e0e0e0;
            color:#6b7280;font-weight:600;">Email</td>
          <td style="padding:10px;border:1px solid #e0e0e0;
            font-weight:700;">${subscriberEmail}</td>
        </tr>
        <tr style="background:#f9fafb;">
          <td style="padding:10px;border:1px solid #e0e0e0;
            color:#6b7280;font-weight:600;">Time</td>
          <td style="padding:10px;border:1px solid #e0e0e0;">
            ${new Date().toLocaleString('en-NG', {
              timeZone:  'Africa/Lagos',
              dateStyle: 'full',
              timeStyle: 'short',
            })}
          </td>
        </tr>
      </table>

      <div style="margin-top:16px;padding:14px;
        background:#dbeafe;border-radius:8px;">
        <p style="margin:0;color:#1d4ed8;font-size:13px;
          font-weight:600;">
          💡 View all subscribers in your MongoDB or admin panel.
        </p>
      </div>
    </div>

    <div style="background:#1d4ed8;padding:12px;
      border-radius:0 0 8px 8px;text-align:center">
      <p style="color:white;margin:0;font-size:12px">
        75TechStore Admin Notification
      </p>
    </div>

  </div>
`

/* ═══════════════════════════════════════════
   POST /api/newsletter/subscribe
═══════════════════════════════════════════ */
export const subscribe = async (req, res) => {
  const { email } = req.body

  /* ── 1. Validate ── */
  if (!email || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Email address is required.',
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.',
    })
  }

  try {
    /* ── 2. Check duplicate ── */
    const existing = await Newsletter.findOne({
      email: email.trim().toLowerCase(),
    })

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed. Thank you!',
      })
    }

    /* ── 3. Save to MongoDB ── */
    const subscriber = await Newsletter.create({
      email: email.trim().toLowerCase(),
    })

    /* ── 4. Send welcome email to subscriber ── */
    await sendEmail({
      to:      email.trim(),
      toName:  email.trim(),
      subject: '🎉 Welcome to 75TechStore Newsletter!',
      html:    welcomeHtml(email.trim()),
    })

    /* ── 5. Notify store owner ── */
    await sendEmail({
      to:      '75techstore@gmail.com',
      toName:  '75TechStore Admin',
      subject: '📬 New Newsletter Subscriber — 75TechStore',
      html:    ownerHtml(email.trim()),
    })

    /* ── 6. Respond ── */
    return res.status(201).json({
      success: true,
      message: 'Successfully subscribed! Check your inbox.',
      data: { email: subscriber.email },
    })

  } catch (error) {
    console.error('❌ Newsletter error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    })
  }
}