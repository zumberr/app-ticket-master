const { dashboardService } = require('../services');

/**
 * GET /api/v1/dashboard/stats
 * Obtener estadísticas del dashboard
 */
const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats
};
