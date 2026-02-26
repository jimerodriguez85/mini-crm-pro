import Button from "./Button";

export default function DeleteModal({ client, onConfirm, onCancel }) {
  if (!client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl p-6 mx-4 w-full max-w-sm animate-scale-in">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Eliminar cliente?
        </h3>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="font-medium text-gray-900">{client.name}</p>
          <p className="text-sm text-gray-500">{client.email}</p>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Esta accion no se puede deshacer.
        </p>

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => onConfirm(client.id)}>
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}
