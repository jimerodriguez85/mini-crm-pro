const prisma = require("../config/database");

async function getAll(req, res, next) {
  try {
    const { completed } = req.query;
    const where = {};
    if (completed !== undefined) where.completed = completed === "true";

    const reminders = await prisma.reminder.findMany({
      where,
      orderBy: { dueDate: "asc" },
      include: {
        client: { select: { id: true, name: true } },
        user: { select: { name: true } },
      },
    });

    res.json(reminders);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { title, dueDate, clientId } = req.body;

    if (!title || !dueDate || !clientId) {
      return res.status(400).json({ error: "Titulo, fecha y cliente son requeridos" });
    }

    const reminder = await prisma.reminder.create({
      data: {
        title,
        dueDate: new Date(dueDate),
        userId: req.user.id,
        clientId,
      },
      include: {
        client: { select: { id: true, name: true } },
        user: { select: { name: true } },
      },
    });

    await prisma.activity.create({
      data: {
        action: "reminder_created",
        details: `Recordatorio: "${title}"`,
        clientName: reminder.client.name,
        userId: req.user.id,
        clientId,
      },
    });

    res.status(201).json(reminder);
  } catch (err) {
    next(err);
  }
}

async function toggle(req, res, next) {
  try {
    const current = await prisma.reminder.findUnique({ where: { id: req.params.id } });
    if (!current) return res.status(404).json({ error: "Recordatorio no encontrado" });

    const reminder = await prisma.reminder.update({
      where: { id: req.params.id },
      data: { completed: !current.completed },
      include: {
        client: { select: { id: true, name: true } },
      },
    });

    res.json(reminder);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await prisma.reminder.delete({ where: { id: req.params.id } });
    res.json({ message: "Recordatorio eliminado" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, create, toggle, remove };
