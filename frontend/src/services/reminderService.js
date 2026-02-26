import { api } from "./api";

export const fetchReminders = (completed) => {
  const qs = completed !== undefined ? `?completed=${completed}` : "";
  return api.get(`/reminders${qs}`);
};

export const createReminder = (data) => api.post("/reminders", data);
export const toggleReminder = (id) => api.patch(`/reminders/${id}/toggle`, {});
export const deleteReminder = (id) => api.delete(`/reminders/${id}`);
