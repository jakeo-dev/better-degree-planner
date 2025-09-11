import { DndContext, DragEndEvent } from "@dnd-kit/core";
import Droppable from "@/components/Droppable";
import Draggable from "@/components/Draggable";
import { LuCalendarPlus, LuCalendarMinus, LuCirclePlus, LuTrash2 } from "react-icons/lu";
import { useState, useEffect } from "react";
import { CourseTile } from "@/types";
import Header from "@/components/Header";
import { randomElement } from "@/utilities";

export default function Home() {
  const [termsCoursesData, setTermsCoursesData] = useState<
    Record<string, CourseTile[]>
  >({
    outside: [
      { uuid: crypto.randomUUID(), name: "CS 100", color: "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300" },
      { uuid: crypto.randomUUID(), name: "ENG 101", color: "bg-yellow-200 hover:bg-yellow-300 focus:bg-yellow-300" },
    ],
    "Year 1 | 1": [
      { uuid: crypto.randomUUID(), name: "ENG 102", color: "bg-yellow-200 hover:bg-yellow-300 focus:bg-yellow-300" },
      { uuid: crypto.randomUUID(), name: "CS 101", color: "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300" },
    ],
    "Year 1 | 2": [
      { uuid: crypto.randomUUID(), name: "CS 102", color: "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300" },
    ],
    "Year 1 | 3": [
      { uuid: crypto.randomUUID(), name: "CS 103", color: "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300" },
    ],
    "Year 1 | 4": [
      { uuid: crypto.randomUUID(), name: "CS 104", color: "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300" },
    ],
  });

  const [startModalOpen, setStartModalOpen] = useState(true);
  const [viewType, setViewType] = useState("Horizontal"); // horizontal or vertical view
  const [termType, setTermType] = useState("Semester"); // quarter or semester system
  const [firstVisit, setFirstVisit] = useState("true"); // true if this is the user's first visit to the website

  useEffect(() => {
    const storedView = localStorage.getItem("viewType") || "Horizontal";
    const storedTerm = localStorage.getItem("termType") || "Semester";
    setViewType(storedView);
    setTermType(storedTerm);

    const storedFirstVisit = localStorage.getItem("firstVisit") || "true";
    setFirstVisit(storedFirstVisit);
    if (storedFirstVisit == "false") setStartModalOpen(false);
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    if (event.over == null) return;
    const draggedCourseUUID = String(event.active.id); // uuid of course being dragged
    const targetTerm = String(event.over.id); // name of term where the course was dropped
    const originTerm = Object.keys(termsCoursesData).find((term) => termsCoursesData[term].some((course) => course.uuid == draggedCourseUUID) ) || "outside"; // id of term where course was dragged from
    const draggedCourse = termsCoursesData[originTerm].find((course) => course.uuid == draggedCourseUUID); // entire object of the course being dragged

    if (originTerm === targetTerm || draggedCourse == undefined) return; // if course isnt dropped in a different term, do nothing
    setTermsCoursesData((prev) => {
      const newData = { ...prev };
      newData[originTerm ? originTerm : "outside"] = newData[
        originTerm ? originTerm : "outside"
      ].filter((course) => course.uuid !== draggedCourse.uuid); // remove the dragged course from the origin term
      if (targetTerm !== "delete") newData[targetTerm] = [...newData[targetTerm], draggedCourse]; // add the dragged course to the target term
      return newData;
    });
  }

  // Adds a term depending on the term type
  function addTerm() {
    setTermsCoursesData((prev) => {
      const lastTerm = Object.keys(prev).at(-1);
      const yearAndTerm = lastTerm?.replace("Year", "").trim().split(" | ");
      let newYear = parseInt(yearAndTerm![0]) + 1;
      if (Object.keys(prev).length <= 2) {
        newYear = 1;
      }

      const termsPerYear = termType === "Semester" ? 3 : 4;
      const newEntries: Record<string, CourseTile[]> = {};
      for (let n = 1; n <= termsPerYear; n++) {
        const newTermString = `Year ${newYear} | ${n}`;
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
      const [lastYearStr] = lastKey.replace("Year", "").trim().split(" | ");
      const lastYear = parseInt(lastYearStr);
      const termsPerYear = termType === "Semester" ? 3 : 4;
      const keysToRemove = Array.from(
        { length: termsPerYear },
        (_, i) => `Year ${lastYear} | ${i + 1}`
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
        let movedCourses: CourseTile[] = [];
        Object.keys(prev).forEach((key) => {
          if (key.includes("| 4")) {
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
          const termNumA = parseInt(termA.replace("", ""), 10);
          const termNumB = parseInt(termB.replace("", ""), 10);
          return termNumA - termNumB;
        });
        // now insert the missing term 4
        for (let i = 0; i < sortedKeys.length; i++) {
          const key = sortedKeys[i];
          newData[key] = prev[key];
          const [year, term] = key.split("|").map((s) => s.trim());
          if (term === "3") {
            const term4Key = `${year} | 4`;
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
        outside: [...prev.outside, {
          uuid: crypto.randomUUID(),
          name: "Double Click to Edit Me!",
          color: randomElement([
            "bg-red-200 hover:bg-red-300 focus:bg-red-300",
            "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300",
            "bg-yellow-200 hover:bg-yellow-300 focus:bg-yellow-300",
            "bg-green-200 hover:bg-green-300 focus:bg-green-300",
            "bg-blue-200 hover:bg-blue-300 focus:bg-blue-300",
            "bg-violet-200 hover:bg-violet-300 focus:bg-violet-300"
          ])
        }]
      }
    })
  }

  // updates course info from modal and saves it in termsCoursesData state
  function updateCourse(uuid: string, newName: string, newColor: string) {
    setTermsCoursesData((prev) => {
      // Create a new object to avoid mutating state
      const newData: Record<string, CourseTile[]> = {};
      // Iterate over each term
      for (const term in prev) {
        newData[term] = prev[term].map((course) =>
          course.uuid === uuid ? { uuid: uuid, name: newName, color: newColor } : course //changes name :)
        );
      }

      return newData;
    });
  }

  return (
    <>
      <Header
        isOpen={startModalOpen}
        onOpen={() => setStartModalOpen(true)}
        onClose={() => setStartModalOpen(false)}
        onSubmit={(view, term) => { 
          setViewType(view);
          setTermType(term);
          localStorage.setItem("viewType", view);
          localStorage.setItem("termType", term);

          localStorage.setItem("firstVisit", "false");
        }}
        initialView={viewType}
        initialTerm={termType}
        storedFirstVisit={firstVisit}
      />

      <DndContext onDragEnd={handleDragEnd}>
        <div className="m-4 md:m-12 lg:m-20 mt-14 md:mt-24 lg:mt-24">
          <div>
            {/* Buttons for View and System */}
            {/* <div className="grid grid-cols-2 gap-3 md:gap-6 w-full mb-6 md:mb-8 ml-auto">
              <Button 
                onClick={() => {
                  setViewType(viewType == "Vertical" ? "Horizontal" : "Vertical");
                }}
                className="hover:bg-green-200 active:bg-green-300 hover:text-green-900">
                <LuGalleryHorizontal className={`${viewType == "Vertical" ? "hidden" : ""} md:text-lg mr-1.5`} aria-hidden />
                <LuGalleryVertical className={`${viewType == "Horizontal" ? "hidden" : ""} md:text-lg mr-1.5`} aria-hidden />
                <span>{viewType} View</span>
              </Button>

              <Button 
                onClick={() => {
                  setTermType(termType == "Quarter" ? "Semester" : "Quarter");
                }}
                className="hover:bg-green-200 active:bg-green-300 hover:text-green-900">
                <LuColumns2 className={`${termType == "Quarter" ? "hidden" : ""} text-lg md:text-xl mr-1.5`} aria-hidden />
                <LuGrid2X2 className={`${termType == "Semester" ? "hidden" : ""} text-lg md:text-xl mr-1.5`} aria-hidden />
                <span>{termType} System</span>
              </Button>
            </div> */}

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 mb-6 lg:mb-8">
              <div className="flex flex-1 gap-4 md:gap-6 lg:gap-8">
                {/* "Outside" Box at the Top */}
                <Droppable dropId="outside" className="flex-1 min-h-30 md:min-h-36 border-2 border-gray-300 border-dashed rounded-md p-2.5 md:p-4">
                  <h2 className="font-bold text-sm md:text-base">Your Courses</h2>
                  <div className="flex flex-wrap items-start gap-2 md:gap-4 mt-3">
                    {termsCoursesData["outside"].map((course) => (
                      <Draggable course={course} key={course.uuid} updateCourse={updateCourse} dropId={"outside"}>
                      </Draggable>
                    ))}

                    <button onClick={addCourse} className="bg-gray-200 hover:bg-blue-200 active:bg-blue-300 hover:text-blue-900 flex items-center justify-center w-full max-w-28 md:max-w-32 min-h-max h-16 md:h-20 rounded-md p-2 text-left transition-colors cursor-pointer">
                      <LuCirclePlus className="text-xl md:text-2xl mr-2 md:mr-3" aria-hidden />
                      <span className="w-min wrap-break-word text-sm md:text-base">Add Course</span>
                    </button>
                  </div>
                </Droppable>

                {/* trash box for removing courses */}
                <Droppable dropId="delete" className="relative max-w-full max-h-30 md:max-h-36 flex-[0.1] md:flex-[0.075] text-center text-gray-400 transition border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center px-2 md:px-4">
                  <div className="w-full">
                    <LuTrash2 className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-xl md:text-3xl" aria-hidden />
                  </div>
                </Droppable>
              </div>
            </div>

            <div className={`${viewType == "Vertical" ? "mb-8" : "flex gap-4"}`}>
              {/* The rest of the terms in a grid */}
              <div className={`${viewType == "Vertical" ? `w-full grid ${termType == "Quarter" ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3"} gap-3 md:gap-y-8 lg:gap-x-6 lg:gap-y-12 place-items-start mb-8` : "w-min overflow-x-scroll flex gap-0"}`}>
                {Object.entries(termsCoursesData)
                  .filter(([term]) => term !== "outside") // exclude outside
                  .map(([term, courses]) => (
                    <Droppable dropId={term} key={term} className={`${viewType == "Vertical" ? "w-full min-h-[24vh] h-full" : "w-30 md:w-44 min-h-[60vh] border-r-0 last:border-r-2 rounded-none first:rounded-l-md last:rounded-r-md"} p-2.5 md:p-4 border-2 flex-shrink-0 border-gray-300 border-dashed rounded-md`}>
                      <div className="flex items-center justify-center flex-col md:flex-row gap-1 md:gap-1.5 font-bold text-center text-sm md:text-base">
                        <h2 className="bg-gray-100 rounded px-1.5 py-0.25">{term.split(" | ")[0]}</h2>
                        <h2 className="bg-gray-100 rounded px-1.5 py-0.25">{termType.includes("Sem") && parseInt(term.split(" | ")[1]) === 3 ? "Summer Term" : termType} {termType.includes("Sem") && parseInt(term.split(" | ")[1]) === 3 ? "" : term.split(" | ")[1]}</h2>
                      </div>
                      <div className="flex flex-col items-center gap-2 md:gap-4 mt-3">
                        {courses.length > 0 ? 
                          (courses.map((course) => (
                            <Draggable course={course} key={course.uuid} updateCourse={updateCourse} dropId={term} index={courses.indexOf(course)} />
                          )))
                          : <p className="text-gray-500 text-center text-xs md:text-sm">No courses yet...</p>
                        }
                      </div>
                    </Droppable>
                  ))}
              </div>
              
              <div className={`${viewType == "Vertical" ? "flex-row" : "flex-col"} flex gap-4 items-center justify-center`}>
                <button onClick={addTerm} className="flex items-center justify-center rounded-full w-10 md:w-16 h-10 md:h-16 bg-blue-100 hover:bg-blue-200 active:bg-blue-300 hover:text-blue-900 transition cursor-pointer">
                  <LuCalendarPlus className="text-xl md:text-3xl" aria-label="Add Year" />
                </button>
                <button onClick={removeTerm} className="flex items-center justify-center rounded-full w-10 md:w-16 h-10 md:h-16 bg-red-100 hover:bg-red-200 active:bg-red-300 hover:text-red-900 transition cursor-pointer">
                  <LuCalendarMinus className="text-xl md:text-3xl" aria-label="Remove Year" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </DndContext>
    </>
  );
}
