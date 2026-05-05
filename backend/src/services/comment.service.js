const Comment = require('../models/comment.model');
const Ticket = require('../models/ticket.model');
const logger = require('../utils/logger');

/**
 * Crear un comentario en un ticket
 * @param {string} ticketId - ID del ticket
 * @param {Object} commentData - Datos del comentario
 * @param {string} userId - ID del usuario que comenta
 * @param {string} userRole - Rol del usuario
 * @returns {Object} Comentario creado
 */
const createComment = async (ticketId, commentData, userId, userRole) => {
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    const error = new Error('Ticket no encontrado');
    error.statusCode = 404;
    throw error;
  }

  // Verificar permisos
  const isOwner = ticket.createdBy.toString() === userId;
  const isAssigned = ticket.assignedTo && ticket.assignedTo.toString() === userId;

  if (userRole === 'student' && !isOwner) {
    const error = new Error('No tienes permiso para comentar en este ticket');
    error.statusCode = 403;
    throw error;
  }

  if (userRole === 'support' && !isOwner && !isAssigned) {
    const error = new Error('No tienes permiso para comentar en este ticket');
    error.statusCode = 403;
    throw error;
  }

  // Solo admin/support pueden crear comentarios internos
  if (commentData.isInternal && userRole === 'student') {
    const error = new Error('No tienes permiso para crear comentarios internos');
    error.statusCode = 403;
    throw error;
  }

  const comment = await Comment.create({
    ticket: ticketId,
    content: commentData.content,
    createdBy: userId,
    isInternal: commentData.isInternal || false,
    attachments: commentData.attachments || []
  });

  // Agregar entrada al historial del ticket
  ticket.addHistoryEntry('commented', userId);
  await ticket.save();

  const populatedComment = await Comment.findById(comment._id)
    .populate('createdBy', 'firstName lastName email role');

  logger.info(`Comentario creado en ticket ${ticketId} por usuario ${userId}`);

  return populatedComment;
};

/**
 * Actualizar un comentario
 * @param {string} commentId - ID del comentario
 * @param {string} content - Nuevo contenido
 * @param {string} userId - ID del usuario que edita
 * @param {string} userRole - Rol del usuario
 * @returns {Object} Comentario actualizado
 */
const updateComment = async (commentId, content, userId, userRole) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    const error = new Error('Comentario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  // Solo el autor o admin puede editar
  const isAuthor = comment.createdBy.toString() === userId;
  if (!isAuthor && userRole !== 'admin') {
    const error = new Error('No tienes permiso para editar este comentario');
    error.statusCode = 403;
    throw error;
  }

  comment.content = content;
  comment.editedAt = new Date();
  comment.editedBy = userId;
  await comment.save();

  const updatedComment = await Comment.findById(commentId)
    .populate('createdBy', 'firstName lastName email role')
    .populate('editedBy', 'firstName lastName email');

  logger.info(`Comentario ${commentId} actualizado por usuario ${userId}`);

  return updatedComment;
};

/**
 * Eliminar un comentario
 * @param {string} commentId - ID del comentario
 * @param {string} userId - ID del usuario
 * @param {string} userRole - Rol del usuario
 */
const deleteComment = async (commentId, userId, userRole) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    const error = new Error('Comentario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const isAuthor = comment.createdBy.toString() === userId;
  if (!isAuthor && userRole !== 'admin') {
    const error = new Error('No tienes permiso para eliminar este comentario');
    error.statusCode = 403;
    throw error;
  }

  await Comment.findByIdAndDelete(commentId);

  logger.info(`Comentario ${commentId} eliminado por usuario ${userId}`);

  return { message: 'Comentario eliminado exitosamente' };
};

module.exports = {
  createComment,
  updateComment,
  deleteComment
};
