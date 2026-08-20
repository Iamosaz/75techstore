// 75Backend/routes/swapRoutes.js
import express from 'express'
import { SwapDeal } from '../models/SwapDeal.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// ── POST /api/swap → Customer submits swap deal (PUBLIC) ──
router.post('/', async (req, res) => {
  try {
    const {
      customerName, customerPhone, customerEmail,
      deviceBrand, deviceModel, deviceStorage,
      deviceCondition, hasRepairs, repairDetails,
      hasChangedParts, changedPartsDetails,
      batteryHealth, mediaUrls,
      wantedBrand, wantedModel, wantedStorage,
    } = req.body

    const swap = new SwapDeal({
      customerName, customerPhone, customerEmail,
      deviceBrand, deviceModel, deviceStorage,
      deviceCondition, hasRepairs, repairDetails,
      hasChangedParts, changedPartsDetails,
      batteryHealth, mediaUrls: mediaUrls || [],
      wantedBrand, wantedModel, wantedStorage,
    })

    const saved = await swap.save()

    res.status(201).json({
      success: true,
      message: 'Swap deal submitted successfully',
      data: {
        swapId:    saved.swapId,
        status:    saved.status,
        createdAt: saved.createdAt,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── GET /api/swap → Admin gets all swap deals ──
router.get('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false, message: 'Not authorized'
      })
    }

    const { status, page = 1, limit = 20 } = req.query
    const query = {}
    if (status && status !== 'All') query.status = status

    const total = await SwapDeal.countDocuments(query)
    const swaps = await SwapDeal.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))

    res.json({ success: true, data: swaps, total })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── GET /api/swap/:id → Admin gets single swap ──
router.get('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false, message: 'Not authorized'
      })
    }

    const swap = await SwapDeal.findById(req.params.id)
    if (!swap) {
      return res.status(404).json({
        success: false, message: 'Swap deal not found'
      })
    }
    res.json({ success: true, data: swap })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── PUT /api/swap/:id → Admin updates swap deal ──
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false, message: 'Not authorized'
      })
    }

    const swap = await SwapDeal.findById(req.params.id)
    if (!swap) {
      return res.status(404).json({
        success: false, message: 'Swap deal not found'
      })
    }

    const fields = [
      'status', 'offeredValue', 'adminNotes', 'assessedBy'
    ]
    fields.forEach(f => {
      if (req.body[f] !== undefined) swap[f] = req.body[f]
    })

    const updated = await swap.save()
    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── DELETE /api/swap/:id → Admin deletes swap deal ──
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false, message: 'Not authorized'
      })
    }

    const swap = await SwapDeal.findById(req.params.id)
    if (!swap) {
      return res.status(404).json({
        success: false, message: 'Swap deal not found'
      })
    }

    await swap.deleteOne()
    res.json({ success: true, message: 'Swap deal deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router