import { Profile } from "@/src/lib/entities/profile";

export interface ProfileTable {
  readonly id: string;
  readonly name: string;
  readonly profiles: Profile[];
}
