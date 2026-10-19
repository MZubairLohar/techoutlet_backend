import express from 'express';
import { upload } from '../config/cloudinary.js';
import {
  getAccessories,
  createAccessory,
  updateAccessory,
  deleteAccessory,
} from '../controllers/accessoryController.js';

const router = express.Router();

router.get('/getAccessories', getAccessories);
const accessoryImages = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

router.post('/accessories', accessoryImages, createAccessory);
router.put('/accessories/:id', accessoryImages, updateAccessory);
router.delete('/deleteAccessory/:id', deleteAccessory);

export default router;
