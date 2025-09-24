import { useEffect, useState } from "react";
import {LuCog} from "react-icons/lu";
import Header from "@/components/Header";
import Head from "next/head"

export default function Home() {
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [viewType, setViewType] = useState("Horizontal"); // horizontal or vertical view
  const [termType, setTermType] = useState("Semester"); // quarter or semester system
  const [sortType, setSortType] = useState("None"); // sort by name, color, units, or none
  const [firstVisit, setFirstVisit] = useState("true"); // true if this is the user's first visit to the website

  useEffect(() => {
    const storedView = localStorage.getItem("viewType") || "Horizontal";
    const storedTerm = localStorage.getItem("termType") || "Semester";
    const storedSort = localStorage.getItem("sortType") || "None";
    setViewType(storedView);
    setTermType(storedTerm);
    setSortType(storedSort);

    const storedFirstVisit = localStorage.getItem("firstVisit") || "true";
    setFirstVisit(storedFirstVisit);
    if (storedFirstVisit == "false") setStartModalOpen(false);
  }, []);

  return (
    <>
      <Head> {/* <Head> works for pages router. For app router, use export const metadata. */}
        <title>About | MajorMap</title>
        <meta
          name="description"
          content="Plan your degree progress with an interactive flowchart and selectable classes."
        />
        <meta property="og:title" content="MajorMap" />
        <meta property="og:description" content="Plan your degree progress with MajorMap." />
        <meta property="og:type" content="website" />
        </Head>
      <Header
        isOpen={startModalOpen}
        onOpen={() => setStartModalOpen(true)}
        onClose={() => setStartModalOpen(false)}
        onSubmit={(view, term, sort) => {
          setViewType(view);
          setTermType(term);
          setSortType(sort);
          localStorage.setItem("viewType", view);
          localStorage.setItem("termType", term);
          localStorage.setItem("sortType", sort);
        }}
        initialView={viewType}
        initialTerm={termType}
        initialSort={sortType}
        storedFirstVisit={firstVisit}
      />

      <div className="m-4 md:m-12 lg:m-20 mt-18 md:mt-24 lg:mt-24 md:mx-auto lg:mx-auto max-w-3xl md:px-6">
        <h2 className="font-bold text-xl md:text-2xl">About</h2>
          <p className="text-sm md:text-base text-pretty mt-2">
            MajorMap allows students to plan their degree progress
            using an interactive flowchart.
          </p>
        <h2 className="font-bold text-xl md:text-2xl mt-6 md:mt-10">Features</h2>
          <p className="text-sm md:text-base text-pretty mt-2">
            Plan your degree with an interactive flowchart. Drag and drop courses into
            semesters or quarters, customize class details, and instantly see how your
            academic path comes together. Add more terms to your degree pathway, 
            and stay organized as you map out your journey from start to graduation.
          </p>

        <h2 className="font-bold text-xl md:text-2xl mt-6 md:mt-10">How to Use</h2>
          <p className="text-sm md:text-base text-pretty mt-2">
            Add classes by dragging them into your timeline. Double-click a course to edit
            its name, units, or style. Click on the calendar icons to add more terms
            to your flowchart. Open the settings icon in the top-right corner
            (<LuCog className="inline w-4 h-4 transition hover:rotate-90 hover:text-blue-600 active:rotate-180 active:text-blue-700" />) 
             to switch between semester and quarter views, adjust the flowchart layout, or sort
            courses within each term. 
          </p>
           <p className="text-sm md:text-base text-pretty font-semibold mt-2">
            Courses and relevant site data (type of term system, sorting configuration, etc) are stored in the user's local cache. 
            Clearing your web browser's cache resets these configurations.
           </p>
        <h2 className="font-bold text-xl md:text-2xl mt-6 md:mt-10">Attributes</h2>
          <p className="text-sm md:text-base text-pretty mt-2">
            Built by{" "}
            <a
              href="https://github.com/jakeo-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              Jake
            </a>{" "}
            and{" "}
            <a
              href="https://github.com/hoverdart"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              Shaurya
            </a>
            {" "}with Next.js, Tailwind CSS Styling, and Dnd-Kit.<br />
            Icon from{" "}
            <a
              href="https://www.flaticon.com/free-icons/degree"
              title="degree icons"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Smashicons – Flaticon
            </a>
            .
          </p>

      </div>
    </>
  );
}
