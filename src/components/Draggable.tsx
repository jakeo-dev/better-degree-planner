import { useDraggable } from "@dnd-kit/core";
import { useRef,useEffect, useState } from "react";
import Modal from "./Modal";
import { CourseTile } from "@/types";

export default function Draggable(props: {
  course: CourseTile;
  updateCourse: (uuid: string, name: string, color: string) => void;
  className?: string;
  dropId: string; // id of parent droppable
  number?: number; 
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [courseName, setCourseName] = useState(props.course.name);
  const [courseColor, setCourseColor] = useState(props.course.color);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.course.uuid,
  });

  const isActive = transform?.y !== 0;

  useEffect(() => {
    console.log(props.number);
    console.log(buttonRef.current ? buttonRef.current.offsetHeight : 0);
    console.log(((buttonRef.current ? buttonRef.current.offsetHeight : 0) * (props.number || 0)));
  }, [transform]);

  function editCourse(newName:string, newColor:string) {
    setCourseName(newName);
    setCourseColor(newColor);
    props.updateCourse(props.course.uuid, newName, newColor);
  }

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={(node) => {
          setNodeRef(node); // dnd-kit ref
          buttonRef.current = node; // ref for re-positioning draggable because of absolute position (absolute is NECESSARY to make draggables appear above all other elements))
        }}
        style={{
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y + (isActive && buttonRef.current && buttonRef.current.getBoundingClientRect().y < 360 ? ((buttonRef.current ? buttonRef.current.offsetHeight*1.25 : 0) * (props.number || 0)) : 0)}px, 0)`
            : undefined,
          touchAction: "none", // prevents default touch actions, like scrolling, when touching the draggable element (necessary for some mobile devices))
        }}
        {...listeners}
        {...attributes}
        className={`w-full max-w-28 md:max-w-32 min-h-max h-14 md:h-18 rounded-md p-2 z-10 hover:shadow-sm active:shadow-md active:z-999 ${props.dropId !== "outside" && transform && buttonRef.current && buttonRef.current.getBoundingClientRect().y < 360 ? "active:fixed" : ""} border-2 border-neutral-500/30 text-center cursor-grab active:cursor-grabbing transition-colors ${courseColor} ${props.className} ${modalOpen && `bg-gray-200`}`}
        onDoubleClick={() => setModalOpen(true)}
        id={props.course.uuid}
      >
        <span className="wrap-break-word text-sm md:text-base">{courseName}</span>
      </button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={(newName, newColor) => {editCourse(newName, newColor)}} initialName={courseName} initialColor={courseColor} />
    </>
  );
}
