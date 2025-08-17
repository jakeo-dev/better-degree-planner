import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Droppable from "@/components/Droppable";
import Draggable from "@/components/Draggable";
import { useState } from "react";

export default function Home() {
  const [termsCoursesData, setTermsCoursesData] = useState<
    Record<string, string[]>
  >({
    outside: [],
    "1-1": ["CS 101", "ENG 102"],
    "1-2": ["CS 102"],
    "1-3": ["CS 103"],
    "1-4": ["CS 104"],
    "2-1": ["ENG 103", "CS 105"],
    "2-2": ["CS 106"],
    "2-3": ["CS 107"],
    "2-4": ["CS 108"],
    "3-1": ["ENG 110"],
    "3-2": ["CS 110"],
    "3-3": ["CS 111"],
    "3-4": ["CS 112", "ENG 104"],
    "4-1": ["CS 113", "ENG 105"],
    "4-2": ["CS 114"],
    "4-3": ["CS 115"],
    "4-4": ["CS 116"],
    "5-1": ["ENG 106", "CS 117"],
    "5-2": ["CS 118"],
    "5-3": ["ENG 107", "CS 119"],
    "5-4": ["CS 120"],
    "6-1": ["CS 121"],
    "6-2": ["ENG 111"],
    "6-3": ["CS 123"],
    "6-4": ["CS 124", "ENG 108"],
  });

  function handleDragEnd(event: DragEndEvent) {
    if (event.over == null) return;

    const targetTerm = String(event.over.id); // id of term where the course was dropped
    const draggedCourse = String(event.active.id); // id of course being dragged
    const originTerm = Object.keys(termsCoursesData).find((term) =>
      termsCoursesData[term].includes(draggedCourse)
    ); // id of term where course was dragged from

    if (originTerm === targetTerm) return; // if course isnt dropped in a different term, do nothing

    setTermsCoursesData((prev) => {
      const newData = { ...prev };

      newData[originTerm ? originTerm : "outside"] = newData[
        originTerm ? originTerm : "outside"
      ].filter((course) => course !== draggedCourse); // remove the dragged course from the origin term

      newData[targetTerm] = [...newData[targetTerm], draggedCourse as string]; // add the dragged course to the target term

      return newData;
    });
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        <div className="flex items-center justify-center h-screen">
          <div className="overflow-x-scroll w-screen flex gap-3 px-8">
            {Object.entries(termsCoursesData).map((term) => (
              // map termsCoursesData keys to droppable elements
              <Droppable
                dropId={term[0]}
                key={term[0]}
                className="relative w-50 p-4 pt-12 border-2 flex-shrink-0 h-[80vh] border-gray-300 border-dashed rounded-md flex flex-col items-center gap-4"
              >
                <span className="absolute top-3">{term[0]}</span>

                {term[1].map((course) => (
                  <Draggable // if the current term == this dropId, render the draggable course inside that term
                    dragId={course}
                    key={course}
                    className="p-2 z-99 hover:shadow-sm active:shadow-md"
                  >
                    <span>{course}</span>
                  </Draggable>
                ))}
              </Droppable>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
