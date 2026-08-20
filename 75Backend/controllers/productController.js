// 75Backend/controllers/productController.js
import { Product } from '../models/Product.js'

// ✅ GET ALL PRODUCTS (search + filter + condition + pagination)
// 75Backend/controllers/productController.js
// ── Update getAllProducts ──

export const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      keyword,
      condition,
      page = 1,
      limit = 12,
    } = req.query

    const query = {}

    if (category && category !== 'All') {
      query.category = category
    }

    // ✅ Condition filter
    if (condition && condition !== '') {
      query.condition = condition
    }

    if (keyword && keyword.trim() !== '') {
      query.$or = [
        { name:        { $regex: keyword, $options: 'i' } },
        { brand:       { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { category:    { $regex: keyword, $options: 'i' } },
      ]
    }

    const skip       = (Number(page) - 1) * Number(limit)
    const totalCount = await Product.countDocuments(query)
    const products   = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    res.json({
      products,
      totalPages:  Math.ceil(totalCount / Number(limit)),
      totalCount,
      currentPage: Number(page),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ GET SINGLE PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ CREATE PRODUCT (Admin only)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      brand,
      imageUrl,
      condition,
      grade,
      isFeatured,
      isTopPick,
      isBestSelling,
      isNewArrival,
      isDealOfDay,
      discount,
      offerEnds,
      imageSize,
    } = req.body

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      brand,
      imageUrl,
      condition:    condition    || 'Brand New',
      grade:        grade        || 'N/A',
      isFeatured:   isFeatured   || false,
      isTopPick:    isTopPick    || false,
      isBestSelling:isBestSelling|| false,
      isNewArrival: isNewArrival || false,
      isDealOfDay:  isDealOfDay  || false,
      discount:     discount     || 0,
      offerEnds:    offerEnds    || null,
      imageSize:    imageSize    || 'medium',
      createdBy:    req.user._id,
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ UPDATE PRODUCT (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const fields = [
      'name', 'description', 'price', 'stock', 'category',
      'brand', 'imageUrl', 'condition', 'grade',
      'isFeatured', 'isTopPick', 'isBestSelling',
      'isNewArrival', 'isDealOfDay', 'discount',
      'offerEnds', 'imageSize', 'rating', 'numReviews'
    ]

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field]
      }
    })

    const updatedProduct = await product.save()
    res.json(updatedProduct)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ DELETE PRODUCT (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    await product.deleteOne()
    res.json({ message: 'Product removed successfully' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ GET FEATURED PRODUCTS
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ GET PRODUCTS BY CATEGORY
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category
    }).sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ GET TOP PICKS
export const getTopPicks = async (req, res) => {
  try {
    const products = await Product.find({ isTopPick: true })
      .sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ GET BEST SELLING
export const getBestSelling = async (req, res) => {
  try {
    const products = await Product.find({ isBestSelling: true })
      .sort({ sold: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ GET NEW ARRIVALS
export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true })
      .sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ GET DEALS OF THE DAY
export const getDealsOfDay = async (req, res) => {
  try {
    const products = await Product.find({ isDealOfDay: true })
      .sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}