import express from 'express';
import {
  createRepairingRequest,
  getRepairingRequests,
} from '../controllers/appointmentController.js';

const router = express.Router();

router.get('/getRepairingRequest', getRepairingRequests);
router.post('/sendRepairingRequest', createRepairingRequest);

export default router;
