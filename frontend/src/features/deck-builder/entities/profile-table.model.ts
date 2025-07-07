import { SanityDocument } from "next-sanity";

export interface ProfileTable {
  readonly id: string;
  readonly name: string;
  readonly profiles: SanityDocument[];
}
