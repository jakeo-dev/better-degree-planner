import { CourseTile } from "./types";

// random element from array
export function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
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

// sort courses by name, then color, then units
export function sortCoursesAlphabetically(a: CourseTile, b: CourseTile) {
  if (a.name !== b.name) return a.name.localeCompare(b.name);

  if (getColorLevel(b.color) !== getColorLevel(a.color))
    return getColorLevel(b.color) - getColorLevel(a.color);

  return b.units - a.units;
}

// sort courses by color, then name, then units
export function sortCoursesColor(a: CourseTile, b: CourseTile) {
  if (getColorLevel(b.color) !== getColorLevel(a.color))
    return getColorLevel(b.color) - getColorLevel(a.color);

  if (a.name !== b.name) return a.name.localeCompare(b.name);

  return b.units - a.units;
}

// sort courses by units, then name, then color
export function sortCoursesUnits(a: CourseTile, b: CourseTile) {
  if (b.units !== a.units) return b.units - a.units;

  if (a.name !== b.name) return a.name.localeCompare(b.name);

  return getColorLevel(b.color) - getColorLevel(a.color);
}
