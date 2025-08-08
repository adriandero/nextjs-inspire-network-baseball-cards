import { Profile } from "@/src/lib/entities/profile";

type Widget = {
  wonder?: string;
  invention?: string;
  discernment?: string;
  galvanizing?: string;
  enablement?: string;
  tenacity?: string;
};

const cogTypes = [
  "wonder",
  "invention",
  "discernment",
  "galvanizing",
  "enablement",
  "tenacity",
] as const;

export function createSummaryProfile(profiles: Profile[]): Widget {
  const summaryWidget = cogTypes.reduce((aggregate, cogType) => {
    const hasGreen = profiles.some(
      (profile) => profile.workingGenius?.widget?.[cogType] === "green",
    );

    if (hasGreen) {
      aggregate[cogType] = "green";
    }

    return aggregate;
  }, {} as Widget);

  return summaryWidget;
}

export function countGreenCogsFromWidget(widget: Widget): number {
  return cogTypes.reduce((count, cogType) => {
    return widget[cogType] === "green" ? count + 1 : count;
  }, 0);
}
