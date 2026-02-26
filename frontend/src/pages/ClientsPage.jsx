import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClients } from "../hooks/useClients";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import SearchBar from "../components/UI/SearchBar";
import DeleteModal from "../components/UI/DeleteModal";
import ClientForm from "../components/Client/ClientForm";
import ClientTable from "../components/Client/ClientTable";

export default function ClientsPage() {
  const { clients, loading, search, setSearch, addClient, editClient, removeClient, reload } =
    useClients();
  const { notify } = useNotification();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function handleSubmit(data) {
    try {
      if (editing) {
        await editClient(editing.id, data);
        notify("Cliente actualizado");
        setEditing(null);
      } else {
        await addClient(data);
        notify("Cliente creado");
      }
    } catch (err) {
      notify(err.message, "error");
    }
  }

  async function handleDelete(id) {
    try {
      await removeClient(id);
      notify("Cliente eliminado");
      setDeleting(null);
    } catch (err) {
      notify(err.message, "error");
    }
  }

  function handleEdit(client) {
    setEditing(client);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Clientes</h1>

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="mb-8">
        <ClientForm
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={editing ? () => setEditing(null) : null}
        />
      </div>

      <ClientTable
        clients={clients}
        loading={loading}
        onEdit={handleEdit}
        onDelete={isAdmin ? setDeleting : null}
        onView={(client) => navigate(`/clients/${client.id}`)}
        onRefresh={() => reload(search)}
      />

      <DeleteModal
        client={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
