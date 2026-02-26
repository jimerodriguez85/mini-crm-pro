import ClientRow from "./ClientRow";
import ClientCard from "./ClientCard";
import Spinner from "../UI/Spinner";

export default function ClientTable({ clients, loading, onEdit, onDelete, onView, onRefresh }) {
  if (loading) {
    return (
      <div className="card p-16 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-gray-500 text-sm">Cargando clientes...</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="card p-16 flex flex-col items-center justify-center text-center">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-gray-700 font-medium text-lg">No hay clientes registrados</p>
        <p className="text-gray-400 text-sm mt-1">Agrega tu primer cliente usando el formulario de arriba</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700">
          Lista de Clientes ({clients.length})
        </h2>
        {onRefresh && (
          <button onClick={onRefresh} className="text-gray-400 hover:text-blue-600 transition-colors p-1" title="Refrescar">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:block card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left text-gray-500 uppercase text-xs tracking-wider">
                <th className="px-4 py-3 font-semibold">Nombre</th>
                <th className="px-4 py-3 font-semibold">Contacto</th>
                <th className="px-4 py-3 font-semibold">Empresa</th>
                <th className="px-4 py-3 font-semibold">Pipeline</th>
                <th className="px-4 py-3 font-semibold">Registro</th>
                <th className="px-4 py-3 font-semibold w-24"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <ClientRow
                  key={client.id}
                  client={client}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-3">
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
}
