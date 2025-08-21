import { useDroppable } from "@dnd-kit/core";

export default function Droppable(props: {
  children: React.ReactNode;
  dropId: string;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: props.dropId,
  });

  
  return (
    <div
      ref={setNodeRef}
      className={`transition ${isOver && props.dropId === "delete" ? "bg-red-100 text-red-600" : isOver ? "bg-gray-100" : "bg-white"} ${
        props.className
      }`}
    >
      {props.children}
    </div>
  );
}
