import { api } from "./api";

export const sendEmail = (clientId, subject, body) =>
  api.post(`/email/send/${clientId}`, { subject, body });

export const getWhatsAppLink = (phone, message) =>
  api.post("/email/whatsapp", { phone, message });
