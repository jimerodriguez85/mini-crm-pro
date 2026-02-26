import { useState, useEffect } from "react";
import { fetchReminders } from "../services/reminderService";
import { fetchClients } from "../services/clientService";
import ReminderForm from "../components/Reminders/ReminderForm";
import ReminderList from "../components/Reminders/ReminderList";
import Spinner from "../components/UI/Spinner";

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    loadData();
  }, [filter]);

  async function loadData() {
    setLoading(true);
    try {
      const completed = filter === "completed" ? "true" : filter === "pending" ? "false" : undefined;
      const [r, c] = await Promise.all([fetchReminders(completed), fetchClients()]);
      setReminders(r);
      setClients(c);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Recordatorios</h1>

      <ReminderForm clients={clients} onCreated={loadData} />

      <div className="flex gap-2 my-6">
        {[
          { key: "pending", label: "Pendientes" },
          { key: "completed", label: "Completados" },
          { key: "all", label: "Todos" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <ReminderList reminders={reminders} onChanged={loadData} showClient />
      )}
    </div>
  );
}
