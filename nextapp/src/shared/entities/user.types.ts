export interface UserSanity {
  _id: string;
  email: string;
  image?: string;
  permission: "Admin" | "User" | "Guest";
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
