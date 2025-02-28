import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import kolbeStrengthJson from "../../public/kolbeStrength.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type KolbeStrength =
  | "factFinder"
  | "followThru"
  | "quickStart"
  | "implementor";
export type KolbeRange = "1-3" | "4-6" | "7-10";

export interface MethodDescription {
  method: string;
  description: string;
}
export function getKolbeMethod(
  number: number,
  strength: KolbeStrength
): MethodDescription | null {
  // Ensure the number is between 1 and 10
  if (number < 1 || number > 10) {
    return null;
  }

  // Find the correct range for the given number
  let range: KolbeRange;
  if (number >= 1 && number <= 3) {
    range = "1-3";
  } else if (number >= 4 && number <= 6) {
    range = "4-6";
  } else {
    range = "7-10";
  }

  // Retrieve and return the method and description
  const strengthData = kolbeStrengthJson[strength];
  if (strengthData) {
    const methodDescription = strengthData[range];
    return methodDescription || null;
  }

  return null;
}
