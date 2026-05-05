const Ticket = require('../models/ticket.model');
const Comment = require('../models/comment.model');
const logger = require('../utils/logger');

/**
 * Crear un nuevo ticket
 * @param {Object} ticketData - Datos del ticket
 * @param {string} userId - ID del usuario creador
 * @returns {Object} Ticket creado
 */
const createTicket = async (ticketData, userId) => {
  const ticket = await Ticket.create({
    ...ticketData,
    createdBy: userId,
    history: [{
      action: 'created',
      performedBy: userId,
      timestamp: new Date()
    }]
  });

  const populatedTicket = await Ticket.findById(ticket._id)
    .populate('createdBy', 'firstName lastName email studentId')
    .populate('category', 'name color')
    .populate('assignedTo', 'firstName lastName email');

  logger.info(`Ticket creado: ${ticket.ticketNumber} por usuario ${userId}`);

  return populatedTicket;
};

/**
 * Obtener lista de tickets con filtros y paginación
 * @param {Object} filters - Filtros de búsqueda
 * @param {Object} pagination - Opciones de paginación
 * @param {string} userId - ID del usuario (para filtrar por permisos)
 * @param {string} userRole - Rol del usuario
 * @returns {Object} Lista de tickets y metadatos de paginación
 */
const getTickets = async (filters = {}, pagination = {}, userId, userRole) => {
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;

  // Construir query
  const query = {};

  // Estudiantes solo ven sus propios tickets
  if (userRole === 'student') {
    query.createdBy = userId;
  }
  // Support solo ve tickets asignados o abiertos
  else if (userRole === 'support') {
    query.$or = [
      { assignedTo: userId },
      { assignedTo: null, status: 'open' }
    ];
  }
  // Admin ve todo

  // Aplicar filtros opcionales
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.category) query.category = filters.category;
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
      { ticketNumber: { $regex: filters.search, $options: 'i' } }
    ];
  }

  const [tickets, total] = await Promise.all([
    Ticket.find(query)
      .populate('createdBy', 'firstName lastName email studentId')
      .populate('category', 'name color icon')
      .populate('assignedTo', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Ticket.countDocuments(query)
  ]);

  return {
    tickets,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Obtener ticket por ID
 * @param {string} ticketId - ID del ticket
 * @param {string} userId - ID del usuario
 * @param {string} userRole - Rol del usuario
 * @returns {Object} Ticket con comentarios
 */
const getTicketById = async (ticketId, userId, userRole) => {
  const ticket = await Ticket.findById(ticketId)
    .populate('createdBy', 'firstName lastName email studentId')
    .populate('category', 'name color icon')
    .populate('assignedTo', 'firstName lastName email')
    .populate('history.performedBy', 'firstName lastName email');

  if (!ticket) {
    const error = new Error('Ticket no encontrado');
    error.statusCode = 404;
    throw error;
  }

  // Verificar permisos
  const isOwner = ticket.createdBy._id.toString() === userId;
  const isAssigned = ticket.assignedTo && ticket.assignedTo._id.toString() === userId;

  if (userRole === 'student' && !isOwner) {
    const error = new Error('No tienes permiso para ver este ticket');
    error.statusCode = 403;
    throw error;
  }

  if (userRole === 'support' && !isOwner && !isAssigned && ticket.status !== 'open') {
    const error = new Error('No tienes permiso para ver este ticket');
    error.statusCode = 403;
    throw error;
  }

  // Obtener comentarios
  const commentQuery = { ticket: ticketId };
  // Estudiantes no ven comentarios internos
  if (userRole === 'student') {
    commentQuery.isInternal = false;
  }

  const comments = await Comment.find(commentQuery)
    .populate('createdBy', 'firstName lastName email role')
    .populate('editedBy', 'firstName lastName email')
    .sort({ createdAt: 1 });

  return {
    ticket,
    comments
  };
};

/**
 * Actualizar ticket
 * @param {string} ticketId - ID del ticket
 * @param {Object} updateData - Datos a actualizar
 * @param {string} userId - ID del usuario que actualiza
 * @param {string} userRole - Rol del usuario
 * @returns {Object} Ticket actualizado
 */
const updateTicket = async (ticketId, updateData, userId, userRole) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    const error = new Error('Ticket no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const isOwner = ticket.createdBy.toString() === userId;

  // Estudiantes solo pueden editar tickets abiertos creados por ellos
  if (userRole === 'student') {
    if (!isOwner) {
      const error = new Error('No tienes permiso para editar este ticket');
      error.statusCode = 403;
      throw error;
    }
    if (ticket.status !== 'open') {
      const error = new Error('Solo puedes editar tickets abiertos');
      error.statusCode = 403;
      throw error;
    }
    // Estudiantes solo pueden editar título y descripción
    delete updateData.status;
    delete updateData.priority;
    delete updateData.assignedTo;
  }

  // Registrar cambios en historial
  if (updateData.status && updateData.status !== ticket.status) {
    ticket.addHistoryEntry('status_changed', userId, ticket.status, updateData.status);

    if (updateData.status === 'resolved') {
      ticket.resolve(userId);
      delete updateData.status;
      delete updateData.resolvedAt;
    }
  }

  if (updateData.priority && updateData.priority !== ticket.priority) {
    ticket.addHistoryEntry('priority_changed', userId, ticket.priority, updateData.priority);
  }

  if (updateData.assignedTo && updateData.assignedTo !== (ticket.assignedTo?.toString() || null)) {
    ticket.addHistoryEntry('assigned', userId,
      ticket.assignedTo ? ticket.assignedTo.toString() : 'unassigned',
      updateData.assignedTo
    );
  }

  // Aplicar actualizaciones
  Object.keys(updateData).forEach(key => {
    if (updateData[key] !== undefined) {
      ticket[key] = updateData[key];
    }
  });

  await ticket.save();

  const updatedTicket = await Ticket.findById(ticketId)
    .populate('createdBy', 'firstName lastName email studentId')
    .populate('category', 'name color icon')
    .populate('assignedTo', 'firstName lastName email');

  logger.info(`Ticket actualizado: ${ticket.ticketNumber} por usuario ${userId}`);

  return updatedTicket;
};

/**
 * Cerrar ticket
 * @param {string} ticketId - ID del ticket
 * @param {string} userId - ID del usuario que cierra
 * @param {string} userRole - Rol del usuario
 * @returns {Object} Ticket cerrado
 */
const closeTicket = async (ticketId, userId, userRole) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    const error = new Error('Ticket no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const isOwner = ticket.createdBy.toString() === userId;

  // Estudiantes solo pueden cerrar sus propios tickets resueltos
  if (userRole === 'student' && !isOwner) {
    const error = new Error('No tienes permiso para cerrar este ticket');
    error.statusCode = 403;
    throw error;
  }

  ticket.close(userId);
  await ticket.save();

  const closedTicket = await Ticket.findById(ticketId)
    .populate('createdBy', 'firstName lastName email studentId')
    .populate('category', 'name color icon')
    .populate('assignedTo', 'firstName lastName email');

  logger.info(`Ticket cerrado: ${ticket.ticketNumber} por usuario ${userId}`);

  return closedTicket;
};

/**
 * Reabrir ticket
 * @param {string} ticketId - ID del ticket
 * @param {string} userId - ID del usuario que reabre
 * @returns {Object} Ticket reabierto
 */
const reopenTicket = async (ticketId, userId) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    const error = new Error('Ticket no encontrado');
    error.statusCode = 404;
    throw error;
  }

  if (ticket.status !== 'closed' && ticket.status !== 'resolved') {
    const error = new Error('Solo se pueden reabrir tickets cerrados o resueltos');
    error.statusCode = 400;
    throw error;
  }

  ticket.reopen(userId);
  await ticket.save();

  const reopenedTicket = await Ticket.findById(ticketId)
    .populate('createdBy', 'firstName lastName email studentId')
    .populate('category', 'name color icon')
    .populate('assignedTo', 'firstName lastName email');

  logger.info(`Ticket reabierto: ${ticket.ticketNumber} por usuario ${userId}`);

  return reopenedTicket;
};

/**
 * Asignar ticket a un agente de soporte
 * @param {string} ticketId - ID del ticket
 * @param {string} supportId - ID del agente de soporte
 * @param {string} adminId - ID del admin que asigna
 * @returns {Object} Ticket asignado
 */
const assignTicket = async (ticketId, supportId, adminId) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    const error = new Error('Ticket no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const oldAssigned = ticket.assignedTo ? ticket.assignedTo.toString() : null;
  ticket.assignedTo = supportId;
  ticket.status = 'in_progress';
  ticket.addHistoryEntry('assigned', adminId, oldAssigned || 'unassigned', supportId);
  ticket.addHistoryEntry('status_changed', adminId, 'open', 'in_progress');

  await ticket.save();

  const assignedTicket = await Ticket.findById(ticketId)
    .populate('createdBy', 'firstName lastName email studentId')
    .populate('category', 'name color icon')
    .populate('assignedTo', 'firstName lastName email');

  logger.info(`Ticket asignado: ${ticket.ticketNumber} a soporte ${supportId}`);

  return assignedTicket;
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
