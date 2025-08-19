import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Droppable from "@/components/Droppable";
import Draggable from "@/components/Draggable";
import { LuCalendarPlus, LuCalendarMinus, LuCirclePlus, LuTrash2, LuRectangleHorizontal, LuRectangleVertical } from "react-icons/lu";
import { useState } from "react";

export default function Home() {
  const [termsCoursesData, setTermsCoursesData] = useState<Record<string, string[]>>({
    outside: ["CS 100", "ENG 101"],
    "Year 1, Term 1": ["CS 101", "ENG 102"],
    "Year 1, Term 2": ["CS 102"],
    "Year 1, Term 3": ["CS 103"],
    "Year 1, Term 4": ["CS 104"],
  });

  const [view, setView] = useState("horizontal"); // horizontal or vertical view

  function handleDragEnd(event: DragEndEvent) {
    if (event.over == null) return;
    const targetTerm = String(event.over.id); // id of term where the course was dropped
    const draggedCourse = String(event.active.id); // id of course being dragged
    const originTerm = Object.keys(termsCoursesData).find((term) => termsCoursesData[term].includes(draggedCourse) ); // id of term where course was dragged from
    if (originTerm === targetTerm) return; // if course isnt dropped in a different term, do nothing
    setTermsCoursesData((prev) => {
      const newData = { ...prev };
      newData[originTerm ? originTerm : "outside"] = newData[
        originTerm ? originTerm : "outside"
      ].filter((course) => course !== draggedCourse); // remove the dragged course from the origin term
      if (targetTerm !== "delete") newData[targetTerm] = [...newData[targetTerm], draggedCourse as string]; // add the dragged course to the target term
      return newData;
    });
  }

  function addTerm() { //takes last term's year then adds four more terms to the next year
    const lastTerm = Object.keys(termsCoursesData).at(-1);
    const yearAndTerm = lastTerm?.replace("Year", "").replace("Term", "").trim().split(", ");
    let newTerm = parseInt(yearAndTerm![0])+1;
    if (Object.keys(termsCoursesData).length <= 2) {
      newTerm = 1;
    }
    //Adds four new terms
    for (let n=1; n <= 4; n++) {
      const newTermString = "Year " + newTerm.toString() + ", Term " + n.toString();
      setTermsCoursesData(prev => ({
        ...prev,
        [newTermString]: [] // the [] is the course list
      }));
    }
  }

  function removeTerm() {
    setTermsCoursesData(prev => {
      const keys = Object.keys(prev);
      const lastKey = keys.filter(k => k !== "outside").at(-1); //looks for the last term (year)
      if (!lastKey) return prev;
      const [lastYearStr] = lastKey.replace("Year", "").replace("Term", "").trim().split(", ");
      const lastYear = parseInt(lastYearStr); //taking the process from addTerm 
      // build the 4 term keys for that year
      const keysToRemove = Array.from({ length: 4 }, (_, i) => `Year ${lastYear}, Term ${i + 1}`);
      const removedCourses = keysToRemove.flatMap(k => prev[k] || []);
      // Build new object without those terms
      const updated: typeof prev = { ...prev };
      keysToRemove.forEach(k => {
        delete updated[k];
      });
      // any courses from the removed terms are added to "outside"
      return {
        ...updated,
        outside: [...prev.outside, ...removedCourses],
      };
    });
  }

  function addCourse() {
    setTermsCoursesData((prev) => {
      return {
        ...prev, 
        outside:[...prev.outside, "Double Click Me to Change My Name!"]
      }
    })
  }

  function courseNameChange(dragId: string, name: string){
    setTermsCoursesData((prev) => {
      // Create a new object to avoid mutating state
      const newData: Record<string, string[]> = {};
      // Iterate over each term
      for (const term in prev) {
        newData[term] = prev[term].map((course) =>
          course === dragId ? name : course //changes name :)
        );
      }
      return newData;
    });
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div>
        <div className="items-center justify-center">
          <div className="m-6 md:m-12 lg:m-20">

            {/* "Outside" Box at the Top */}
            <Droppable dropId="outside" className="relative w-full min-h-[150px] border-2 border-gray-300 border-dashed rounded-md flex flex-wrap items-start gap-3 p-4 pt-12 md:pt-14 mb-8">
              <h2 className="absolute top-3.5 md:top-4 font-bold text-sm md:text-base">Your Courses</h2>
              {termsCoursesData["outside"].map((course) => (
                <Draggable dragId={course} key={course} courseNameChange = {courseNameChange} className="p-2 z-99 hover:shadow-sm active:shadow-md border border-gray-400 rounded bg-blue-100 w-auto max-w-[120px] text-center">
                </Draggable>
              ))}
            </Droppable>
            
            {/* Buttons for Courses and Years */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 place-items-center mb-8 text-black">

              <button onClick={addCourse} className="cursor-pointer flex flex-wrap items-center justify-center font-bold text-xl transition hover:text-blue-600">
                <LuCirclePlus className="text-2xl md:text-4xl mr-1.5" aria-hidden />
                <span>Add Course</span>
              </button>

              <Droppable dropId="delete">
              <button className="cursor-pointer flex flex-wrap items-center justify-center font-bold text-xl transition">
                <LuTrash2 className="text-2xl md:text-4xl mr-1.5" aria-hidden />
                <span>Remove Course</span>
              </button>
              </Droppable>

              <button onClick={addTerm} className="cursor-pointer flex flex-wrap items-center justify-center font-bold text-xl transition hover:text-blue-600">
                <LuCalendarPlus className="text-2xl md:text-4xl mr-1.5" aria-hidden />
                <span>Add Year</span>
              </button>

              <button
                onClick={removeTerm}
                className="cursor-pointer flex flex-wrap items-center justify-center font-bold text-xl transition hover:text-red-600">
                <LuCalendarMinus className="text-2xl md:text-4xl mr-1.5" aria-hidden />
                <span>Remove Year</span>
              </button>

              <button
                onClick={() => {
                  setView(view == "vertical" ? "horizontal" : "vertical");
                }}
                className="cursor-pointer flex flex-wrap items-center justify-center font-bold text-xl transition hover:text-blue-600">
                <LuRectangleHorizontal className={`${view == "horizontal" ? "hidden" : ""} text-2xl md:text-4xl mr-1.5`} aria-hidden />
                <LuRectangleVertical className={`${view == "vertical" ? "hidden" : ""} text-2xl md:text-4xl mr-1.5`} aria-hidden />
                <span>Change View</span>
              </button>
            </div>

            {/* The rest of the terms in a grid */}
            <div className={`${view == "vertical" ? "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-y-8 lg:gap-x-8 lg:gap-y-16 place-items-start" : "overflow-x-scroll w-full flex gap-0"} mb-10`}>
              {Object.entries(termsCoursesData)
                .filter(([term]) => term !== "outside") // exclude outside
                .map(([term, courses]) => (
                  <Droppable dropId={term} key={term} className={`${view == "vertical" ? "w-full min-h-[40vh] h-full" : "w-30 md:w-40 min-h-[60vh] border-r-0 last:border-r-2 rounded-none first:rounded-l-md last:rounded-r-md"} relative p-4 pt-12 md:pt-14 border-2 flex-shrink-0 border-gray-300 border-dashed rounded-md flex flex-col items-center gap-4`}>
                    <h2 className="absolute top-3.5 md:top-4 font-bold text-sm md:text-base">{term}</h2>
                    {courses.length > 0 ? 
                      (courses.map((course) => (
                        <Draggable dragId={course} key={course} courseNameChange = {courseNameChange} className="p-2 z-99 hover:shadow-sm active:shadow-md border border-gray-400 rounded bg-blue-100 w-auto max-w-[120px] min-h-max text-center" />
                      )))
                      : <span className="text-gray-500 text-center text-sm md:text-base">No courses yet...</span>
                    }
                  </Droppable>
                ))}
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
