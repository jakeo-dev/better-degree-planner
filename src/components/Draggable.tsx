import { useDraggable } from "@dnd-kit/core";
import { SetStateAction, useState } from "react";

export default function Draggable(props: {
  dragId: string;
  courseNameChange: (dragId: string, name: string) => void;
  className?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(props.dragId);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.dragId,
  });

  function changeName() {
    setIsEditing(true);
  }

  function handleInputChange(e: { target: { value: SetStateAction<string> } }) {
    setTempName(e.target.value);
  }

  function onEnterPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setIsEditing(false);
      props.courseNameChange(props.dragId, tempName);
    }
  }

  function onLoseFocus() {
    setIsEditing(false);
    props.courseNameChange(props.dragId, tempName);
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

      {isEditing && (
        <input
          value={tempName}
          onChange={handleInputChange}
          onKeyDown={onEnterPress}
          onBlur={onLoseFocus} // saves on click-away
          autoFocus
          className="bg-white text-center rounded-md"
        />
      )}
    </>
  );
}
