import { toggleReminder, deleteReminder } from "../../services/reminderService";
import { useNotification } from "../../context/NotificationContext";
import { formatDate } from "../../utils/helpers";

export default function ReminderList({ reminders, onChanged, showClient = false }) {
  const { notify } = useNotification();

  async function handleToggle(id) {
    try {
      await toggleReminder(id);
      onChanged?.();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteReminder(id);
      notify("Recordatorio eliminado");
      onChanged?.();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  if (reminders.length === 0) {
    return (
      <div className="card p-8 text-center text-gray-400 text-sm">
        Sin recordatorios
      </div>
    );
  }

  const now = new Date();

  return (
    <div className="card divide-y">
      {reminders.map((r) => {
        const overdue = !r.completed && new Date(r.dueDate) < now;
        return (
          <div key={r.id} className="flex items-center gap-3 p-4">
            <button
              onClick={() => handleToggle(r.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                r.completed
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 hover:border-blue-500"
              }`}
            >
              {r.completed && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${r.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
                {r.title}
              </p>
              <div className="flex gap-2 text-xs mt-0.5">
                <span className={overdue ? "text-red-500 font-medium" : "text-gray-400"}>
                  {formatDate(r.dueDate)}
                </span>
                {showClient && r.client && (
                  <span className="text-gray-400">— {r.client.name}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDelete(r.id)}
              className="text-gray-300 hover:text-red-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
