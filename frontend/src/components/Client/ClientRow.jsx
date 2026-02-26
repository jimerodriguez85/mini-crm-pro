import { formatDate } from "../../utils/helpers";

const pipelineColors = {
  prospecto: "bg-yellow-100 text-yellow-700",
  contactado: "bg-blue-100 text-blue-700",
  cliente: "bg-green-100 text-green-700",
  cerrado: "bg-gray-100 text-gray-600",
};

export default function ClientRow({ client, onEdit, onDelete, onView }) {
  return (
    <tr
      className="border-b border-gray-100 hover:bg-blue-50/40 transition-colors cursor-pointer"
      onClick={() => onView?.(client)}
    >
      <td className="px-4 py-4">
        <span className="font-medium text-gray-900">{client.name}</span>
      </td>
      <td className="px-4 py-4">
        <div>
          <p className="text-gray-700">{client.email}</p>
          {client.phone && <p className="text-gray-400 text-xs mt-0.5">{client.phone}</p>}
        </div>
      </td>
      <td className="px-4 py-4 text-gray-600">{client.company || "--"}</td>
      <td className="px-4 py-4">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${pipelineColors[client.pipeline] || ""}`}>
          {client.pipeline}
        </span>
      </td>
      <td className="px-4 py-4 text-gray-500 text-xs">{formatDate(client.createdAt)}</td>
      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <button onClick={() => onEdit?.(client)} className="text-gray-400 hover:text-blue-600 transition-colors p-1" title="Editar">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {onDelete && (
            <button onClick={() => onDelete(client)} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Eliminar">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
