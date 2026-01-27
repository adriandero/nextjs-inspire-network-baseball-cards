import { Profile } from "@/src/shared/entities/profile.types";

export interface ProfileTable {
  readonly id: string;
  readonly name: string;
  readonly profiles: Profile[];
}
