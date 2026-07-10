import { Product } from '../models/Product.js';

// ✅ Create new product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const {
      name, description, price, stock, category, brand,
      imageUrl, isFeatured, isTopPick, isBestSelling,
      isNewArrival, isDealOfDay, discount, offerEnds,
      imageSize
    } = req.body;

    if (!name || !description || !price || !category || !brand) {
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock: stock || 0,
      category,
      brand,
      imageUrl: imageUrl || '',
      isFeatured: isFeatured || false,
      isTopPick: isTopPick || false,
      isBestSelling: isBestSelling || false,
      isNewArrival: isNewArrival || false,
      isDealOfDay: isDealOfDay || false,
      discount: discount || 0,
      offerEnds: offerEnds || null,
      imageSize: imageSize || 'medium',
      createdBy: req.user._id
    });

    console.log('✅ Product created:', newProduct.name);

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });

  } catch (err) {
    console.error('❌ Create product error:', err.message);
    res.status(500).json({
      message: 'Failed to create product',
      error: err.message
    });
  }
};

// ✅ Get all products - pagination + search + filters
export const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.brand) filters.brand = req.query.brand;
    if (req.query.isFeatured) {
      filters.isFeatured = req.query.isFeatured === 'true';
    }
    if (req.query.isTopPick) {
      filters.isTopPick = req.query.isTopPick === 'true';
    }
    if (req.query.isBestSelling) {
      filters.isBestSelling = req.query.isBestSelling === 'true';
    }
    if (req.query.isNewArrival) {
      filters.isNewArrival = req.query.isNewArrival === 'true';
    }
    if (req.query.isDealOfDay) {
      filters.isDealOfDay = req.query.isDealOfDay === 'true';
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = +req.query.minPrice;
      if (req.query.maxPrice) filters.price.$lte = +req.query.maxPrice;
    }

    const query = { ...keyword, ...filters };

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      totalPages: Math.ceil(count / limit),
      totalCount: count,
    });

  } catch (err) {
    console.error('❌ Get products error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('❌ Get product error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // ✅ Update all fields explicitly
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price ?? product.price;
    product.stock = req.body.stock ?? product.stock;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.imageUrl = req.body.imageUrl ?? product.imageUrl;
    product.imageSize = req.body.imageSize || product.imageSize;
    product.discount = req.body.discount ?? product.discount;
    product.offerEnds = req.body.offerEnds ?? product.offerEnds;

    // ✅ Boolean fields
    if (typeof req.body.isFeatured === 'boolean') {
      product.isFeatured = req.body.isFeatured;
    }
    if (typeof req.body.isTopPick === 'boolean') {
      product.isTopPick = req.body.isTopPick;
    }
    if (typeof req.body.isBestSelling === 'boolean') {
      product.isBestSelling = req.body.isBestSelling;
    }
    if (typeof req.body.isNewArrival === 'boolean') {
      product.isNewArrival = req.body.isNewArrival;
    }
    if (typeof req.body.isDealOfDay === 'boolean') {
      product.isDealOfDay = req.body.isDealOfDay;
    }

    const updated = await product.save();

    console.log('✅ Product updated:', updated.name);
    console.log('   Tags:', {
      featured: updated.isFeatured,
      topPick: updated.isTopPick,
      bestSelling: updated.isBestSelling,
      newArrival: updated.isNewArrival,
      dealOfDay: updated.isDealOfDay
    });

    res.json({
      message: 'Product updated successfully',
      product: updated
    });

  } catch (err) {
    console.error('❌ Update product error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    console.log('🗑️ Deleting product:', req.params.id);

    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('✅ Product deleted:', deleted.name);
    res.json({ message: 'Product deleted successfully' });

  } catch (err) {
    console.error('❌ Delete product error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true
    }).limit(8);
    console.log('⭐ Featured products found:', products.length);
    res.json(products);
  } catch (err) {
    console.error('❌ Get featured error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category
    }).sort({ createdAt: -1 });
    console.log(`📦 Category ${req.params.category}:`, products.length);
    res.json(products);
  } catch (err) {
    console.error('❌ Get by category error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Top Picks
export const getTopPicks = async (req, res) => {
  try {
    const products = await Product.find({
      isTopPick: true
    }).limit(8);
    console.log('🏆 Top picks found:', products.length);
    res.json(products);
  } catch (err) {
    console.error('❌ Get top picks error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Best Selling
export const getBestSelling = async (req, res) => {
  try {
    const products = await Product.find({
      isBestSelling: true
    })
      .sort({ sold: -1 })
      .limit(8);
    console.log('🔥 Best selling found:', products.length);
    res.json(products);
  } catch (err) {
    console.error('❌ Get best selling error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get New Arrivals
export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({
      isNewArrival: true
    })
      .sort({ createdAt: -1 })
      .limit(8);
    console.log('🆕 New arrivals found:', products.length);
    res.json(products);
  } catch (err) {
    console.error('❌ Get new arrivals error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Deals of the Day - Fixed (removed discount requirement)
export const getDealsOfDay = async (req, res) => {
  try {
    const products = await Product.find({
      isDealOfDay: true
    }).limit(5);
    console.log('💰 Deals found:', products.length);
    res.json(products);
  } catch (err) {
    console.error('❌ Get deals error:', err.message);
    res.status(500).json({ message: err.message });
  }
};