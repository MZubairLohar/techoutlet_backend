import express from 'express';
import { upload } from '../config/cloudinary.js';
import {
  getBlogs,
  createBlog,
  likeDislikeBlog,
  reactToBlog,
  deleteBlog,
} from '../controllers/blogController.js';

const router = express.Router();

router.get('/getBlogs', getBlogs);
router.post('/blogs', upload.single('image'), createBlog);
router.put('/likeDislike/:id', likeDislikeBlog);
router.post('/react/:id', reactToBlog);
router.delete('/deleteBlog/:id', deleteBlog);

export default router;
