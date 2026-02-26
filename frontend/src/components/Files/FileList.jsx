import { deleteFile, downloadUrl } from "../../services/fileService";
import { useNotification } from "../../context/NotificationContext";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileList({ files, onDeleted }) {
  const { notify } = useNotification();

  async function handleDelete(id) {
    try {
      await deleteFile(id);
      notify("Archivo eliminado");
      onDeleted?.();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  if (files.length === 0) {
    return (
      <div className="card p-8 text-center text-gray-400 text-sm">
        Sin archivos adjuntos
      </div>
    );
  }

  return (
    <div className="card divide-y">
      {files.map((f) => (
        <div key={f.id} className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
            <p className="text-xs text-gray-400">{formatSize(f.size)}</p>
          </div>
          <div className="flex gap-2">
            <a
              href={downloadUrl(f.id)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Descargar
            </a>
            <button
              onClick={() => handleDelete(f.id)}
              className="text-red-500 hover:text-red-600 text-sm font-medium"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
