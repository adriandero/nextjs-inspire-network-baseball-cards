import { Permission } from "@/src/lib/auth/types";

export interface UserSanity {
  _id: string;
  email: string;
  image?: string;
  permission: Permission;
  profile?: {
    name: string;
    uuid: string;
    slug: string;
    jobRole: string;
  };
  team?: Array<{
    name: string;
    slug: string;
    groups: string[];
  }>;
}
