import adventurer from "@/public/images/principles-you-archetypes/adventurer.png";
import artisan from "@/public/images/principles-you-archetypes/artisan.png";
import campaigner from "@/public/images/principles-you-archetypes/campaigner.png";
import coach from "@/public/images/principles-you-archetypes/coach.png";
import commander from "@/public/images/principles-you-archetypes/commander.png";
import critic from "@/public/images/principles-you-archetypes/critic.png";
import enforcer from "@/public/images/principles-you-archetypes/enforcer.png";
import entertainer from "@/public/images/principles-you-archetypes/entertainer.png";
import explorer from "@/public/images/principles-you-archetypes/explorer.png";
import growthSeeker from "@/public/images/principles-you-archetypes/growth-seeker.png";
import helper from "@/public/images/principles-you-archetypes/helper.png";
import implementer from "@/public/images/principles-you-archetypes/implementer.png";
import impresario from "@/public/images/principles-you-archetypes/impresario.png";
import individualist from "@/public/images/principles-you-archetypes/individualist.png";
import inspirer from "@/public/images/principles-you-archetypes/inspirer.png";
import inventor from "@/public/images/principles-you-archetypes/inventor.png";
import investigator from "@/public/images/principles-you-archetypes/investigator.png";
import orchestrator from "@/public/images/principles-you-archetypes/orchestrator.png";
import peacekeeper from "@/public/images/principles-you-archetypes/peacekeeper.png";
import planner from "@/public/images/principles-you-archetypes/planner.png";
import problemSolver from "@/public/images/principles-you-archetypes/problem-solver.png";
import promoter from "@/public/images/principles-you-archetypes/promoter.png";
import protector from "@/public/images/principles-you-archetypes/protector.png";
import quietLeader from "@/public/images/principles-you-archetypes/quiet-leader.png";
import shaper from "@/public/images/principles-you-archetypes/shaper.png";
import strategist from "@/public/images/principles-you-archetypes/strategist.png";
import technician from "@/public/images/principles-you-archetypes/technician.png";
import thinker from "@/public/images/principles-you-archetypes/thinker.png";
import { StaticImageData } from "next/image";

const archetypeImages: Record<string, StaticImageData> = {
  adventurer,
  artisan,
  campaigner,
  coach,
  commander,
  critic,
  enforcer,
  entertainer,
  explorer,
  growthSeeker,
  helper,
  implementer,
  impresario,
  individualist,
  inspirer,
  inventor,
  investigator,
  orchestrator,
  peacekeeper,
  planner,
  problemSolver,
  promoter,
  protector,
  quietLeader,
  shaper,
  strategist,
  technician,
  thinker,
};

export function getArchetypeImage(archetype: string): StaticImageData {
  return archetypeImages[archetype];
}
