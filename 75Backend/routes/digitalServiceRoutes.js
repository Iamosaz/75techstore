// 75Backend/routes/digitalServiceRoutes.js
import express from 'express'
import { DigitalProject } from '../models/DigitalProject.js'
import { ClientReview } from '../models/ClientReview.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// ═══════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════

// ── GET /api/digital/projects → Public: get published projects ──
router.get('/projects', async (req, res) => {
  try {
    const { category, featured } = req.query
    const query = { isPublished: true }

    if (category && category !== 'All') {
      query.category = category
    }
    if (featured === 'true') {
      query.isFeatured = true
    }

    const projects = await DigitalProject.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })

    res.json({ success: true, data: projects })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── GET /api/digital/projects/all → Admin: get ALL projects ──
router.get('/projects/all', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    const projects = await DigitalProject.find().sort({ createdAt: -1 })
    res.json({ success: true, data: projects })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── POST /api/digital/projects → Admin: create project ──
router.post('/projects', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    const {
      title, clientName, description, category,
      imageUrl, liveUrl, techUsed, isFeatured, isPublished
    } = req.body

    const project = new DigitalProject({
      title,
      clientName,
      description,
      category,
      imageUrl,
      liveUrl,
      techUsed: techUsed || [],
      isFeatured: isFeatured || false,
      isPublished: isPublished !== false,
    })

    const saved = await project.save()
    res.status(201).json({ success: true, data: saved })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── PUT /api/digital/projects/:id → Admin: update project ──
router.put('/projects/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    const project = await DigitalProject.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    const fields = [
      'title', 'clientName', 'description', 'category',
      'imageUrl', 'liveUrl', 'techUsed', 'isFeatured', 'isPublished'
    ]

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field]
      }
    })

    const updated = await project.save()
    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── DELETE /api/digital/projects/:id → Admin: delete project ──
router.delete('/projects/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    const project = await DigitalProject.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' })
    }

    await project.deleteOne()
    res.json({ success: true, message: 'Project deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ═══════════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════════

// ── GET /api/digital/reviews → Public: get approved reviews ──
router.get('/reviews', async (req, res) => {
  try {
    const { featured } = req.query
    const query = { status: 'Approved' }

    if (featured === 'true') {
      query.isFeatured = true
    }

    const reviews = await ClientReview.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })

    res.json({ success: true, data: reviews })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── POST /api/digital/reviews → Public: submit a review ──
router.post('/reviews', async (req, res) => {
  try {
    const {
      clientName, clientEmail, businessName,
      rating, title, reviewText, serviceUsed
    } = req.body

    const review = new ClientReview({
      clientName,
      clientEmail,
      businessName,
      rating,
      title,
      reviewText,
      serviceUsed,
      status: 'Pending',
    })

    const saved = await review.save()
    res.status(201).json({
      success: true,
      message: 'Review submitted! It will appear after admin approval.',
      data: saved,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── GET /api/digital/reviews/all → Admin: get ALL reviews ──
router.get('/reviews/all', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    const reviews = await ClientReview.find().sort({ createdAt: -1 })
    res.json({ success: true, data: reviews })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── PUT /api/digital/reviews/:id → Admin: approve/reject/edit review ──
router.put('/reviews/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    const review = await ClientReview.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' })
    }

    const fields = [
      'status', 'isFeatured', 'adminResponse',
      'clientName', 'businessName', 'rating',
      'title', 'reviewText', 'serviceUsed'
    ]

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        review[field] = req.body[field]
      }
    })

    const updated = await review.save()
    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// ── DELETE /api/digital/reviews/:id → Admin: delete review ──
router.delete('/reviews/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' })
    }

    const review = await ClientReview.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' })
    }

    await review.deleteOne()
    res.json({ success: true, message: 'Review deleted' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router