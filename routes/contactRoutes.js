import express from 'express';
import {
  getContacts,
  createContact,
  replyToContact,
  deleteContact,
} from '../controllers/contactController.js';

const router = express.Router();

router.get('/getContacts', getContacts);
router.post('/contact', createContact);
router.post('/replyToContact', replyToContact);
router.delete('/deleteContact/:id', deleteContact);

export default router;
