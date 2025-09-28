import { useDraggable } from "@dnd-kit/core";
import { useRef, useEffect, useState } from "react";
import CourseModal from "./CourseModal";
import { CourseTile } from "@/types";

export default function Draggable(props: {
  course: CourseTile;
  updateCourse: (uuid: string, name: string, title: string, color: string, units: number) => void;
  className?: string;
  dropId: string; // id of parent droppable
  index?: number; // index of draggable within droppable
}) {
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseName, setCourseName] = useState(props.course.name);
  const [courseTitle, setCourseTitle] = useState(props.course.title);
  const [courseColor, setCourseColor] = useState(props.course.color);
  const [courseUnits, setCourseUnits] = useState(props.course.units);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.course.uuid,
  });

  function editCourse(newName: string, newTitle: string, newColor: string, newUnits: number) {
    setCourseName(newName);
    setCourseTitle(newTitle);
    setCourseColor(newColor);
    setCourseUnits(newUnits);
    props.updateCourse(props.course.uuid, newName, newTitle, newColor, newUnits);
  }

  // repositioning for outside droppable
  const [repositionConstant, setRepositionConstant] = useState(0);
  useEffect(() => {
    function updateRepositionConstant() {
      setRepositionConstant(window.innerWidth >= 768 ? 11 / 9 : 0); // 0 by default, md: 11/9 ..... for some reason it doesnt need repositioning on mobile
    }

    // update constant when window resized
    updateRepositionConstant();
    window.addEventListener("resize", updateRepositionConstant);
    return () => window.removeEventListener("resize", updateRepositionConstant);
  }, []);

  const buttonRef = useRef<HTMLButtonElement>(null);

  // position for term droppables
  const [position, setPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // handle starting dragging
  function handleMouseDown() {
    setIsDragging(true);
  }

  useEffect(() => {
    function handleMouseMove(e: globalThis.MouseEvent) {
      if (isDragging) {
        // update position of draggable when it is being dragged
        setPosition({
          x: e.clientX - 60, // center draggable horizontally
          y: e.clientY + window.scrollY - 36, // center draggable vertically
        });
      }
    }

    function handleMouseMoveMobile(e: globalThis.TouchEvent) {
      if (isDragging && e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        // update position of draggable when it is being dragged
        setPosition({
          x: touch.clientX - 60, // center draggable horizontally
          y: touch.clientY + window.scrollY - 36, // center draggable vertically
        });
      }
    }

    // stop dragging on mouse up
    function handleMouseUp() {
      setIsDragging(false);
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleMouseMoveMobile);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMoveMobile);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      <button
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        ref={(node) => {
          setNodeRef(node); // dnd-kit ref
          buttonRef.current = node; // ref used for re-positioning draggables in outside droppable
        }}
        style={{
          transform: props.dropId == "outside" && transform
            ? `translate3d(${transform.x}px, ${transform.y + (transform && buttonRef.current && transform.y !== 0 ? ((buttonRef.current.offsetHeight*repositionConstant) * (props.index || 0)) : 0)}px, 0)` // IF in outside droppable, re-position draggable because of fixed position (fixed position is NECESSARY to make draggables appear above all other elements)
            : undefined,
          touchAction: "none", // prevents default touch actions, like scrolling, when touching the draggable element (necessary for some mobile devices)
          left: props.dropId !== "outside" ? position.x : undefined, // dont use absolute positioning if draggable is in outside droppable
          top: props.dropId !== "outside" ? position.y : undefined, // dont use absolute positioning if draggable is in outside droppable
        }}
        {...listeners}
        {...attributes}
        className={`w-full max-w-28 md:max-w-34 min-h-max  rounded-md p-1.5 md:p-2.5 z-10 hover:shadow-sm 
          ${transform && (transform.x !== 0 || transform.y !== 0) ? (props.dropId == "outside" ? "relative" : "absolute") : "" /* if being dragged and origin term is outside, then change position to fixed when active and being dragged so it appears above other elements, if not outside, use absolute positioning */ }
          ${transform && transform.y !== 0 ? "z-99 shadow-md" : "" /* if being dragged, then apply classes (done this way so it works on mobile too) */}
          border-2 border-neutral-500/30 text-center cursor-grab active:cursor-grabbing transition-colors ${courseColor} ${props.className}`}
        onDoubleClick={() => setCourseModalOpen(true)}
        id={props.course.uuid}
      >
        <div className="relative w-full h-full flex justify-center">
          <div className="pb-5 md:pb-6.5">
            <p className="wrap-break-word text-sm md:text-base leading-5 font-[600] md:font-[550]">{courseName}</p>
            <p className={`${courseTitle == "" ? "hidden" : ""} wrap-break-word text-black/80 text-[0.65rem] md:text-xs mt-0.5 md:mt-1`}>{courseTitle}</p>
          </div>
          <div className="absolute bottom-0">
            <p className="wrap-break-word text-black/60 text-xs md:text-sm">{courseUnits} unit{courseUnits != 1 ? "s" : ""}</p>
          </div>
        </div>
      </button>

      <CourseModal isOpen={courseModalOpen} onClose={() => setCourseModalOpen(false)} onSubmit={(newName, newTitle, newColor, newUnits) => {editCourse(newName, newTitle, newColor, newUnits)}} initialName={courseName} initialTitle={courseTitle} initialColor={courseColor} initialUnits={courseUnits} />
    </>
  );
}
