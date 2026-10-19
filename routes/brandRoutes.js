import express from 'express';
import { upload } from '../config/cloudinary.js';
import {
  createBrand,
  getAllBrands,
  getModelsByBrand,
  addModelToBrand,
  deleteBrandOrModel,
  updateModelAvailability,
  editModel,
} from '../controllers/brandController.js';

const router = express.Router();

router.post('/create', upload.fields([{ name: 'images', maxCount: 50 }]), createBrand);
router.get('/brands', getAllBrands);
router.get('/models/:brand', getModelsByBrand);
router.post('/add-model/:brand', upload.single('image'), addModelToBrand);
router.delete('/delete/:brand/:modelName?', deleteBrandOrModel);
router.patch('/models/:brand/:modelName', updateModelAvailability);
router.patch('/edit/:brand/:modelName', upload.single('image'), editModel);

export default router;
