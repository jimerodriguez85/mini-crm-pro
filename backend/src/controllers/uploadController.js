const path = require("path");
const fs = require("fs");
const prisma = require("../config/database");
const { emit } = require("../socket");

async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se envio ningun archivo" });
    }

    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimeType: req.file.mimetype,
        clientId: req.params.clientId,
      },
    });

    const client = await prisma.client.findUnique({ where: { id: req.params.clientId } });

    await prisma.activity.create({
      data: {
        action: "file_uploaded",
        details: `Archivo "${req.file.originalname}" subido`,
        clientName: client?.name || "",
        userId: req.user.id,
        clientId: req.params.clientId,
      },
    });

    emit("file:uploaded", { file, clientId: req.params.clientId, userName: req.user.name });
    res.status(201).json(file);
  } catch (err) {
    next(err);
  }
}

async function getFiles(req, res, next) {
  try {
    const files = await prisma.file.findMany({
      where: { clientId: req.params.clientId },
      orderBy: { createdAt: "desc" },
    });
    res.json(files);
  } catch (err) {
    next(err);
  }
}

async function deleteFile(req, res, next) {
  try {
    const file = await prisma.file.findUnique({ where: { id: req.params.id } });
    if (!file) return res.status(404).json({ error: "Archivo no encontrado" });

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await prisma.file.delete({ where: { id: req.params.id } });
    res.json({ message: "Archivo eliminado" });
  } catch (err) {
    next(err);
  }
}

async function downloadFile(req, res, next) {
  try {
    const file = await prisma.file.findUnique({ where: { id: req.params.id } });
    if (!file) return res.status(404).json({ error: "Archivo no encontrado" });

    res.download(path.resolve(file.path), file.name);
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadFile, getFiles, deleteFile, downloadFile };
