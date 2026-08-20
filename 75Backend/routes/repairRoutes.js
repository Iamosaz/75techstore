// 75Backend/routes/repairRoutes.js
import express from 'express'
import { RepairBooking } from '../models/RepairBooking.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// ── POST /api/repairs → Book a repair (PUBLIC - no login needed) ──
router.post('/', async (req, res) => {
  try {
    const {
      customerName, customerEmail, customerPhone,
      deviceType, deviceBrand, deviceModel,
      issueCategory, issueDescription,
      dropOffMethod, preferredDate, preferredTime,
      dispatchAddress,
    } = req.body

    // Validate dispatch address if method is Dispatch
    if (dropOffMethod === 'Dispatch' && !dispatchAddress) {
      return res.status(400).json({
        success: false,
        message: 'Pickup address is required for dispatch option',
      })
    }

    const booking = new RepairBooking({
      customerName,
      customerEmail,
      customerPhone,
      deviceType,
      deviceBrand,
      deviceModel,
      issueCategory,
      issueDescription,
      dropOffMethod,
      preferredDate,
      preferredTime,
      dispatchAddress,
    })

    const saved = await booking.save()

    res.status(201).json({
      success: true,
      message: 'Repair booked successfully',
      data: {
        repairId:  saved.repairId,
        status:    saved.status,
        createdAt: saved.createdAt,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── GET /api/repairs/track/:repairId → Track repair (PUBLIC) ──
router.get('/track/:repairId', async (req, res) => {
  try {
    const booking = await RepairBooking.findOne({
      repairId: req.params.repairId.toUpperCase(),
    })

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'No repair found with this ID. Please check and try again.',
      })
    }

    // ✅ Only send safe info - not admin notes
    res.json({
      success: true,
      data: {
        repairId:           booking.repairId,
        deviceType:         booking.deviceType,
        deviceBrand:        booking.deviceBrand,
        deviceModel:        booking.deviceModel,
        issueCategory:      booking.issueCategory,
        status:             booking.status,
        dropOffMethod:      booking.dropOffMethod,
        preferredDate:      booking.preferredDate,
        preferredTime:      booking.preferredTime,
        diagnosisNotes:     booking.diagnosisNotes,
        estimatedCost:      booking.estimatedCost,
        assignedTechnician: booking.assignedTechnician,
        createdAt:          booking.createdAt,
        completedAt:        booking.completedAt,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── GET /api/repairs → Admin get all repairs ──
router.get('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      })
    }

    const repairs = await RepairBooking.find().sort({ createdAt: -1 })
    res.json({ success: true, data: repairs })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── PUT /api/repairs/:id → Admin update repair status ──
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      })
    }

    const repair = await RepairBooking.findById(req.params.id)
    if (!repair) {
      return res.status(404).json({
        success: false,
        message: 'Repair not found',
      })
    }

    const fields = [
      'status', 'diagnosisNotes', 'estimatedCost',
      'assignedTechnician', 'adminNotes',
    ]

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        repair[field] = req.body[field]
      }
    })

    // Auto-set completedAt when status is Completed
    if (req.body.status === 'Completed' && !repair.completedAt) {
      repair.completedAt = new Date()
    }

    const updated = await repair.save()
    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router