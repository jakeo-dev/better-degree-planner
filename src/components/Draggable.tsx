import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";

export default function Draggable(props: {
  dragId: string;
  courseNameChange: (dragId: string, name: string) => void;
  className?: string;
}) {
  const [tempName, setTempName] = useState(props.dragId);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.dragId,
  });

  function changeName() {
    const newName = window.prompt("Enter the New Course Name: ")
    if (newName !== null && newName.trim() !== "") {
      setTempName(newName.slice(0,30)); //trims string from 0 to 30
      props.courseNameChange(props.dragId, tempName);
    }
    
  }

  return (
    <>
      <button
        ref={setNodeRef}
        style={{
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
          touchAction: "none", // prevents default touch actions, like scrolling, from happening, when touching the draggable element
        }}
        {...listeners}
        {...attributes}
        className={`w-full h-12 md:h-20 rounded-md cursor-grab active:cursor-grabbing ${props.className}`}
        onDoubleClick={changeName}
      >
        <span>{tempName}</span>
      </button>

    </>
  );
}
