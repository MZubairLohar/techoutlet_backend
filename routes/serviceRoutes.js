import express from 'express';
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';

const router = express.Router();

router.get('/getAllServices', getAllServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.post('/createService', createService);
router.put('/updateService/:id', updateService);
router.delete('/deleteService/:id', deleteService);

export default router;
