// 75Backend/routes/engineerRoutes.js
import express from 'express'
import { EngineerRequest } from '../models/EngineerRequest.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// ── POST /api/engineer → Create request (any logged in user) ──
router.post('/', protect, async (req, res) => {
  try {
    const {
      gadgetType, brand,
      issueDescription, contactNumber, address
    } = req.body

    const newRequest = new EngineerRequest({
      user:             req.user._id || req.user.id,
      gadgetType,
      brand,
      issueDescription,
      contactNumber,
      address,
    })

    const saved = await newRequest.save()
    res.status(201).json({ success: true, data: saved })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── GET /api/engineer/my-requests → User sees their own requests ──
router.get('/my-requests', protect, async (req, res) => {
  try {
    const requests = await EngineerRequest.find({
      user: req.user._id || req.user.id
    }).sort({ createdAt: -1 })

    res.json({ success: true, data: requests })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── GET /api/engineer → Admin sees ALL requests ──
router.get('/', protect, async (req, res) => {
  try {
    // ✅ Only admin can see all requests
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      })
    }

    const requests = await EngineerRequest
      .find()
      .populate('user', 'name email phone') // ✅ populate from your User model
      .sort({ createdAt: -1 })

    res.json({ success: true, data: requests })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── PUT /api/engineer/:id → Admin assigns engineer ──
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      })
    }

    const request = await EngineerRequest.findById(req.params.id)
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      })
    }

    request.status               = req.body.status               || request.status
    request.assignedEngineerName = req.body.assignedEngineerName || request.assignedEngineerName
    request.adminNotes           = req.body.adminNotes           || request.adminNotes

    const updated = await request.save()
    res.json({ success: true, data: updated })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router