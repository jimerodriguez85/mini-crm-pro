import { api } from "./api";

export const uploadFile = (clientId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.upload(`/files/client/${clientId}`, formData);
};

export const fetchFiles = (clientId) => api.get(`/files/client/${clientId}`);
export const deleteFile = (id) => api.delete(`/files/${id}`);
export const downloadUrl = (id) => `/api/files/${id}/download`;
