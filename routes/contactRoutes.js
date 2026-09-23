const express = require('express');
const router = express.Router();
const {
  createContactInquiry,
  getAllContactInquiries,
  updateContactStatus,
  deleteContactInquiry,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .post(createContactInquiry)
  .get(protect, adminOnly, getAllContactInquiries);

router.route('/:id/status')
  .put(protect, adminOnly, updateContactStatus);

router.route('/:id')
  .delete(protect, adminOnly, deleteContactInquiry);

module.exports = router;
