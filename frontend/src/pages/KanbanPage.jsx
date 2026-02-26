import { useState, useEffect } from "react";
import { fetchClients, updatePipeline } from "../services/clientService";
import { useNotification } from "../context/NotificationContext";
import KanbanBoard from "../components/Kanban/KanbanBoard";
import Spinner from "../components/UI/Spinner";

const COLUMNS = [
  { id: "prospecto", title: "Prospecto", color: "border-yellow-400" },
  { id: "contactado", title: "Contactado", color: "border-blue-400" },
  { id: "cliente", title: "Cliente", color: "border-green-400" },
  { id: "cerrado", title: "Cerrado", color: "border-gray-400" },
];

export default function KanbanPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotification();

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      const data = await fetchClients();
      setClients(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleMove(clientId, newPipeline) {
    try {
      setClients((prev) =>
        prev.map((c) => (c.id === clientId ? { ...c, pipeline: newPipeline } : c))
      );
      await updatePipeline(clientId, newPipeline);
      notify(`Cliente movido a "${newPipeline}"`);
    } catch (err) {
      notify(err.message, "error");
      loadClients();
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center"><Spinner size="lg" /></div>
    );
  }

  return (
    <div className="p-6 lg:p-8 h-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pipeline</h1>
      <KanbanBoard columns={COLUMNS} clients={clients} onMove={handleMove} />
    </div>
  );
}
