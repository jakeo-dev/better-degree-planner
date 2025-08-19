import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Droppable from "@/components/Droppable";
import Draggable from "@/components/Draggable";
import { LuCalendarPlus, LuCalendarMinus, LuCirclePlus, LuTrash2, LuRectangleHorizontal, LuRectangleVertical } from "react-icons/lu";
import { CiGrid2V, CiGrid41 } from "react-icons/ci";
import { useState, useEffect } from "react";

export default function Home() {
  const [termsCoursesData, setTermsCoursesData] = useState<Record<string, string[]>>({
    outside: ["CS 100", "ENG 101"],
    "Year 1 | Term 1": ["CS 101", "ENG 102"],
    "Year 1 | Term 2": ["CS 102"],
    "Year 1 | Term 3": ["CS 103"],
    "Year 1 | Term 4": ["CS 104"],
  });

  const [view, setView] = useState("horizontal"); // horizontal or vertical view
  const [termType, setTermType] = useState("Quarter") //quarter or semester view

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

  // Adds a term depending on the term type
  function addTerm() {
    setTermsCoursesData((prev) => {
      const lastTerm = Object.keys(prev).at(-1);
      const yearAndTerm = lastTerm?.replace("Year", "").replace("Term", "").trim().split(" | ");
      let newYear = parseInt(yearAndTerm![0]) + 1;
      if (Object.keys(prev).length <= 2) {
        newYear = 1;
      }

      const termsPerYear = termType === "Semester" ? 3 : 4;
      const newEntries: Record<string, string[]> = {};
      for (let n = 1; n <= termsPerYear; n++) {
        const newTermString = `Year ${newYear} | Term ${n}`;
        newEntries[newTermString] = [];
      }

      return { ...prev, ...newEntries };
    });
  }

  // Removes either three or four terms, depending on termType.
  function removeTerm() {
    setTermsCoursesData((prev) => {
      const keys = Object.keys(prev);
      const lastKey = keys.filter((k) => k !== "outside").at(-1);
      if (!lastKey) return prev;
      const [lastYearStr] = lastKey .replace("Year", "").replace("Term", "").trim().split(" | ");
      const lastYear = parseInt(lastYearStr);
      const termsPerYear = termType === "Semester" ? 3 : 4;
      const keysToRemove = Array.from(
        { length: termsPerYear },
        (_, i) => `Year ${lastYear} | Term ${i + 1}`
      );
      const removedCourses = keysToRemove.flatMap((k) => prev[k] || []);
      const updated: typeof prev = { ...prev };
      keysToRemove.forEach((k) => delete updated[k]);
      return {
        ...updated,
        outside: [...prev.outside, ...removedCourses],
      };
    });
  }

  // effect to sync termsCoursesData when termType changes
  useEffect(() => {
    if (termType === "Semester") {
      // remove all "Term 4" from every year
      setTermsCoursesData((prev) => {
        const updated: typeof prev = { ...prev };
        let movedCourses: string[] = [];
        Object.keys(prev).forEach((key) => {
          if (key.includes("Term 4")) {
            movedCourses = [...movedCourses, ...(prev[key] || [])];
            delete updated[key];
          }
        });
        return {
          ...updated,
          outside: [...prev.outside, ...movedCourses],
        };
      });
    } else if (termType === "Quarter") {
      setTermsCoursesData((prev) => {
        const newData: typeof prev = {};
        const keys = Object.keys(prev);
        // Sort terms by year -> term number
        const sortedKeys = keys.sort((a, b) => {
          const [yearA, termA] = a.split("|").map((s) => s.trim());
          const [yearB, termB] = b.split("|").map((s) => s.trim());
          const yearNumA = parseInt(yearA.replace("Year ", ""), 10);
          const yearNumB = parseInt(yearB.replace("Year ", ""), 10);
          if (yearNumA !== yearNumB) return yearNumA - yearNumB;
          const termNumA = parseInt(termA.replace("Term ", ""), 10);
          const termNumB = parseInt(termB.replace("Term ", ""), 10);
          return termNumA - termNumB;
        });
        // now insert the missing term 4
        for (let i = 0; i < sortedKeys.length; i++) {
          const key = sortedKeys[i];
          newData[key] = prev[key];
          const [year, term] = key.split("|").map((s) => s.trim());
          if (term === "Term 3") {
            const term4Key = `${year} | Term 4`;
            if (!(term4Key in prev)) {
              newData[term4Key] = [];
            }
          }
        }
        return newData;
      });
    }
  }, [termType]);

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
                <Draggable dragId={course} key={course} courseNameChange = {courseNameChange} className="p-2 z-99 hover:shadow-sm active:shadow-md border border-gray-400 rounded w-auto max-w-[120px] text-center">
                </Draggable>
              ))}
            </Droppable>
            
            {/* Buttons for Courses and Years */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 place-items-center mb-8 text-black">

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
                className="cursor-pointer flex flex-wrap items-center justify-center font-bold text-xl transition hover:text-green-600">
                <LuRectangleHorizontal className={`${view == "horizontal" ? "hidden" : ""} text-2xl md:text-4xl mr-1.5`} aria-hidden />
                <LuRectangleVertical className={`${view == "vertical" ? "hidden" : ""} text-2xl md:text-4xl mr-1.5`} aria-hidden />
                <span>Change View</span>
              </button>

              <button
                onClick={() => {
                  setTermType(termType == "Quarter" ? "Semester" : "Quarter");
                }}
                className="cursor-pointer flex flex-wrap items-center justify-center font-bold text-xl transition hover:text-green-600">
                <CiGrid2V className={`${termType == "Quarter" ? "hidden" : ""} text-2xl md:text-4xl mr-1.5`} aria-hidden />
                <CiGrid41 className={`${termType == "Semester" ? "hidden" : ""} text-2xl md:text-4xl mr-1.5`} aria-hidden />
                <span>{termType} System</span>
              </button>

            </div>

            {/* The rest of the terms in a grid */}
            <div className={`${view == "vertical" ? `grid ${termType == "Quarter" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3"} gap-4 md:gap-y-8 lg:gap-x-8 lg:gap-y-16 place-items-start` : "overflow-x-scroll w-full flex gap-0"} mb-10`}>
              {Object.entries(termsCoursesData)
                .filter(([term]) => term !== "outside") // exclude outside
                .map(([term, courses]) => (
                  <Droppable dropId={term} key={term} className={`${view == "vertical" ? "w-full min-h-[40vh] h-full" : "w-30 md:w-40 min-h-[60vh] border-r-0 last:border-r-2 rounded-none first:rounded-l-md last:rounded-r-md"} relative p-4 pt-12 md:pt-14 border-2 flex-shrink-0 border-gray-300 border-dashed rounded-md flex flex-col items-center gap-4`}>
                    <h2 className="absolute top-3.5 md:top-4 font-bold text-sm md:text-base">{term}</h2>
                    {courses.length > 0 ? 
                      (courses.map((course) => (
                        <Draggable dragId={course} key={course} courseNameChange = {courseNameChange} className="p-2 z-99 hover:shadow-sm active:shadow-md border border-gray-400 rounded w-auto max-w-[120px] min-h-max text-center" />
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
