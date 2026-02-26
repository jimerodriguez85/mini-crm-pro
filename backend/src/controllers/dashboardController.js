const prisma = require("../config/database");

async function getStats(req, res, next) {
  try {
    const [totalClients, totalReminders, recentActivities, pipelineCounts] =
      await Promise.all([
        prisma.client.count(),
        prisma.reminder.count({ where: { completed: false } }),
        prisma.activity.count({
          where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        }),
        prisma.client.groupBy({
          by: ["pipeline"],
          _count: { id: true },
        }),
      ]);

    const pipeline = {};
    pipelineCounts.forEach((p) => {
      pipeline[p.pipeline] = p._count.id;
    });

    // Clients by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const clientsByMonth = await prisma.client.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const monthlyData = {};
    clientsByMonth.forEach((c) => {
      const key = `${c.createdAt.getFullYear()}-${String(c.createdAt.getMonth() + 1).padStart(2, "0")}`;
      monthlyData[key] = (monthlyData[key] || 0) + 1;
    });

    // Clients by company
    const byCompany = await prisma.client.groupBy({
      by: ["company"],
      _count: { id: true },
      where: { company: { not: "" } },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });

    res.json({
      totalClients,
      totalReminders,
      recentActivities,
      pipeline,
      monthlyData: Object.entries(monthlyData).map(([month, count]) => ({ month, count })),
      byCompany: byCompany.map((c) => ({ company: c.company, count: c._count.id })),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };
