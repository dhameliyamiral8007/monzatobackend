const express = require('express');
const router = express.Router();
const {
  getPages,
  getPageBySlug,
  createOrUpdatePage,
  deletePage,
} = require('../controllers/pageController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPages)
  .post(protect, adminOnly, createOrUpdatePage);

router.route('/:slug')
  .get(getPageBySlug);

router.route('/id/:id')
  .put(protect, adminOnly, createOrUpdatePage)
  .delete(protect, adminOnly, deletePage);

module.exports = router;
