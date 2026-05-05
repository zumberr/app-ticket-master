const express = require('express');
const router = express.Router();

const { createComment, updateComment, deleteComment } = require('../controllers/comment.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { commentValidators } = require('../utils/validators');

router.use(protect);

router.post('/:ticketId', commentValidators.create, validate, createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
