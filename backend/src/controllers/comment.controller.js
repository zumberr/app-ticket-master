const commentService = require('../services/comment.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   POST /api/v1/tickets/:ticketId/comments
 * @desc    Crear comentario en un ticket
 * @access  Private
 */
const createComment = asyncHandler(async (req, res) => {
  const comment = await commentService.createComment(
    req.params.ticketId,
    req.body,
    req.user._id.toString(),
    req.user.role
  );

  res.status(201).json({
    success: true,
    message: 'Comentario creado exitosamente',
    data: { comment }
  });
});

/**
 * @route   PUT /api/v1/comments/:id
 * @desc    Actualizar comentario
 * @access  Private
 */
const updateComment = asyncHandler(async (req, res) => {
  const comment = await commentService.updateComment(
    req.params.id,
    req.body.content,
    req.user._id.toString(),
    req.user.role
  );

  res.status(200).json({
    success: true,
    message: 'Comentario actualizado exitosamente',
    data: { comment }
  });
});

/**
 * @route   DELETE /api/v1/comments/:id
 * @desc    Eliminar comentario
 * @access  Private
 */
const deleteComment = asyncHandler(async (req, res) => {
  const result = await commentService.deleteComment(
    req.params.id,
    req.user._id.toString(),
    req.user.role
  );

  res.status(200).json({
    success: true,
    message: result.message
  });
});

module.exports = {
  createComment,
  updateComment,
  deleteComment
};
