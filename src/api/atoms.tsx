import { atomWithStorage } from "jotai/utils";
import { CourseTile } from "@/types";

function safeUUID() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const termsAndCourses = atomWithStorage<Record<string, CourseTile[]>>(
  "courses",
  {
    outside: [
      {
        uuid: safeUUID(),
        name: "ENG 120",
        title: "Study of, Like, Filler Words",
        color: "bg-yellow-200 hover:bg-yellow-300 focus:bg-yellow-300",
        units: 3,
      },
      {
        uuid: safeUUID(),
        name: "HIST 201",
        title: "World History Since 1900",
        color: "bg-blue-200 hover:bg-blue-300 focus:bg-blue-300",
        units: 4,
      },
      {
        uuid: safeUUID(),
        name: "CS 100",
        title: "Vibe Coding",
        color: "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300",
        units: 3,
      },
    ],
    "Year 1 | 1": [
      {
        uuid: safeUUID(),
        name: "CS 102",
        title: "Introduction to Computer Science",
        color: "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300",
        units: 3,
      },
      {
        uuid: safeUUID(),
        name: "MATH 130",
        title: "Principles of Addition and Subtraction",
        color: "bg-violet-200 hover:bg-violet-300 focus:bg-violet-300",
        units: 4,
      },
    ],
    "Year 1 | 2": [
      {
        uuid: safeUUID(),
        name: "CS 220",
        title: "History of the Web",
        color: "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300",
        units: 4,
      },
      {
        uuid: safeUUID(),
        name: "BIO 180",
        title: "Anatomy of Lunar Aliens",
        color: "bg-green-200 hover:bg-green-300 focus:bg-green-300",
        units: 3,
      },
    ],
    "Year 1 | 3": [
      {
        uuid: safeUUID(),
        name: "MATH 140",
        title: "Principles of Multiplication and Division",
        color: "bg-violet-200 hover:bg-violet-300 focus:bg-violet-300",
        units: 4,
      },
      {
        uuid: safeUUID(),
        name: "Double Click to Edit Me!",
        title: "",
        color: "bg-neutral-200 hover:bg-neutral-300 focus:bg-neutral-300",
        units: 0,
      },
    ],
  }
);
