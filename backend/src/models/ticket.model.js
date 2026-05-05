const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    trim: true,
    minlength: [5, 'El título debe tener al menos 5 caracteres'],
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
    maxlength: [5000, 'La descripción no puede exceder 5000 caracteres']
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed', 'reopened'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoría es requerida']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El creador es requerido']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
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
  history: [{
    action: {
      type: String,
      enum: ['created', 'status_changed', 'priority_changed', 'assigned', 'commented', 'closed', 'reopened']
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    oldValue: String,
    newValue: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  resolvedAt: {
    type: Date
  },
  closedAt: {
    type: Date
  },
  reopenCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para contar comentarios
// Nota: se actualiza con el conteo real en el controlador o con un plugin

// Índices para consultas frecuentes
// Buscar tickets por estado, prioridad, categoría, creador, asignado
ticketSchema.index({ status: 1, createdAt: -1 });
ticketSchema.index({ priority: 1, status: 1 });
ticketSchema.index({ category: 1 });
ticketSchema.index({ createdBy: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ ticketNumber: 1 });

// Middleware pre-save para generar número de ticket
// Formato: TK-YYYYMMDD-XXXX (donde XXXX es un contador)
ticketSchema.pre('save', async function(next) {
  if (!this.isNew || this.ticketNumber) return next();

  const today = new Date();
  const datePrefix = `TK-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

  // Contar tickets de hoy para el sufijo
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const count = await mongoose.model('Ticket').countDocuments({
    createdAt: { $gte: startOfDay, $lt: endOfDay }
  });

  this.ticketNumber = `${datePrefix}-${String(count + 1).padStart(4, '0')}`;
  next();
});

// Método para agregar entrada al historial
ticketSchema.methods.addHistoryEntry = function(action, performedBy, oldValue = null, newValue = null) {
  this.history.push({
    action,
    performedBy,
    oldValue,
    newValue,
    timestamp: new Date()
  });
};

// Método para cerrar ticket
ticketSchema.methods.close = function(performedBy) {
  this.status = 'closed';
  this.closedAt = new Date();
  this.addHistoryEntry('closed', performedBy, null, 'closed');
};

// Método para reabrir ticket
ticketSchema.methods.reopen = function(performedBy) {
  this.status = 'reopened';
  this.reopenCount += 1;
  this.resolvedAt = null;
  this.closedAt = null;
  this.addHistoryEntry('reopened', performedBy, 'closed', 'reopened');
};

// Método para resolver ticket
ticketSchema.methods.resolve = function(performedBy) {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  this.addHistoryEntry('status_changed', performedBy, 'in_progress', 'resolved');
};

module.exports = mongoose.model('Ticket', ticketSchema);
