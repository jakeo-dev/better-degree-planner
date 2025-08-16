import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Droppable from "@/components/Droppable";
import Draggable from "@/components/Draggable";
import { useState } from "react";

export default function Home() {
  const terms = [
    "1-1",
    "1-2",
    "1-3",
    "1-4",
    "2-1",
    "2-2",
    "2-3",
    "2-4",
    "3-1",
    "3-2",
    "3-3",
    "3-4",
    "4-1",
    "4-2",
    "4-3",
    "4-4",
    "5-1",
    "5-2",
    "5-3",
    "5-4",
    "6-1",
    "6-2",
    "6-3",
    "6-4",
  ];

  const [currentTerm, setCurrentTerm] = useState<string>("outside"); // term that the draggable course is in

  function handleDragEnd(event: DragEndEvent) {
    if (event.over && terms.includes(String(event.over.id))) {
      setCurrentTerm(String(event.over.id)); // set current term to the term where the draggable course was dropped
    } else {
      setCurrentTerm("outside"); // if the draggable course wasnt dropped in a term, move it back outside
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        {currentTerm === "outside" && ( // draggable course rendered outside
          <Draggable dragId="course-1" className="p-2 z-99">
            <span>DRAGGABLE COURSE</span>
          </Draggable>
        )}

        <div className="flex items-center justify-center h-screen">
          <div className="overflow-x-scroll w-screen flex gap-3 px-8">
            {terms.map((dropId) => (
              // map terms array to droppable elements
              <Droppable
                dropId={dropId}
                key={dropId}
                className="relative w-50 px-2 border-2 flex-shrink-0 h-[80vh] border-gray-300 border-dashed rounded-md flex items-center justify-center"
              >
                <span className="absolute top-3">{dropId}</span>

                {currentTerm === dropId && (
                  <Draggable // if the current term == this dropId, render the draggable course inside that term
                    dragId="course-1"
                    className="p-2 z-99 hover:shadow-sm active:shadow-md"
                  >
                    <span>DRAGGABLE COURSE</span>
                  </Draggable>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
