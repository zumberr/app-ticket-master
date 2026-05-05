const Ticket = require('../models/ticket.model');
const User = require('../models/user.model');
const Category = require('../models/category.model');

/**
 * Obtener estadísticas del dashboard
 * @returns {Object} Estadísticas generales
 */
const getDashboardStats = async () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Conteos generales
  const [
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets,
    closedTickets,
    urgentTickets,
    todayTickets,
    weekTickets,
    monthTickets,
    totalUsers,
    totalStudents,
    totalSupport,
    totalCategories
  ] = await Promise.all([
    Ticket.countDocuments(),
    Ticket.countDocuments({ status: 'open' }),
    Ticket.countDocuments({ status: 'in_progress' }),
    Ticket.countDocuments({ status: 'resolved' }),
    Ticket.countDocuments({ status: 'closed' }),
    Ticket.countDocuments({ priority: 'urgent', status: { $nin: ['closed', 'resolved'] } }),
    Ticket.countDocuments({ createdAt: { $gte: startOfDay } }),
    Ticket.countDocuments({ createdAt: { $gte: startOfWeek } }),
    Ticket.countDocuments({ createdAt: { $gte: startOfMonth } }),
    User.countDocuments(),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'support' }),
    Category.countDocuments({ isActive: true })
  ]);

  // Tickets por categoría
  const ticketsByCategory = await Ticket.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
    { $unwind: '$category' },
    { $project: { name: '$category.name', color: '$category.color', count: 1 } }
  ]);

  // Tickets por prioridad
  const ticketsByPriority = await Ticket.aggregate([
    { $group: { _id: '$priority', count: { $sum: 1 } } }
  ]);

  // Tickets por estado
  const ticketsByStatus = await Ticket.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // Tiempo promedio de resolución (en horas)
  const resolutionTimes = await Ticket.aggregate([
    {
      $match: {
        status: { $in: ['resolved', 'closed'] },
        resolvedAt: { $exists: true }
      }
    },
    {
      $project: {
        resolutionTime: {
          $divide: [
            { $subtract: ['$resolvedAt', '$createdAt'] },
            1000 * 60 * 60 // Convertir a horas
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        avgResolutionTime: { $avg: '$resolutionTime' }
      }
    }
  ]);

  // Tickets recientes
  const recentTickets = await Ticket.find()
    .populate('createdBy', 'firstName lastName')
    .populate('category', 'name color')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return {
    overview: {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      urgentTickets,
      avgResolutionTime: resolutionTimes[0]?.avgResolutionTime || 0
    },
    activity: {
      today: todayTickets,
      thisWeek: weekTickets,
      thisMonth: monthTickets
    },
    users: {
      total: totalUsers,
      students: totalStudents,
      support: totalSupport
    },
    categories: {
      total: totalCategories,
      distribution: ticketsByCategory
    },
    ticketsByPriority: ticketsByPriority.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, { low: 0, medium: 0, high: 0, urgent: 0 }),
    ticketsByStatus: ticketsByStatus.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, { open: 0, in_progress: 0, resolved: 0, closed: 0, reopened: 0 }),
    recentTickets
  };
};

module.exports = {
  getDashboardStats
};
