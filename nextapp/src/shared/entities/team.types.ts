import { SanityAsset } from "./common.types";
import { Company, CompanyWithDetails } from "./company.types";

export interface Team {
  _id: string;
  _type: "team";
  name: string;
  slug: string;
  teamLogo?: SanityAsset;
  company?: Company;
  isameriprise: boolean;
  groups?: "client" | "egf" | "prospect";
}

export interface TeamWithPopulatedCompany {
  _id: string;
  _type: "team";
  _rev: string;
  _createdAt: string;
  _updatedAt: string;
  _originalId?: string;
  name: string;
  slug: string;
  teamLogo?: SanityAsset;
  company?: {
    name: string;
    slug: string;
  };
  isameriprise: boolean;
  groups?: "client" | "egf" | "prospect";
}

export interface TeamWithDetails extends Team {
  company?: CompanyWithDetails;
  _createdAt?: string;
  _updatedAt?: string;
  _rev?: string;
}

export interface UserTeamsResponse {
  teams: TeamWithPopulatedCompany[];
}
