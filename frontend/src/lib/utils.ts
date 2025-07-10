import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import kolbeStrengthJson from "@/public/json/kolbe-strengths.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type KolbeStrength =
  | "factFinder"
  | "followThru"
  | "quickStart"
  | "implementer";
export type KolbeRange = "1-3" | "4-6" | "7-10";

export interface MethodDescription {
  method: string;
  description: string;
}
export function getKolbeMethod(
  number: number | undefined,
  strength: KolbeStrength
): MethodDescription | undefined {
  if (!number || number < 1 || number > 10) {
    return { method: "In Transition...", description: "" };
  }

  let range: KolbeRange;
  if (number >= 1 && number <= 3) {
    range = "1-3";
  } else if (number >= 4 && number <= 6) {
    range = "4-6";
  } else {
    range = "7-10";
  }

  const strengthData = kolbeStrengthJson[strength];
  if (strengthData) {
    const methodDescription = strengthData[range];
    return methodDescription || undefined;
  }

  return undefined;
}
