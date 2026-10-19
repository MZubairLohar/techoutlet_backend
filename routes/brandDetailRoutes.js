import express from 'express';
import { upload } from '../config/cloudinary.js';
import {
  getBrandDetails,
  createBrandDetail,
  updateBrandDetail,
  deleteBrandDetail,
} from '../controllers/brandDetailController.js';

const router = express.Router();

router.get('/getBrandDetails', getBrandDetails);
router.post('/brandDetail', upload.single('image'), createBrandDetail);
router.put('/editBrandDetail/:id', upload.single('image'), updateBrandDetail);
router.delete('/deleteBrandDetail/:id', deleteBrandDetail);

export default router;
