import { formatDate } from "../../utils/helpers";

const pipelineColors = {
  prospecto: "bg-yellow-100 text-yellow-700",
  contactado: "bg-blue-100 text-blue-700",
  cliente: "bg-green-100 text-green-700",
  cerrado: "bg-gray-100 text-gray-600",
};

export default function ClientCard({ client, onEdit, onDelete, onView }) {
  return (
    <div className="card p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onView?.(client)}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{client.name}</h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${pipelineColors[client.pipeline]}`}>
          {client.pipeline}
        </span>
      </div>
      <p className="text-sm text-gray-600">{client.email}</p>
      {client.phone && <p className="text-sm text-gray-400 mt-0.5">{client.phone}</p>}
      {client.company && <p className="text-sm text-gray-500 mt-1">{client.company}</p>}
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => onEdit?.(client)} className="flex-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md py-1.5 transition-colors">
          Editar
        </button>
        {onDelete && (
          <button onClick={() => onDelete(client)} className="flex-1 text-sm font-medium text-red-500 hover:bg-red-50 rounded-md py-1.5 transition-colors">
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}
