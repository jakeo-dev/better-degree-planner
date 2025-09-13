import { atomWithStorage } from 'jotai/utils';
import {CourseTile} from "@/types"

function safeUUID() {
  return (typeof crypto !== "undefined" && "randomUUID" in crypto)
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const termsAndCourses = atomWithStorage<Record<string, CourseTile[]>>("courses", {
    outside: [
      { uuid: safeUUID(), name: "CS 100", color: "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300", units: 4 },
      { uuid: safeUUID(), name: "ENG 101", color: "bg-yellow-200 hover:bg-yellow-300 focus:bg-yellow-300", units: 3 },
    ],
    "Year 1 | 1": [
      { uuid: safeUUID(), name: "ENG 102", color: "bg-yellow-200 hover:bg-yellow-300 focus:bg-yellow-300", units: 4 },
      { uuid: safeUUID(), name: "CS 101", color: "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300", units: 2 },
    ],
    "Year 1 | 2": [
      { uuid: safeUUID(), name: "CS 102", color: "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300", units: 3 },
    ],
    "Year 1 | 3": [
      { uuid: safeUUID(), name: "CS 103", color: "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300", units: 4 },
    ],
    "Year 1 | 4": [
      { uuid: safeUUID(), name: "CS 104", color: "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300", units:3 },
    ],
  });
