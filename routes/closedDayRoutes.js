import express from 'express';
import {
  getClosedDays,
  addClosedDay,
  deleteClosedDay,
} from '../controllers/closedDayController.js';

const router = express.Router();

router.get('/getClosedDays', getClosedDays);
router.post('/closeDay', addClosedDay);
router.delete('/closeDay/:id', deleteClosedDay);

export default router;
