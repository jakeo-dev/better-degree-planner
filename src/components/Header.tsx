import Link from "next/link";
import { useRouter } from "next/router";

import {
  LuHouse,
  LuInfo,
  LuCog,
  LuGalleryHorizontal,
  LuGalleryVertical,
  LuColumns2,
  LuGrid2X2,
} from "react-icons/lu";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface HeaderProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSubmit: (viewType: string, termType: string) => void;
  initialView?: string;
  initialTerm?: string;
  storedFirstVisit?: string;
}

export default function Header({
  isOpen,
  onOpen,
  onClose,
  onSubmit,
  initialView = "Horizontal",
  initialTerm = "Semester",
  storedFirstVisit = "true",
}: HeaderProps) {
  const [viewType, setViewType] = useState(initialView || "Horizontal");
  const [termType, setTermType] = useState(initialTerm || "Semester");
  const [firstVisit, setFirstVisit] = useState(storedFirstVisit || "true");

  useEffect(() => {
    setViewType(initialView);
    setTermType(initialTerm);
    setFirstVisit(storedFirstVisit);
  }, [initialView, initialTerm, storedFirstVisit]);

  const { pathname } = useRouter();

  return (
    <>
      {/* Header */}
      <div className="z-20 absolute top-0 w-full text-center flex gap-2 justify-between px-5 py-3 md:px-8 md:py-6">
        <div className="flex items-center text-left cursor-default">
          <h1 className="block text-lg md:text-2xl font-bold">
            Better Degree Planner
          </h1>
        </div>

        <div className="h-min flex gap-1.5 md:gap-2">
          <Link
            className={`${
              pathname == "/"
                ? "bg-neutral-400/20 dark:bg-neutral-300/20"
                : "hover:bg-neutral-400/15 active:bg-neutral-400/20 dark:hover:bg-neutral-300/15 dark:active:bg-neutral-300/20"
            } flex justify-center items-center rounded-md text-lg md:text-base text-left transition p-1.5 md:px-3 md:py-2`}
            href="/"
          >
            <LuHouse className="mr-0 md:mr-2" aria-hidden />
            <span className="hidden md:inline">Home</span>
          </Link>
          <Link
            className={`${
              pathname == "/about"
                ? "bg-neutral-400/20 dark:bg-neutral-300/20"
                : "hover:bg-neutral-400/15 active:bg-neutral-400/20 dark:hover:bg-neutral-300/15 dark:active:bg-neutral-300/20"
            } flex justify-center items-center rounded-md text-lg md:text-base text-left transition p-1.5 md:px-3 md:py-2`}
            href="/about"
          >
            <LuInfo className="mr-0 md:mr-2" aria-hidden />
            <span className="hidden md:inline">About</span>
          </Link>
          <button
            className={`${
              isOpen
                ? "rotate-90 text-blue-600"
                : "hover:rotate-90 hover:text-blue-600 active:rotate-180 active:text-blue-700"
            } min-h-max flex justify-center items-center rounded-md text-lg md:text-xl text-left transition cursor-pointer ml-1.5 md:ml-3`}
            onClick={() => {
              onOpen();
            }}
          >
            <LuCog className="transition" aria-hidden />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <div
        className={`${
          isOpen ? "" : "hidden"
        } fixed inset-0 flex items-center justify-center bg-black/50 z-50`}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        <div className="bg-gray-100 rounded-2xl shadow-xl w-[95vw] max-w-md p-6 relative animate-fadeIn">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <FaTimes size={20} aria-label="Close modal" title="Close modal" />
          </button>

          {/* Modal Title */}
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {firstVisit == "true" ? "Let's Get Started" : "Settings"}
          </h2>

          {/* Term System */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Term System
            </label>
            <div className="flex gap-2">
              {["Semester", "Quarter"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTermType(t)}
                  className={`flex justify-center items-center bg-gray-200 hover:bg-blue-200 active:bg-blue-300 hover:text-blue-900 border-2 transition rounded-sm w-full cursor-pointer py-1 ${
                    termType === t ? "border-blue-500" : "border-transparent"
                  }`}
                >
                  <LuColumns2
                    className={`${
                      t == "Quarter" ? "hidden" : ""
                    } text-lg md:text-xl mr-1.5`}
                    aria-hidden
                  />
                  <LuGrid2X2
                    className={`${
                      t == "Semester" ? "hidden" : ""
                    } text-lg md:text-xl mr-1.5`}
                    aria-hidden
                  />
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              View Type
            </label>
            <div className="flex gap-2">
              {["Horizontal", "Vertical"].map((v) => (
                <button
                  key={v}
                  onClick={() => setViewType(v)}
                  className={`flex justify-center items-center bg-gray-200 hover:bg-blue-200 active:bg-blue-300 hover:text-blue-900 border-2 transition rounded-sm w-full cursor-pointer py-1 ${
                    viewType === v ? "border-blue-500" : "border-transparent"
                  }`}
                >
                  <LuGalleryHorizontal
                    className={`${
                      v == "Vertical" ? "hidden" : ""
                    } md:text-lg mr-1.5`}
                    aria-hidden
                  />
                  <LuGalleryVertical
                    className={`${
                      v == "Horizontal" ? "hidden" : ""
                    } md:text-lg mr-1.5`}
                    aria-hidden
                  />
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onSubmit(viewType, termType);
                onClose();
              }}
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
