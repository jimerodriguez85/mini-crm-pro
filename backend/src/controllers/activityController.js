const prisma = require("../config/database");

async function getAll(req, res, next) {
  try {
    const { limit = 50 } = req.query;

    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: parseInt(limit),
      include: {
        user: { select: { name: true, role: true } },
        client: { select: { id: true, name: true } },
      },
    });

    res.json(activities);
  } catch (err) {
    next(err);
  }
}

async function getByClient(req, res, next) {
  try {
    const activities = await prisma.activity.findMany({
      where: { clientId: req.params.clientId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
      },
    });

    res.json(activities);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getByClient };
