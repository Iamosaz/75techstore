// 75Backend/models/Blog.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      sparse: true  // ✅ Prevents null duplicate errors
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    excerpt: {
      type: String,
      default: ''
    },
    coverImage: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      enum: [
        'Tech News', 'Product Reviews', 'How To',
        'Deals & Offers', 'Gaming', 'Phones',
        'Laptops', 'Accessories', 'Other'
      ],
      default: 'Tech News'
    },
    tags: [{ type: String }],
    author: {
      type: String,
      default: '75TechStore Team'
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    readTime: { type: Number, default: 5 },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  { timestamps: true }
);

// ✅ FIXED pre-save hook
blogSchema.pre('save', function (next) {
  try {
    // ✅ Auto generate UNIQUE slug
    if (this.isModified('title')) {
      const baseSlug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      this.slug = `${baseSlug}-${Date.now()}`;  // ✅ Always unique
    }

    // ✅ Auto generate excerpt
    if (this.isModified('content') && !this.excerpt) {
      this.excerpt = this.content
        .replace(/<[^>]*>/g, '')
        .substring(0, 160) + '...';
    }

    // ✅ FIXED - stray 'a' removed
    if (this.isModified('content')) {
      const wordCount = this.content
        .replace(/<[^>]*>/g, '')
        .split(/\s+/).length;
      this.readTime = Math.ceil(wordCount / 200);
    }

    next();
  } catch (error) {
    console.error('❌ Blog pre-save error:', error.message);
    next(error);
  }
});

export const Blog = mongoose.model('Blog', blogSchema);