// 75Backend/controllers/blogController.js
import { Blog } from '../models/Blog.js';

// ─── CREATE Blog ──────────────────────────────────────────────────
export const createBlog = async (req, res) => {
  try {
    const {
      title, content, excerpt, coverImage,
      category, tags, author, status,
      isFeatured, metaTitle, metaDescription
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: 'Title and content are required'
      });
    }

    const blog = await Blog.create({
      title,
      content,
      excerpt: excerpt || '',
      coverImage: coverImage || '',
      category: category || 'Tech News',
      tags: tags || [],
      author: author || '75TechStore Team',
      status: status || 'draft',
      isFeatured: isFeatured || false,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt || '',
      createdBy: req.user?._id
    });

    console.log('✅ Blog created:', blog.title);
    res.status(201).json({
      message: 'Blog post created successfully',
      blog
    });

  } catch (err) {
    console.error('❌ Create blog error:', err.message);
    res.status(500).json({
      message: 'Failed to create blog post',
      error: err.message
    });
  }
};

// ─── GET All Blogs Admin ──────────────────────────────────────────
export const getAllBlogsAdmin = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.keyword) {
      query.title = { $regex: req.query.keyword, $options: 'i' };
    }
    if (req.query.status && req.query.status !== '') {
      query.status = req.query.status;
    }
    if (req.query.category && req.query.category !== '') {
      query.category = req.query.category;
    }

    const count = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📝 Admin blogs: ${blogs.length} found | Query: ${JSON.stringify(query)}`);

    res.json({
      blogs,
      page,
      totalPages: Math.ceil(count / limit),
      totalCount: count
    });

  } catch (err) {
    console.error('❌ getAllBlogsAdmin error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ─── GET Published Blogs Public ───────────────────────────────────
export const getPublishedBlogs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const query = { status: 'published' };

    if (req.query.keyword) {
      query.title = { $regex: req.query.keyword, $options: 'i' };
    }
    if (req.query.category) {
      query.category = req.query.category;
    }

    // ✅ Debug logs
    const totalInDB = await Blog.countDocuments({});
    const publishedInDB = await Blog.countDocuments({ status: 'published' });
    console.log(`📊 Total blogs: ${totalInDB} | Published: ${publishedInDB}`);

    const count = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    console.log(`✅ Returning ${blogs.length} published blogs`);

    res.json({
      blogs,
      page,
      totalPages: Math.ceil(count / limit),
      totalCount: count
    });

  } catch (err) {
    console.error('❌ getPublishedBlogs error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ─── GET Blog by ID or Slug - Public ─────────────────────────────
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 getBlogById called with:', id);

    let blog = null;

    // ✅ Check if MongoDB ObjectId or slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    if (isObjectId) {
      blog = await Blog.findById(id);
      console.log('🔍 Searched by ObjectId:', blog ? 'FOUND ✅' : 'NOT FOUND ❌');
    } else {
      blog = await Blog.findOne({ slug: id });
      console.log('🔍 Searched by slug:', blog ? 'FOUND ✅' : 'NOT FOUND ❌');
    }

    if (!blog) {
      console.log('❌ Blog not found for:', id);
      return res.status(404).json({ message: 'Blog post not found' });
    }

    console.log('✅ Blog found:', blog.title, '| Status:', blog.status);

    // ✅ Increment views
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    res.json(blog);

  } catch (err) {
    console.error('❌ getBlogById error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ─── GET Blog by Slug - Public ────────────────────────────────────
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: 'published'
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
    res.json(blog);

  } catch (err) {
    console.error('❌ getBlogBySlug error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ─── GET Featured Blogs Public ────────────────────────────────────
export const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      isFeatured: true,
      status: 'published'
    })
      .limit(3)
      .lean();

    res.json(blogs);

  } catch (err) {
    console.error('❌ getFeaturedBlogs error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ─── UPDATE Blog Admin ────────────────────────────────────────────
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    console.log('📝 Updating blog:', blog.title);
    console.log('📝 Old status:', blog.status);
    console.log('📝 New status:', req.body.status);

    // ✅ Use findByIdAndUpdate to avoid pre-save hook slug issues
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title || blog.title,
          content: req.body.content || blog.content,
          excerpt: req.body.excerpt !== undefined
            ? req.body.excerpt : blog.excerpt,
          coverImage: req.body.coverImage !== undefined
            ? req.body.coverImage : blog.coverImage,
          category: req.body.category || blog.category,
          tags: req.body.tags !== undefined
            ? req.body.tags : blog.tags,
          author: req.body.author || blog.author,
          // ✅ Status updates correctly now
          status: req.body.status !== undefined
            ? req.body.status : blog.status,
          isFeatured: typeof req.body.isFeatured === 'boolean'
            ? req.body.isFeatured : blog.isFeatured,
          metaTitle: req.body.metaTitle || blog.metaTitle,
          metaDescription: req.body.metaDescription !== undefined
            ? req.body.metaDescription : blog.metaDescription,
        }
      },
      { new: true, runValidators: true }
    );

    console.log('✅ Blog updated! New status:', updated.status);

    res.json({
      message: 'Blog post updated successfully',
      blog: updated
    });

  } catch (err) {
    console.error('❌ Update blog error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

// ─── DELETE Blog Admin ────────────────────────────────────────────
export const deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    console.log('✅ Blog deleted:', deleted.title);
    res.json({ message: 'Blog post deleted successfully' });

  } catch (err) {
    console.error('❌ Delete blog error:', err.message);
    res.status(500).json({ message: err.message });
  }
};