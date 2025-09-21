type Archetype = {
  id: string;
  label: string;
};

type ArchetypeGroup = {
  category: string;
  archetypes: Archetype[];
};

export const PRINCIPLES_YOU_ARCHETYPES: ArchetypeGroup[] = [
  {
    category: "Enthusiasts",
    archetypes: [
      { id: "entertainer", label: "Entertainer" },
      { id: "promoter", label: "Promoter" },
      { id: "impresario", label: "Impresario" },
    ],
  },
  {
    category: "Advocates",
    archetypes: [
      { id: "inspirer", label: "Inspirer" },
      { id: "coach", label: "Coach" },
      { id: "campaigner", label: "Campaigner" },
    ],
  },
  {
    category: "Givers",
    archetypes: [
      { id: "helper", label: "Helper" },
      { id: "problemSolver", label: "Problem Solver" },
      { id: "peacekeeper", label: "Peacekeeper" },
    ],
  },
  {
    category: "Leaders",
    archetypes: [
      { id: "shaper", label: "Shaper" },
      { id: "quietLeader", label: "Quiet Leader" },
      { id: "commander", label: "Commander" },
    ],
  },
  {
    category: "Architects",
    archetypes: [
      { id: "orchestrator", label: "Orchestrator" },
      { id: "strategist", label: "Strategist" },
      { id: "planner", label: "Planner" },
    ],
  },
  {
    category: "Producers",
    archetypes: [
      { id: "technician", label: "Technician" },
      { id: "implementer", label: "Implementer" },
      { id: "investigator", label: "Investigator" },
    ],
  },
  {
    category: "Creators",
    archetypes: [
      { id: "artisan", label: "Artisan" },
      { id: "inventor", label: "Inventor" },
      { id: "adventurer", label: "Adventurer" },
    ],
  },
  {
    category: "Seekers",
    archetypes: [
      { id: "explorer", label: "Explorer" },
      { id: "thinker", label: "Thinker" },
      { id: "growthSeeker", label: "Growth Seeker" },
    ],
  },
  {
    category: "Fighters",
    archetypes: [
      { id: "critic", label: "Critic" },
      { id: "enforcer", label: "Enforcer" },
      { id: "protector", label: "Protector" },
    ],
  },
  {
    category: "Individualist",
    archetypes: [{ id: "individualist", label: "Individualist" }],
  },
] as const;
