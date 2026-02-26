import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard({ columns, clients, onMove }) {
  function handleDragEnd(result) {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newPipeline = destination.droppableId;
    onMove(draggableId, newPipeline);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-180px)]">
        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            clients={clients.filter((c) => c.pipeline === col.id)}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
