import { SanityAsset } from "./common.types";

export interface Company {
  _id: string;
  _type: "company";
  name: string;
  slug: string;
  companyLogo?: SanityAsset;
}

export interface CompanyWithDetails extends Company {
  _createdAt?: string;
  _updatedAt?: string;
  _rev?: string;
}
