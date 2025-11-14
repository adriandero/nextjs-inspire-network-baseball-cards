import { Profile } from "@/src/lib/entities/profile";
type CogColor = "green" | "yellow" | "red";

type Widget = {
  wonder?: CogColor;
  invention?: CogColor;
  discernment?: CogColor;
  galvanizing?: CogColor;
  enablement?: CogColor;
  tenacity?: CogColor;
};

const cogTypes = [
  "wonder",
  "invention",
  "discernment",
  "galvanizing",
  "enablement",
  "tenacity",
] as const;

const COLOR_PRIORITY: Record<CogColor, number> = {
  green: 1,
  yellow: 2,
  red: 3,
};

export function countGreenCogsFromWidget(widget: Widget): number {
  return cogTypes.reduce((count, cogType) => {
    return widget[cogType] === "green" ? count + 1 : count;
  }, 0);
}

function getHighestPriorityCog(
  profiles: Profile[],
  cogType: keyof Widget
): CogColor | undefined {
  let bestColor: CogColor | undefined = undefined;

  for (const profile of profiles) {
    const color = profile.workingGenius?.widget?.[cogType];

    if (!color || !(color in COLOR_PRIORITY)) continue;

    const typedColor = color as CogColor;
    if (typedColor === "green") return "green";
    if (!bestColor || COLOR_PRIORITY[typedColor] < COLOR_PRIORITY[bestColor]) {
      bestColor = typedColor;
    }
  }

  return bestColor;
}

export function createSummaryProfile(profiles: Profile[]): Widget {
  return cogTypes.reduce((aggregate, cogType) => {
    const bestCog = getHighestPriorityCog(profiles, cogType);

    if (bestCog) {
      aggregate[cogType] = bestCog;
    }

    return aggregate;
  }, {} as Widget);
}
