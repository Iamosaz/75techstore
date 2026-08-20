// 75Backend/controllers/orderController.js
import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import User from '../models/User.js'
import axios from 'axios'

// ✅ Send Email Helper using Brevo API
const sendEmail = async ({ to, toName, subject, html }) => {
  try {
    await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: '75TechStore',
          email: process.env.STORE_EMAIL || '75techstore@gmail.com'
        },
        to: [{ email: to, name: toName || to }],
        subject,
        htmlContent: html
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    )
    console.log(`✅ Email sent to ${to}`)
  } catch (error) {
    console.error('❌ Brevo email error:', error?.response?.data || error.message)
  }
}

// ✅ Send Order Confirmation Emails
const sendOrderEmail = async (order, customerEmail, customerName) => {
  try {
    const itemsList = order.items
      .map(
        (item) => `
          <tr>
            <td style="padding:10px;border:1px solid #e0e0e0">${item.name}</td>
            <td style="padding:10px;border:1px solid #e0e0e0">${item.condition}</td>
            <td style="padding:10px;border:1px solid #e0e0e0">${item.quantity}</td>
            <td style="padding:10px;border:1px solid #e0e0e0">₦${item.price.toLocaleString()}</td>
            <td style="padding:10px;border:1px solid #e0e0e0">₦${(item.price * item.quantity).toLocaleString()}</td>
          </tr>`
      )
      .join('')

    // Admin email
    await sendEmail({
      to: process.env.STORE_EMAIL,
      toName: '75TechStore Admin',
      subject: `🛒 New Paid Order Received - ${order.orderNumber}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1d4ed8;padding:20px;border-radius:8px 8px 0 0">
            <h1 style="color:white;margin:0;font-size:22px">🛒 New Paid Order</h1>
          </div>
          <div style="padding:20px;background:#f9fafb;border:1px solid #e0e0e0">
            <h2 style="color:#1d4ed8">${order.orderNumber}</h2>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
            <p><strong>Address:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
            <p><strong>Paystack Ref:</strong> ${order.paystackReference || 'N/A'}</p>
            <h3 style="color:#374151">Items</h3>
            <table style="border-collapse:collapse;width:100%;background:white">
              <tr style="background:#1d4ed8;color:white">
                <th style="padding:8px">Product</th>
                <th style="padding:8px">Condition</th>
                <th style="padding:8px">Qty</th>
                <th style="padding:8px">Price</th>
                <th style="padding:8px">Total</th>
              </tr>
              ${itemsList}
            </table>
            <p><strong>Total Paid: ₦${order.totalAmount.toLocaleString()}</strong></p>
          </div>
        </div>`
    })

    // Customer email
    await sendEmail({
      to: customerEmail,
      toName: customerName,
      subject: `✅ Order Confirmed - ${order.orderNumber} | 75TechStore`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1d4ed8;padding:20px;border-radius:8px 8px 0 0">
            <h1 style="color:white;margin:0;font-size:22px">✅ Order & Payment Confirmed!</h1>
          </div>
          <div style="padding:20px;background:#f9fafb;border:1px solid #e0e0e0">
            <h2>Hi ${customerName}! 🎉</h2>
            <p>Thank you for shopping with 75TechStore. Your payment has been received and your order is confirmed.</p>
            <div style="background:#1d4ed8;color:white;padding:16px;border-radius:8px;text-align:center;margin:16px 0">
              <p style="margin:0;font-size:12px">Tracking Order Number</p>
              <p style="margin:4px 0;font-size:24px;font-weight:bold">${order.orderNumber}</p>
            </div>
            <h3 style="color:#374151">Items Summary</h3>
            <table style="border-collapse:collapse;width:100%;background:white">
              <tr style="background:#1d4ed8;color:white">
                <th style="padding:8px">Product</th>
                <th style="padding:8px">Condition</th>
                <th style="padding:8px">Qty</th>
                <th style="padding:8px">Price</th>
                <th style="padding:8px">Total</th>
              </tr>
              ${itemsList}
            </table>
            <p style="font-size:18px;color:#1d4ed8;margin-top:16px">
              <strong>Total: ₦${order.totalAmount.toLocaleString()}</strong>
            </p>
            <p><strong>Delivering to:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
          </div>
        </div>`
    })

    console.log(`✅ Order emails sent for: ${order.orderNumber}`)
  } catch (error) {
    console.error('❌ sendOrderEmail error:', error.message)
  }
}

// ✅ Send Status Update Email
const sendStatusUpdateEmail = async (order, customer, newStatus, message, estimatedDelivery) => {
  try {
    await sendEmail({
      to: customer.email,
      toName: customer.name,
      subject: `📦 Order Update - ${order.orderNumber} | 75TechStore`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1d4ed8;padding:20px;border-radius:8px 8px 0 0">
            <h1 style="color:white;margin:0;font-size:22px">📦 Order Status Update</h1>
          </div>
          <div style="padding:20px;background:#f9fafb;border:1px solid #e0e0e0">
            <h2>Hi ${customer.name}!</h2>
            <p>Your order <strong>${order.orderNumber}</strong> status is now: <strong style="text-transform:uppercase">${newStatus}</strong></p>
            ${message ? `<p>${message}</p>` : ''}
            ${estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(estimatedDelivery).toDateString()}</p>` : ''}
          </div>
        </div>`
    })
  } catch (error) {
    console.error('❌ sendStatusUpdateEmail error:', error.message)
  }
}

// ✅ CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      paystackReference,
      subtotal,
      shippingFee,
      discount,
      totalAmount,
      customerNote
    } = req.body

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name}`
        })
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for: ${product.name}. Only ${product.stock} left.`
        })
      }
    }

    const order = new Order({
      customer: req.user._id,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'Paystack',
      paymentStatus: paymentStatus || 'paid',
      paystackReference: paystackReference || '',
      subtotal,
      shippingFee: shippingFee || 0,
      discount: discount || 0,
      totalAmount,
      customerNote: customerNote || '',
      orderStatus: paymentStatus === 'paid' ? 'confirmed' : 'pending',
      statusHistory: [
        {
          status: paymentStatus === 'paid' ? 'confirmed' : 'pending',
          message: paymentStatus === 'paid' ? 'Payment received via Paystack' : 'Order created',
          updatedAt: new Date()
        }
      ]
    })

    await order.save()

    // Deduct inventory stock right away
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      })
    }

    const customer = await User.findById(req.user._id)
    sendOrderEmail(order, customer.email, customer.name)

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    })
  } catch (error) {
    console.error('❌ Create order error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    })
  }
}

// ✅ GET MY ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('items.product', 'name imageUrl price')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    })
  }
}

// ✅ GET ORDER BY ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name imageUrl price')

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (order.customer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    res.status(200).json({ success: true, order })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order', error: error.message })
  }
}

// ✅ TRACK ORDER (Public)
export const trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params
    const order = await Order.findOne({ orderNumber })
      .populate('items.product', 'name imageUrl')
      .select('-adminNote -paystackReference')

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found. Please check your order number.' })
    }

    res.status(200).json({ success: true, order })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to track order', error: error.message })
  }
}

// ✅ ADMIN - GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query
    const filter = {}
    if (status) filter.orderStatus = status
    if (paymentStatus) filter.paymentStatus = paymentStatus

    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name imageUrl')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Order.countDocuments(filter)

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      orders
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message })
  }
}

// ✅ ADMIN - UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, message, adminNote, estimatedDelivery } = req.body
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    order.orderStatus = orderStatus
    order.statusHistory.push({
      status: orderStatus,
      message: message || `Order marked as ${orderStatus}`,
      updatedAt: new Date()
    })

    if (orderStatus === 'delivered') {
      order.deliveredAt = new Date()
      order.paymentStatus = 'paid'
    }

    if (orderStatus === 'cancelled') {
      order.isCancelled = true
      order.cancelReason = message || 'Cancelled by admin'
    }

    if (adminNote) order.adminNote = adminNote
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery

    await order.save()

    const customer = await User.findById(order.customer)
    if (customer) {
      sendStatusUpdateEmail(order, customer, orderStatus, message, estimatedDelivery)
    }

    res.status(200).json({ success: true, message: 'Order status updated successfully', order })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order', error: error.message })
  }
}

// ✅ CUSTOMER - CANCEL ORDER
export const cancelOrder = async (req, res) => {
  try {
    const { cancelReason } = req.body
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: `Cannot cancel order that is already ${order.orderStatus}` })
    }

    order.orderStatus = 'cancelled'
    order.isCancelled = true
    order.cancelReason = cancelReason || 'Cancelled by customer'
    order.statusHistory.push({
      status: 'cancelled',
      message: cancelReason || 'Cancelled by customer',
      updatedAt: new Date()
    })

    await order.save()

    res.status(200).json({ success: true, message: 'Order cancelled successfully', order })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel order', error: error.message })
  }
}