import { Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";

export default function KanbanCard({ client, index }) {
  const navigate = useNavigate();

  return (
    <Draggable draggableId={client.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => navigate(`/clients/${client.id}`)}
          className={`bg-white rounded-lg p-3 shadow-sm border cursor-pointer hover:shadow-md transition-shadow ${
            snapshot.isDragging ? "shadow-lg ring-2 ring-blue-400" : ""
          }`}
        >
          <p className="font-medium text-gray-900 text-sm">{client.name}</p>
          <p className="text-gray-500 text-xs mt-1">{client.email}</p>
          {client.company && (
            <p className="text-gray-400 text-xs mt-0.5">{client.company}</p>
          )}
        </div>
      )}
    </Draggable>
  );
}
