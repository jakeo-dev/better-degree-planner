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
  onSubmit: (name: string, color: string) => void;
  initialView?: string;
  initialTerm?: string;
}

export default function Header({
  isOpen,
  onOpen,
  onClose,
  onSubmit,
  initialView,
  initialTerm,
}: HeaderProps) {
  const [viewType, setViewType] = useState(initialView || "Horizontal");
  const [termType, setTermType] = useState(initialTerm || "Semester");

  useEffect(() => {
    setViewType(initialView || "Horizontal");
    setTermType(initialTerm || "Semester");
  }, [initialView, initialTerm]);

  const { pathname } = useRouter();

  return (
    <>
      {/* Header */}
      <div className="z-20 absolute top-0 w-full text-center flex gap-2 justify-between px-5 py-3 md:px-8 md:py-6">
        <div className="flex md:block items-center text-left cursor-default">
          <h1 className="block text-xl md:text-3xl font-bold">Title</h1>
        </div>

        <div className="h-min flex gap-0.5 md:gap-2">
          <Link
            className={`${
              pathname == "/"
                ? "bg-neutral-400/20 dark:bg-neutral-300/20"
                : "hover:bg-neutral-400/15 active:bg-neutral-400/20 dark:hover:bg-neutral-300/15 dark:active:bg-neutral-300/20"
            } flex justify-center items-center rounded-md text-sm md:text-base text-left transition px-2.5 py-1.5 md:px-3 md:py-2`}
            href="/"
          >
            <LuHouse className="mr-1.5 md:mr-2" aria-hidden />
            <span className="">Home</span>
          </Link>
          <Link
            className={`${
              pathname == "/about"
                ? "bg-neutral-400/20 dark:bg-neutral-300/20"
                : "hover:bg-neutral-400/15 active:bg-neutral-400/20 dark:hover:bg-neutral-300/15 dark:active:bg-neutral-300/20"
            } flex justify-center items-center rounded-md text-sm md:text-base text-left transition px-2.5 py-1.5 md:px-3 md:py-2`}
            href="/about"
          >
            <LuInfo className="mr-1.5 md:mr-2" aria-hidden />
            <span className="">About</span>
          </Link>
          <button
            className={`${
              isOpen
                ? "rotate-90 text-green-600"
                : "hover:rotate-90 hover:text-green-600 active:rotate-180 active:text-green-700"
            } min-h-max flex justify-center items-center rounded-md text-lg md:text-xl text-left transition cursor-pointer ml-2.5 md:ml-3`}
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
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Settings</h2>

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
                  className={`flex justify-center items-center border-green-600 bg-gray-200 hover:bg-green-200 active:bg-green-300 hover:text-green-900 border-2 transition rounded-sm w-full cursor-pointer py-1 ${
                    termType === t ? "border-green-500" : "border-transparent"
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
              View System
            </label>
            <div className="flex gap-2">
              {["Horizontal", "Vertical"].map((v) => (
                <button
                  key={v}
                  onClick={() => setViewType(v)}
                  className={`flex justify-center items-center border-green-600 bg-gray-200 hover:bg-green-200 active:bg-green-300 hover:text-green-900 border-2 transition rounded-sm w-full cursor-pointer py-1 ${
                    viewType === v ? "border-green-500" : "border-transparent"
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
