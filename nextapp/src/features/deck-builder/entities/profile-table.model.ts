import { Profile } from "@/src/shared/entities/profile";

export interface ProfileTable {
  readonly id: string;
  readonly name: string;
  readonly profiles: Profile[];
}
