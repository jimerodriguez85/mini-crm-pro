import { api } from "./api";

export const fetchClients = (query = "", pipeline = "") => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (pipeline) params.set("pipeline", pipeline);
  const qs = params.toString();
  return api.get(`/clients${qs ? `?${qs}` : ""}`);
};

export const fetchClient = (id) => api.get(`/clients/${id}`);
export const createClient = (data) => api.post("/clients", data);
export const updateClient = (id, data) => api.put(`/clients/${id}`, data);
export const updatePipeline = (id, pipeline) => api.patch(`/clients/${id}/pipeline`, { pipeline });
export const deleteClient = (id) => api.delete(`/clients/${id}`);
