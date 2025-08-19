import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
import Modal from "./Modal";

export default function Draggable(props: {
  dragId: string;
  courseNameChange: (dragId: string, name: string) => void;
  className?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [courseName, setCourseName] = useState(props.dragId);
  const [courseColor, setCourseColor] = useState("bg-blue-100");
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.dragId,
  });

  function editCourse(newName:string, newColor:string) {
    setCourseName(newName);
    setCourseColor(newColor);
    props.courseNameChange(props.dragId, courseName);
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
        className={`w-full h-12 md:h-20 rounded-md cursor-grab active:cursor-grabbing ${courseColor} ${props.className} ${modalOpen && `bg-gray-200`}`}
        onDoubleClick={() => setModalOpen(true)}
      >
        <span>{courseName}</span>
      </button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={(newName, newColor) => {editCourse(newName, newColor)}} initialName={courseName} initialColor={courseColor} />
    </>
  );
}
