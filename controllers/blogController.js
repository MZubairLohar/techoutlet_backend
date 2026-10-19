import Blog from '../models/Blog.js';

// @desc    Get all blogs
// @route   GET /api/v1/getBlogs
// @access  Public
export const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
      message: blogs,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Create a new blog
// @route   POST /api/v1/blogs
// @access  Public
export const createBlog = async (req, res, next) => {
  try {
    const { title, content, author, category, verified } = req.body;
    const image = req.file ? req.file.path : null;

    if (!title || !content || !author) {
      return res.status(400).json({ success: false, message: 'Title, content, and author are required' });
    }

    const isVerified = verified === true || verified === 'true';
    const blog = await Blog.create({
      title,
      content,
      author,
      category,
      image,
      verified: isVerified,
    });

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Like/Dislike blog
// @route   PUT /api/v1/likeDislike/:id
// @access  Public
export const likeDislikeBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, type } = req.body;

    if (!email || !type) {
      return res.status(400).json({ success: false, message: 'Email and type (like/dislike) are required' });
    }
    if (!['like', 'dislike'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be like or dislike' });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Check if user already reacted
    const existingReaction = blog.reactions.find(r => r.email === email);

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Remove reaction
        blog.reactions = blog.reactions.filter(r => r.email !== email);
        if (type === 'like') blog.likes--;
        else blog.dislikes--;
      } else {
        // Change reaction
        existingReaction.type = type;
        if (type === 'like') {
          blog.likes++;
          blog.dislikes--;
        } else {
          blog.dislikes++;
          blog.likes--;
        }
      }
    } else {
      // Add new reaction
      blog.reactions.push({ email, type });
      if (type === 'like') blog.likes++;
      else blog.dislikes++;
    }

    await blog.save();
    const userReaction = blog.reactions.find((reaction) => reaction.email === email)?.type || null;

    res.status(200).json({
      success: true,
      data: { ...blog.toObject(), userReaction },
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    React to blog
// @route   POST /api/v1/react/:id
// @access  Public
export const reactToBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, type } = req.body;

    if (!type || !['like', 'dislike'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be like or dislike' });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (!email) {
      if (type === 'like') blog.likes += 1;
      else blog.dislikes += 1;

      await blog.save();
    } else {
      const existingReaction = blog.reactions.find((reaction) => reaction.email === email);

      if (existingReaction) {
        existingReaction.type = type;
      } else {
        blog.reactions.push({ email, type });
      }

      blog.likes = blog.reactions.filter((reaction) => reaction.type === 'like').length;
      blog.dislikes = blog.reactions.filter((reaction) => reaction.type === 'dislike').length;
      await blog.save();
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/v1/deleteBlog/:id
// @access  Public
export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};
