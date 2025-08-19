import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
import Modal from "./Modal";
import { CourseTile } from "@/types";

export default function Draggable(props: {
  course: CourseTile;
  updateCourse: (uuid: string, name: string, color: string) => void;
  className?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [courseName, setCourseName] = useState(props.course.name);
  const [courseColor, setCourseColor] = useState(props.course.color);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.course.uuid,
  });

  function editCourse(newName:string, newColor:string) {
    setCourseName(newName);
    setCourseColor(newColor);
    props.updateCourse(props.course.uuid, newName, newColor);
  }

  return (
    <>
      <button
        ref={setNodeRef}
        style={{
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
          touchAction: "none", // prevents default touch actions, like scrolling, when touching the draggable element (necessary for some mobile devices))
        }}
        {...listeners}
        {...attributes}
        className={`w-full h-12 md:h-20 rounded-md cursor-grab active:cursor-grabbing ${courseColor} ${props.className} ${modalOpen && `bg-gray-200`}`}
        onDoubleClick={() => setModalOpen(true)}
        id={props.course.uuid}
      >
        <span className="wrap-break-word">{courseName}</span>
      </button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={(newName, newColor) => {editCourse(newName, newColor)}} initialName={courseName} initialColor={courseColor} />
    </>
  );
}
