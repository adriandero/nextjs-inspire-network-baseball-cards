import { SanityAsset } from "./common";
import { TeamWithPopulatedCompany } from "./team";
import workingGeniusJson from "@/public/json/working-genius.json";

export interface Widget {
  wonder?: string;
  invention?: string;
  discernment?: string;
  galvanizing?: string;
  enablement?: string;
  tenacity?: string;
}

export interface Profile {
  _id: string;
  _type: "profile";
  _rev: string;
  _createdAt: string;
  _updatedAt: string;
  _originalId?: string;
  name: string;
  uuid: string;
  slug: string;
  jobRole: string[];
  values?: string[];
  profileImage?: SanityAsset;
  workingGenius?: {
    title?: keyof typeof workingGeniusJson;
    widget?: Widget;
  };
  principleYouArchetype?: string[];
  principleYouArchetypeLeast?: string[];
  kolbeStrengths?: {
    factFinder?: number;
    followThru?: number;
    quickStart?: number;
    implementer?: number;
  };
}

export interface ProfileWithBasicTeams extends Profile {
  teams?: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
}

export interface ProfileWithDetailedTeams extends Profile {
  teams?: TeamWithPopulatedCompany[];
}

export interface ProfileWithFullTeams extends Profile {
  team?: Array<{
    name: string;
    slug: string;
    isameriprise: boolean;
    company?: {
      _id: string;
      _type: "company";
      name: string;
      slug: string;
      companyLogo?: SanityAsset;
    };
    teamLogo?: {
      asset: {
        url: string;
        metadata?: {
          dimensions?: {
            width: number;
            height: number;
          };
        };
      };
    };
  }>;
}

export interface ProfilesFromUserTeams {
  teamProfiles: ProfileWithDetailedTeams[];
}

export interface ProfilesByTeam {
  teams: {
    [teamSlug: string]: Profile[];
  };
}

export interface TeamWithProfiles {
  slug: string;
  name: string;
  company?: {
    name: string;
    slug: string;
  };
  profiles: Profile[];
}

export interface GroupedProfilesResponse {
  teams: TeamWithProfiles[];
}
