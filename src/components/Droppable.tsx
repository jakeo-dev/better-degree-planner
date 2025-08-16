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
      className={`transition ${isOver ? "bg-gray-100" : "transparent"} ${
        props.className
      }`}
    >
      {props.children}
    </div>
  );
}
