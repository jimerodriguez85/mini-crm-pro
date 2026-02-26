const prisma = require("../config/database");
const { emit } = require("../socket");

async function getAll(req, res, next) {
  try {
    const { q, pipeline } = req.query;
    const where = {};

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
        { company: { contains: q } },
        { phone: { contains: q } },
      ];
    }

    if (pipeline) {
      where.pipeline = pipeline;
    }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { files: true, reminders: true } },
      },
    });

    res.json(clients);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: req.params.id },
      include: {
        files: { orderBy: { createdAt: "desc" } },
        reminders: { orderBy: { dueDate: "asc" }, include: { user: { select: { name: true } } } },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 50,
          include: { user: { select: { name: true } } },
        },
      },
    });

    if (!client) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(client);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, email, phone, company, pipeline } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: "Nombre requerido (min 2 caracteres)" });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Email invalido" });
    }

    const client = await prisma.client.create({
      data: { name, email, phone: phone || "", company: company || "", pipeline: pipeline || "prospecto" },
    });

    await prisma.activity.create({
      data: {
        action: "created",
        details: `Cliente ${client.name} creado`,
        clientName: client.name,
        userId: req.user.id,
        clientId: client.id,
      },
    });

    emit("client:created", { client, userName: req.user.name });
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { name, email, phone, company, pipeline } = req.body;

    if (name !== undefined && name.trim().length < 2) {
      return res.status(400).json({ error: "Nombre requerido (min 2 caracteres)" });
    }
    if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Email invalido" });
    }

    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;
    if (company !== undefined) data.company = company;
    if (pipeline !== undefined) data.pipeline = pipeline;

    const client = await prisma.client.update({
      where: { id: req.params.id },
      data,
    });

    await prisma.activity.create({
      data: {
        action: "updated",
        details: `Cliente ${client.name} actualizado`,
        clientName: client.name,
        userId: req.user.id,
        clientId: client.id,
      },
    });

    emit("client:updated", { client, userName: req.user.name });
    res.json(client);
  } catch (err) {
    next(err);
  }
}

async function updatePipeline(req, res, next) {
  try {
    const { pipeline } = req.body;
    const valid = ["prospecto", "contactado", "cliente", "cerrado"];

    if (!valid.includes(pipeline)) {
      return res.status(400).json({ error: `Pipeline debe ser: ${valid.join(", ")}` });
    }

    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: { pipeline },
    });

    await prisma.activity.create({
      data: {
        action: "pipeline_changed",
        details: `${client.name} movido a "${pipeline}"`,
        clientName: client.name,
        userId: req.user.id,
        clientId: client.id,
      },
    });

    emit("client:pipeline", { client, userName: req.user.name });
    res.json(client);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const client = await prisma.client.findUnique({ where: { id: req.params.id } });
    if (!client) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    await prisma.client.delete({ where: { id: req.params.id } });

    await prisma.activity.create({
      data: {
        action: "deleted",
        details: `Cliente ${client.name} eliminado`,
        clientName: client.name,
        userId: req.user.id,
        clientId: null,
      },
    });

    emit("client:deleted", { clientId: client.id, userName: req.user.name });
    res.json({ message: "Cliente eliminado" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, updatePipeline, remove };
