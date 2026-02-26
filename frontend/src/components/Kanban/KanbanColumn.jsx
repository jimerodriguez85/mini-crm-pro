import { Droppable } from "@hello-pangea/dnd";
import KanbanCard from "./KanbanCard";

export default function KanbanColumn({ column, clients }) {
  return (
    <div className={`bg-gray-50 rounded-xl border-t-4 ${column.color} flex flex-col`}>
      <div className="p-3 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700 text-sm">{column.title}</h3>
        <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
          {clients.length}
        </span>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 space-y-2 overflow-y-auto min-h-[100px] transition-colors rounded-b-xl ${
              snapshot.isDraggingOver ? "bg-blue-50" : ""
            }`}
          >
            {clients.map((client, index) => (
              <KanbanCard key={client.id} client={client} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
