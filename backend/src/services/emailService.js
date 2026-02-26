const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

async function sendEmail({ to, subject, html }) {
  const transport = getTransporter();

  const info = await transport.sendMail({
    from: process.env.EMAIL_FROM || "Mini CRM <noreply@minicrm.com>",
    to,
    subject,
    html,
  });

  console.log(`[Email] Enviado a ${to}: ${info.messageId}`);
  return info;
}

module.exports = { sendEmail };
