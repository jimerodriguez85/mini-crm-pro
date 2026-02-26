import { useState } from "react";
import { createReminder } from "../../services/reminderService";
import { useNotification } from "../../context/NotificationContext";
import Button from "../UI/Button";

export default function ReminderForm({ clientId, clients, onCreated }) {
  const [form, setForm] = useState({ title: "", dueDate: "", clientId: clientId || "" });
  const { notify } = useNotification();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createReminder({ ...form, clientId: form.clientId || clientId });
      notify("Recordatorio creado");
      setForm({ title: "", dueDate: "", clientId: clientId || "" });
      onCreated?.();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 flex flex-col sm:flex-row gap-3">
      {!clientId && clients && (
        <select
          value={form.clientId}
          onChange={(e) => setForm({ ...form, clientId: e.target.value })}
          className="input-field sm:w-48"
          required
        >
          <option value="">Seleccionar cliente...</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      )}
      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="input-field flex-1"
        placeholder="Titulo del recordatorio..."
        required
      />
      <input
        type="datetime-local"
        value={form.dueDate}
        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        className="input-field sm:w-52"
        required
      />
      <Button type="submit">Crear</Button>
    </form>
  );
}
