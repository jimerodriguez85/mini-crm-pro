const prisma = require("../config/database");
const { sendEmail } = require("../services/emailService");
const { emit } = require("../socket");

async function sendToClient(req, res, next) {
  try {
    const { subject, body } = req.body;

    if (!subject || !body) {
      return res.status(400).json({ error: "Asunto y cuerpo son requeridos" });
    }

    const client = await prisma.client.findUnique({ where: { id: req.params.clientId } });
    if (!client) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    await sendEmail({
      to: client.email,
      subject,
      html: body,
    });

    await prisma.activity.create({
      data: {
        action: "email_sent",
        details: `Email enviado: "${subject}"`,
        clientName: client.name,
        userId: req.user.id,
        clientId: client.id,
      },
    });

    emit("email:sent", { clientId: client.id, subject, userName: req.user.name });
    res.json({ message: `Email enviado a ${client.email}` });
  } catch (err) {
    next(err);
  }
}

function whatsappLink(req, res, next) {
  try {
    const { phone } = req.query;
    const { message } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Telefono requerido" });
    }

    const clean = phone.replace(/[\s\-\(\)]/g, "").replace(/^\+/, "");
    const text = encodeURIComponent(message || "Hola, me comunico desde Mini CRM.");
    const url = `https://wa.me/${clean}?text=${text}`;

    res.json({ url });
  } catch (err) {
    next(err);
  }
}

module.exports = { sendToClient, whatsappLink };
