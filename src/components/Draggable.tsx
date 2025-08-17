import { useDraggable } from "@dnd-kit/core";

export default function Draggable(props: {
  children: React.ReactNode;
  dragId: string;
  className?: string;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.dragId,
  });

  return (
    <button
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      {...listeners}
      {...attributes}
      className={`w-full h-20 bg-blue-200 rounded-md cursor-grab active:cursor-grabbing ${props.className}`}
    >
      {props.children}
    </button>
  );
}
