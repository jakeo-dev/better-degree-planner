import { useDraggable } from "@dnd-kit/core";
import { useRef, useEffect, useState } from "react";
import CourseModal from "./CourseModal";
import { CourseTile } from "@/types";

export default function Draggable(props: {
  course: CourseTile;
  updateCourse: (uuid: string, name: string, color: string, units: number) => void;
  className?: string;
  dropId: string; // id of parent droppable
  index?: number; // index of draggable within droppable
}) {
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseName, setCourseName] = useState(props.course.name);
  const [courseColor, setCourseColor] = useState(props.course.color);
  const [courseUnits, setCourseUnits] = useState(props.course.units);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.course.uuid,
  });

  const [repositionConstant, setRepositionConstant] = useState(0);

  useEffect(() => {
    function updateRepositionConstant() {
      setRepositionConstant(window.innerWidth >= 768 ? 11 / 9 : 0); // 0 by default, md: 11/9 ..... for some reason draggables dont need repositioning on mobile
    }

    updateRepositionConstant();
    window.addEventListener("resize", updateRepositionConstant);
    return () => window.removeEventListener("resize", updateRepositionConstant);
  }, []);

  function editCourse(newName:string, newColor:string, newUnits:number) {
    setCourseName(newName);
    setCourseColor(newColor);
    setCourseUnits(newUnits);
    props.updateCourse(props.course.uuid, newName, newColor, newUnits);
  }

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={(node) => {
          setNodeRef(node); // dnd-kit ref
          buttonRef.current = node; // ref used for re-positioning draggable
        }}
        style={{
          transform: transform
            ? `translate3d(${transform.x}px, ${transform.y + (transform && buttonRef.current && transform.y !== 0 ? ((buttonRef.current.offsetHeight*repositionConstant) * (props.index || 0)) : 0)}px, 0)` // re-position draggable because of fixed position (fixed position is NECESSARY to make draggables appear above all other elements))
            : undefined,
          touchAction: "none", // prevents default touch actions, like scrolling, when touching the draggable element (necessary for some mobile devices))
        }}
        {...listeners}
        {...attributes}
        className={`w-full max-w-28 md:max-w-32 min-h-max h-16 md:h-20 rounded-md p-2 z-10 hover:shadow-sm 
          ${props.dropId !== "outside" && transform && transform.y !== 0 ? "fixed" : "" /* if being dragged and origin term is not outside, then change position to fixed when active and being dragged so it appears above other elements */ }
          ${transform && transform.y !== 0 ? "z-99 shadow-md" : "" /* if being dragged, then apply classes (done this way so it works on mobile too) */}
          border-2 border-neutral-500/30 text-center cursor-grab active:cursor-grabbing transition-colors ${courseColor} ${props.className} ${courseModalOpen && `bg-gray-200`}`}
        onDoubleClick={() => setCourseModalOpen(true)}
        id={props.course.uuid}
      >
        <p className="wrap-break-word text-sm md:text-base leading-5 font-medium">{courseName}</p>
        <p className="wrap-break-word text-black/60 text-xs md:text-sm mt-0.5 md:mt-1">{courseUnits} unit{courseUnits != 1 ? "s" : ""}</p>
      </button>

      <CourseModal isOpen={courseModalOpen} onClose={() => setCourseModalOpen(false)} onSubmit={(newName, newColor, newUnits) => {editCourse(newName, newColor, newUnits)}} initialName={courseName} initialColor={courseColor} initialUnits={courseUnits} />
    </>
  );
}
