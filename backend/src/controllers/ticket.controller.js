const { ticketService } = require('../services');

/**
 * POST /api/v1/tickets
 * Crear un nuevo ticket
 */
const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.createTicket(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Ticket creado exitosamente',
      data: { ticket }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/tickets
 * Obtener lista de tickets
 */
const getTickets = async (req, res, next) => {
  try {
    const { page, limit, status, priority, category, search } = req.query;
    const result = await ticketService.getTickets(
      { status, priority, category, search },
      { page, limit },
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/tickets/:id
 * Obtener ticket por ID
 */
const getTicketById = async (req, res, next) => {
  try {
    const result = await ticketService.getTicketById(
      req.params.id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/tickets/:id
 * Actualizar ticket
 */
const updateTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.updateTicket(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Ticket actualizado exitosamente',
      data: { ticket }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/tickets/:id/close
 * Cerrar ticket
 */
const closeTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.closeTicket(
      req.params.id,
      req.user.id,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: 'Ticket cerrado exitosamente',
      data: { ticket }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/tickets/:id/reopen
 * Reabrir ticket
 */
const reopenTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.reopenTicket(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Ticket reabierto exitosamente',
      data: { ticket }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/tickets/:id/assign
 * Asignar ticket (solo admin)
 */
const assignTicket = async (req, res, next) => {
  try {
    const { supportId } = req.body;
    const ticket = await ticketService.assignTicket(req.params.id, supportId, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Ticket asignado exitosamente',
      data: { ticket }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  closeTicket,
  reopenTicket,
  assignTicket
};
