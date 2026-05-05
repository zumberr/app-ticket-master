const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: [true, 'El ticket es requerido'],
    index: true
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    trim: true,
    minlength: [1, 'El comentario debe tener al menos 1 carácter'],
    maxlength: [2000, 'El comentario no puede exceder 2000 caracteres']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El autor es requerido']
  },
  isInternal: {
    type: Boolean,
    default: false,
    description: 'Comentarios internos solo visibles por admin/support'
  },
  attachments: [{
    filename: String,
    url: String,
    mimetype: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  editedAt: {
    type: Date
  },
  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Índices
commentSchema.index({ ticket: 1, createdAt: -1 });
commentSchema.index({ createdBy: 1 });

// Virtual para saber si fue editado
commentSchema.virtual('isEdited').get(function() {
  return !!this.editedAt;
});

module.exports = mongoose.model('Comment', commentSchema);
