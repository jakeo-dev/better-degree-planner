import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function Home() {
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [viewType, setViewType] = useState("Horizontal"); // horizontal or vertical view
  const [termType, setTermType] = useState("Semester"); // quarter or semester system

  useEffect(() => {
    const storedView = localStorage.getItem("viewType") || "Horizontal";
    const storedTerm = localStorage.getItem("termType") || "Semester";
    setViewType(storedView);
    setTermType(storedTerm);

    const storedFirstVisit = localStorage.getItem("firstVisit") || "true";
    if (storedFirstVisit == "false") setStartModalOpen(false);
  }, []);

  return (
    <>
      <Header
        isOpen={startModalOpen}
        onOpen={() => setStartModalOpen(true)}
        onClose={() => setStartModalOpen(false)}
        onSubmit={(view, term) => {
          localStorage.setItem("viewType", view);
          localStorage.setItem("termType", term);
        }}
        initialView={viewType}
        initialTerm={termType}
      />

      <div className="m-4 md:m-12 lg:m-20 mt-18 md:mt-24 lg:mt-24 md:mx-auto lg:mx-auto max-w-4xl md:px-6">
        <h2 className="font-bold text-xl md:text-2xl">About</h2>
        <p className="text-sm md:text-base text-pretty mt-2">
          [title] is a website where u can plan ur courses for college and stuff
        </p>

        <h2 className="font-bold text-xl md:text-2xl mt-10">How to Use</h2>
        <p className="text-sm md:text-base text-pretty mt-2">
          this is how u use the webstie
        </p>
      </div>
    </>
  );
}
