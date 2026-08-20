// 75Backend/controllers/contactController.js
import ContactMessage from '../models/ContactMessage.js';
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
   Auto-reply HTML to customer
───────────────────────────────────────── */
const autoReplyHtml = ({ name, subject, category, message }) => `
  <!DOCTYPE html>
  <html>
    <head><meta charset="utf-8" /></head>
    <body style="margin:0;padding:0;background:#f8fafc;
      font-family:Arial,sans-serif;">

      <div style="max-width:600px;margin:20px auto;
        background:#ffffff;border-radius:8px;
        overflow:hidden;border:1px solid #e0e0e0">

        <!-- Header -->
        <div style="background:#1d4ed8;padding:20px;
          border-radius:8px 8px 0 0">
          <h1 style="color:white;margin:0;font-size:22px">
            ✅ Message Received — 75TechStore
          </h1>
        </div>

        <!-- Body -->
        <div style="padding:20px;background:#f9fafb;">
          <h2 style="color:#374151">Hi ${name}! 👋</h2>
          <p style="color:#6b7280">
            Thank you for contacting 75TechStore.
            We have received your message and will
            get back to you within
            <strong>24 hours</strong>.
          </p>

          <!-- Message Summary -->
          <div style="background:white;padding:16px;
            border-radius:8px;border:1px solid #e0e0e0;
            margin:16px 0;border-left:4px solid #f59e0b;">
            <h3 style="margin:0 0 12px 0;color:#374151;">
              Your Message Summary:
            </h3>
            <p style="margin:4px 0;color:#374151;">
              <strong>Subject:</strong> ${subject}
            </p>
            <p style="margin:4px 0;color:#374151;
              text-transform:capitalize;">
              <strong>Category:</strong> ${category}
            </p>
            <p style="margin:4px 0;color:#374151;">
              <strong>Message:</strong> ${message}
            </p>
          </div>

          <!-- Contact Options -->
          <p style="color:#6b7280;">
            Need urgent help? Contact us directly:
          </p>
          <div style="margin:16px 0;">
            <a href="https://wa.me/2347035620709"
              style="display:inline-block;background:#22c55e;
              color:#fff;text-decoration:none;
              padding:10px 20px;border-radius:8px;
              font-weight:700;font-size:14px;
              margin-right:8px;">
              💬 WhatsApp Us
            </a>
            <a href="tel:+2347035620709"
              style="display:inline-block;background:#1d4ed8;
              color:#fff;text-decoration:none;
              padding:10px 20px;border-radius:8px;
              font-weight:700;font-size:14px;">
              📞 Call Us
            </a>
          </div>

          <p style="color:#9ca3af;font-size:12px;">
            This is an automated confirmation.
            Please do not reply to this email directly.
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#1d4ed8;padding:16px;
          border-radius:0 0 8px 8px;text-align:center;">
          <p style="color:white;margin:0;font-size:14px;">
            Thank you for contacting
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
const ownerNotificationHtml = ({
  name, email, phone, subject, category, message,
}) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">

    <div style="background:#1d4ed8;padding:20px;border-radius:8px 8px 0 0">
      <h1 style="color:white;margin:0;font-size:22px">
        📩 New Contact Message — 75TechStore
      </h1>
    </div>

    <div style="padding:20px;background:#f9fafb;border:1px solid #e0e0e0">

      <div style="display:inline-block;padding:4px 12px;
        border-radius:20px;font-size:12px;font-weight:700;
        text-transform:uppercase;margin-bottom:16px;
        background:${
          category === 'complaint' ? '#fee2e2' :
          category === 'business'  ? '#dbeafe' : '#fef3c7'
        };
        color:${
          category === 'complaint' ? '#dc2626' :
          category === 'business'  ? '#2563eb' : '#d97706'
        };">
        ${category}
      </div>

      <table style="border-collapse:collapse;width:100%;background:white">
        <tr style="background:#1d4ed8;color:white">
          <th style="padding:10px;text-align:left;width:120px">Field</th>
          <th style="padding:10px;text-align:left">Details</th>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e0e0e0;
            color:#6b7280;font-weight:600;">Name</td>
          <td style="padding:10px;border:1px solid #e0e0e0;
            font-weight:700;">${name}</td>
        </tr>
        <tr style="background:#f9fafb;">
          <td style="padding:10px;border:1px solid #e0e0e0;
            color:#6b7280;font-weight:600;">Email</td>
          <td style="padding:10px;border:1px solid #e0e0e0;">
            <a href="mailto:${email}" style="color:#1d4ed8;">
              ${email}
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e0e0e0;
            color:#6b7280;font-weight:600;">Phone</td>
          <td style="padding:10px;border:1px solid #e0e0e0;">
            ${phone || 'Not provided'}
          </td>
        </tr>
        <tr style="background:#f9fafb;">
          <td style="padding:10px;border:1px solid #e0e0e0;
            color:#6b7280;font-weight:600;">Subject</td>
          <td style="padding:10px;border:1px solid #e0e0e0;
            font-weight:600;">${subject}</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e0e0e0;
            color:#6b7280;font-weight:600;vertical-align:top;">
            Message
          </td>
          <td style="padding:10px;border:1px solid #e0e0e0;
            line-height:1.7;">${message}</td>
        </tr>
        <tr style="background:#f9fafb;">
          <td style="padding:10px;border:1px solid #e0e0e0;
            color:#6b7280;font-weight:600;">Received</td>
          <td style="padding:10px;border:1px solid #e0e0e0;">
            ${new Date().toLocaleString('en-NG', {
              timeZone:  'Africa/Lagos',
              dateStyle: 'full',
              timeStyle: 'short',
            })}
          </td>
        </tr>
      </table>

      <!-- Quick Reply Button -->
      <div style="margin-top:20px;">
        <a href="mailto:${email}?subject=Re: ${subject}"
          style="display:inline-block;
          background:#1d4ed8;color:#fff;
          text-decoration:none;padding:12px 24px;
          border-radius:8px;font-weight:700;font-size:14px;">
          ↩️ Reply to ${name}
        </a>
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
   POST /api/contact
═══════════════════════════════════════════ */
export const submitContact = async (req, res) => {
  const { name, email, phone, subject, category, message } = req.body

  /* ── 1. Validate ── */
  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Name is required.',
    })
  }
  if (!email || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Email is required.',
    })
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.',
    })
  }
  if (!subject || !subject.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Subject is required.',
    })
  }
  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Message is required.',
    })
  }

  try {
    /* ── 2. Save to MongoDB ── */
    const contactMsg = await ContactMessage.create({
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      phone:    phone?.trim() || 'Not provided',
      subject:  subject.trim(),
      category: category || 'general',
      message:  message.trim(),
    })

    /* ── 3. Send auto-reply to customer ── */
    await sendEmail({
      to:      email.trim(),
      toName:  name.trim(),
      subject: `✅ We received your message — ${subject}`,
      html:    autoReplyHtml({ name, subject, category, message }),
    })

    /* ── 4. Send notification to store owner ── */
    await sendEmail({
      to:      '75techstore@gmail.com',
      toName:  '75TechStore Admin',
      subject: `📩 New Contact: ${subject} [${category}]`,
      html:    ownerNotificationHtml({
        name, email, phone, subject, category, message,
      }),
    })

    /* ── 5. Respond ── */
    return res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will respond within 24 hours.',
      data: { id: contactMsg._id },
    })

  } catch (error) {
    console.error('❌ Contact form error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again or contact us via WhatsApp.',
    })
  }
}