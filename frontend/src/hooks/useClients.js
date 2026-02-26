import { useState, useEffect, useCallback } from "react";
import * as api from "../services/clientService";

export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchClients(query);
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => load(search), 300);
    return () => clearTimeout(timer);
  }, [search, load]);

  async function addClient(data) {
    const client = await api.createClient(data);
    setClients((prev) => [client, ...prev]);
    return client;
  }

  async function editClient(id, data) {
    const updated = await api.updateClient(id, data);
    setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }

  async function removeClient(id) {
    await api.deleteClient(id);
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  async function movePipeline(id, pipeline) {
    const updated = await api.updatePipeline(id, pipeline);
    setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }

  return {
    clients,
    loading,
    error,
    search,
    setSearch,
    addClient,
    editClient,
    removeClient,
    movePipeline,
    reload: load,
  };
}
