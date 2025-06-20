import adventurer from "@/public/images/principle-you-archetype-images/adventurer.png";
import artisan from "@/public/images/principle-you-archetype-images/artisan.png";
import campaigner from "@/public/images/principle-you-archetype-images/campaigner.png";
import coach from "@/public/images/principle-you-archetype-images/coach.png";
import commander from "@/public/images/principle-you-archetype-images/commander.png";
import critic from "@/public/images/principle-you-archetype-images/critic.png";
import enforcer from "@/public/images/principle-you-archetype-images/enforcer.png";
import entertainer from "@/public/images/principle-you-archetype-images/entertainer.png";
import explorer from "@/public/images/principle-you-archetype-images/explorer.png";
import growthSeeker from "@/public/images/principle-you-archetype-images/growthSeeker.png";
import helper from "@/public/images/principle-you-archetype-images/helper.png";
import implementer from "@/public/images/principle-you-archetype-images/implementer.png";
import impresario from "@/public/images/principle-you-archetype-images/impresario.png";
import individualist from "@/public/images/principle-you-archetype-images/individualist.png";
import inspirer from "@/public/images/principle-you-archetype-images/inspirer.png";
import inventor from "@/public/images/principle-you-archetype-images/inventor.png";
import investigator from "@/public/images/principle-you-archetype-images/investigator.png";
import orchestrator from "@/public/images/principle-you-archetype-images/orchestrator.png";
import peacekeeper from "@/public/images/principle-you-archetype-images/peacekeeper.png";
import planner from "@/public/images/principle-you-archetype-images/planner.png";
import problemSolver from "@/public/images/principle-you-archetype-images/problemSolver.png";
import promoter from "@/public/images/principle-you-archetype-images/promoter.png";
import protector from "@/public/images/principle-you-archetype-images/protector.png";
import quietLeader from "@/public/images/principle-you-archetype-images/quietLeader.png";
import shaper from "@/public/images/principle-you-archetype-images/shaper.png";
import strategist from "@/public/images/principle-you-archetype-images/strategist.png";
import technician from "@/public/images/principle-you-archetype-images/technician.png";
import thinker from "@/public/images/principle-you-archetype-images/thinker.png";
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
