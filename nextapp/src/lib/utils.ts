import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import kolbeStrengthJson from "@/public/json/kolbe-strengths.json";
import { KolbeStrength } from "../shared/entities/profile.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Renamed for clarity: these are the field names
export type KolbeStrengthField =
  | "factFinder"
  | "followThru"
  | "quickStart"
  | "implementer";

export type KolbeRange = "1-3" | "4-6" | "7-10";

export interface MethodDescription {
  method: string;
  description: string;
}

export function getKolbeNumericValue(
  value?: KolbeStrength
): number | undefined {
  if (!value || !isNumericKolbeValue(value)) {
    return undefined;
  }
  return parseInt(value, 10);
}

export function getKolbeDisplayValue(value?: KolbeStrength): string {
  if (!value) {
    return "-";
  }
  if (value === "inTransition") {
    return "*";
  }
  return value;
}

export function getKolbeMethod(
  value: KolbeStrength | undefined,
  field: KolbeStrengthField
): MethodDescription | undefined {
  // Handle undefined (shouldn't happen with initialValue, but be defensive)
  if (!value) {
    return undefined;
  }

  if (value === "inTransition") {
    return { method: "In Transition", description: "" };
  }

  // Parse numeric string
  const number = parseInt(value, 10);

  // Defensive check (should never happen with proper validation)
  if (isNaN(number) || number < 1 || number > 10) {
    return { method: "Invalid", description: "" };
  }

  // Determine range
  let range: KolbeRange;
  if (number >= 1 && number <= 3) {
    range = "1-3";
  } else if (number >= 4 && number <= 6) {
    range = "4-6";
  } else {
    range = "7-10";
  }

  const strengthData = kolbeStrengthJson[field];
  if (strengthData) {
    const methodDescription = strengthData[range];
    return methodDescription || undefined;
  }

  return undefined;
}

// Type guard helper (useful elsewhere in your app)
export function isNumericKolbeValue(
  value: KolbeStrength
): value is "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" {
  return !["inTransition", undefined].includes(value);
}
