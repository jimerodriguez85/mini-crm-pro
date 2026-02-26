import { api } from "./api";

export const fetchActivities = (limit = 50) => api.get(`/activities?limit=${limit}`);
export const fetchClientActivities = (clientId) => api.get(`/activities/client/${clientId}`);
