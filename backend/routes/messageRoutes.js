const express = require('express');
const router = express.Router({ mergeParams: true });
const { getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMessages)
  .post(protect, sendMessage);

module.exports = router;
