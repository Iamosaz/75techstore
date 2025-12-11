import { Product } from '../models/Product.js';

//  Create new product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

//  Get all products, with pagination + search + optional filters
export const getAllProducts = async (req, res) => {
  try {
    // 1 Read query params
    const page = Number(req.query.page) || 1;     // page number
    const limit = Number(req.query.limit) || 10;  // items per page
    const skip = (page - 1) * limit;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    // 2 Optional filters (category, price range)
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = +req.query.minPrice;
      if (req.query.maxPrice) filters.price.$lte = +req.query.maxPrice;
    }

    // 3 Build query object
    const query = { ...keyword, ...filters };

    // 4 Fetch products and count total
    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // 5 Send response
    res.json({
      products,
      page,
      totalPages: Math.ceil(count / limit),
      totalCount: count,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', product: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};