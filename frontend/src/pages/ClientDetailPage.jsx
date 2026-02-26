import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchClient } from "../services/clientService";
import { sendEmail, getWhatsAppLink } from "../services/emailService";
import { useNotification } from "../context/NotificationContext";
import Timeline from "../components/Activity/Timeline";
import FileUpload from "../components/Files/FileUpload";
import FileList from "../components/Files/FileList";
import ReminderForm from "../components/Reminders/ReminderForm";
import ReminderList from "../components/Reminders/ReminderList";
import Spinner from "../components/UI/Spinner";
import Button from "../components/UI/Button";

export default function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("timeline");
  const [emailForm, setEmailForm] = useState({ subject: "", body: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadClient();
  }, [id]);

  async function loadClient() {
    try {
      const data = await fetchClient(id);
      setClient(data);
    } catch {
      notify("Cliente no encontrado", "error");
      navigate("/clients");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendEmail(e) {
    e.preventDefault();
    setSending(true);
    try {
      await sendEmail(id, emailForm.subject, emailForm.body);
      notify("Email enviado");
      setEmailForm({ subject: "", body: "" });
      loadClient();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setSending(false);
    }
  }

  async function handleWhatsApp() {
    try {
      const { url } = await getWhatsAppLink(client.phone, `Hola ${client.name}, me comunico desde Mini CRM.`);
      window.open(url, "_blank");
    } catch (err) {
      notify(err.message, "error");
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center"><Spinner size="lg" /></div>
    );
  }

  if (!client) return null;

  const tabs = [
    { key: "timeline", label: "Actividad" },
    { key: "files", label: `Archivos (${client.files?.length || 0})` },
    { key: "reminders", label: `Recordatorios (${client.reminders?.length || 0})` },
    { key: "email", label: "Email" },
  ];

  const pipelineColors = {
    prospecto: "bg-yellow-100 text-yellow-700",
    contactado: "bg-blue-100 text-blue-700",
    cliente: "bg-green-100 text-green-700",
    cerrado: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <button onClick={() => navigate("/clients")} className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a clientes
      </button>

      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${pipelineColors[client.pipeline]}`}>
                {client.pipeline}
              </span>
            </div>
            <p className="text-gray-600">{client.email}</p>
            {client.phone && <p className="text-gray-500 text-sm">{client.phone}</p>}
            {client.company && <p className="text-gray-500 text-sm">{client.company}</p>}
          </div>
          <div className="flex gap-2">
            {client.phone && (
              <Button variant="secondary" onClick={handleWhatsApp}>
                WhatsApp
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "timeline" && (
        <div className="card p-6">
          <Timeline activities={client.activities || []} />
        </div>
      )}

      {tab === "files" && (
        <div className="space-y-4">
          <FileUpload clientId={id} onUploaded={loadClient} />
          <FileList files={client.files || []} onDeleted={loadClient} />
        </div>
      )}

      {tab === "reminders" && (
        <div className="space-y-4">
          <ReminderForm clientId={id} onCreated={loadClient} />
          <ReminderList reminders={client.reminders || []} onChanged={loadClient} />
        </div>
      )}

      {tab === "email" && (
        <form onSubmit={handleSendEmail} className="card p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Enviar email a {client.name}</h3>
          <input
            value={emailForm.subject}
            onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
            className="input-field"
            placeholder="Asunto"
            required
          />
          <textarea
            value={emailForm.body}
            onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
            className="input-field h-40 resize-none"
            placeholder="Cuerpo del email (HTML permitido)"
            required
          />
          <Button type="submit" disabled={sending}>
            {sending ? "Enviando..." : "Enviar Email"}
          </Button>
        </form>
      )}
    </div>
  );
}
