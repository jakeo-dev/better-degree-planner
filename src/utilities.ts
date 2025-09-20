import { CourseTile } from "./types";

// random element from array
export function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// sort courses alphabetically
export function sortCoursesAlphabetically(a: CourseTile, b: CourseTile) {
  return a.name.localeCompare(b.name);
}

// get color level (in rainbow order)
const getColorLevel = (color: string) => {
  if (color == "bg-red-200 hover:bg-red-300 focus:bg-red-300") return 6;
  else if (color == "bg-orange-200 hover:bg-orange-300 focus:bg-orange-300")
    return 5;
  else if (color == "bg-yellow-200 hover:bg-yellow-300 focus:bg-yellow-300")
    return 4;
  else if (color == "bg-green-200 hover:bg-green-300 focus:bg-green-300")
    return 3;
  else if (color == "bg-blue-200 hover:bg-blue-300 focus:bg-blue-300") return 2;
  else if (color == "bg-violet-200 hover:bg-violet-300 focus:bg-violet-300")
    return 1;
  else return 0;
};

// sort courses by color
export function sortCoursesColor(a: CourseTile, b: CourseTile) {
  return getColorLevel(b.color) - getColorLevel(a.color);
}

// sort courses by units
export function sortCoursesUnits(a: CourseTile, b: CourseTile) {
  return b.units - a.units;
}
