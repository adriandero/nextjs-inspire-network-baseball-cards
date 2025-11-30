import { ProfileWithBasicTeams } from "@/src/shared/entities/profile";
import {
  canAccessProfile,
  getAuthorizedUser,
} from "@/src/lib/auth/permissions";
import {
  getProfileByUuid,
  getTeammateProfiles,
} from "@/src/lib/data/queries/profiles";
import { getUserTeams } from "../queries/teams";
import { UserSanity } from "@/src/shared/entities/user";

export async function getAuthorizedTeammateProfiles(
  excludeUuid: string,
  requestingUser?: UserSanity
): Promise<ProfileWithBasicTeams[]> {
  try {
    const user = requestingUser || (await getAuthorizedUser());
    if (!user) {
      throw new Error("Unauthorized");
    }

    const excludeProfile = await getProfileByUuid(excludeUuid);
    if (!excludeProfile) {
      throw new Error("Profile not found");
    }

    const canAccess = await canAccessProfile(user, excludeProfile);
    if (!canAccess) {
      throw new Error("Forbidden - you do not have access to this profile");
    }

    if (user.permission === "Admin") {
      return await getTeammateProfiles(excludeUuid, [], true);
    }

    const userTeams = await getUserTeams(user.email);
    const allowedSlugs = userTeams?.teams?.map((t) => t.slug) || [];

    const teammates = await getTeammateProfiles(
      excludeUuid,
      allowedSlugs,
      false
    );
    return teammates;
  } catch (error) {
    console.error("Failed to get authorized teammate profiles:", error);
    throw error;
  }
}
