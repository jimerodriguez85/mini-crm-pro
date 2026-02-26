import { useState } from "react";
import { useClients } from "../hooks/useClients";
import { useNotification } from "../context/NotificationContext";
import SearchBar from "../components/UI/SearchBar";
import DeleteModal from "../components/UI/DeleteModal";
import ClientForm from "../components/Client/ClientForm";
import ClientTable from "../components/Client/ClientTable";

export default function Dashboard() {
  const { clients, loading, search, setSearch, addClient, editClient, removeClient, reload } =
    useClients();
  const { notify } = useNotification();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function handleSubmit(data) {
    try {
      if (editing) {
        await editClient(editing.id, data);
        notify("Cliente actualizado exitosamente");
        setEditing(null);
      } else {
        await addClient(data);
        notify("Cliente creado exitosamente");
      }
    } catch (err) {
      notify(err.message, "error");
    }
  }

  async function handleDeleteConfirm(id) {
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

  function handleCancel() {
    setEditing(null);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">MINI-CRM</h1>
        <p className="text-gray-500 text-sm mt-0.5">Gestion simplificada de clientes</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Form - always visible */}
      <div className="mb-8">
        <ClientForm
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={editing ? handleCancel : null}
        />
      </div>

      {/* Table */}
      <ClientTable
        clients={clients}
        loading={loading}
        onEdit={handleEdit}
        onDelete={setDeleting}
        onRefresh={() => reload(search)}
      />

      {/* Delete confirmation modal */}
      <DeleteModal
        client={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
