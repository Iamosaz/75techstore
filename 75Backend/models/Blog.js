// 75Backend/models/Blog.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,   // ✅ This auto-creates the slug index
      lowercase: true,
      trim: true
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    content: {
      type: String,
      required: [true, 'Blog content is required']
    },
    category: {
      type: String,
      default: 'Tech News',
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    coverImage: {
      type: String,
      default: ''
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    readTime: {
      type: Number,
      default: 5
    },
    metaDescription: {
      type: String,
      default: ''
    },
    views: {
      type: Number,
      default: 0
    },
    isAIGenerated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);


blogSchema.index({ status: 1, createdAt: -1 });
blogSchema.index({ category: 1 });

const Blog = mongoose.model('Blog', blogSchema);

// Named + Default Exports (works with all controller import styles)
export { Blog };
export default Blog;