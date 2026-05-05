const express = require('express');
const router = express.Router();

const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  closeTicket,
  reopenTicket,
  assignTicket
} = require('../controllers/ticket.controller');

const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { ticketValidators } = require('../utils/validators');

router.use(protect);

router.post('/', ticketValidators.create, validate, createTicket);
router.get('/', ticketValidators.list, validate, getTickets);
router.get('/:id', ticketValidators.getById, validate, getTicketById);
router.put('/:id', ticketValidators.update, validate, updateTicket);
router.post('/:id/close', ticketValidators.getById, validate, closeTicket);
router.post('/:id/reopen', ticketValidators.getById, validate, reopenTicket);
router.post('/:id/assign', protect, authorize('admin'), assignTicket);

module.exports = router;
