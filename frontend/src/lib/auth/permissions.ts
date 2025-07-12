// src/lib/auth/permissions.ts
import { UserSanity } from "@/src/lib/entities/user";
import { ProfileWithFullTeams } from "@/src/lib/entities/profile";
import { TeamWithPopulatedCompany } from "@/src/lib/entities/team";
import { getUserSanity } from "@/src/lib/data/users";
import { getUserTeams } from "@/src/lib/data/teams";
import { auth0 } from "@/src/lib/auth0";

export async function getAuthorizedUser(): Promise<UserSanity | null> {
  const session = await auth0.getSession();
  if (!session?.user) return null;

  return await getUserSanity(session.user);
}

export async function canAccessTeam(
  user: UserSanity,
  teamSlug: string,
): Promise<boolean> {
  // Admins can access any team
  if (user.permission === "Admin") return true;

  // Regular users can only access their assigned teams
  const userTeams = await getUserTeams(user.email);
  const allowedSlugs = userTeams?.teams?.map((team) => team.slug) || [];

  return allowedSlugs.includes(teamSlug);
}

export async function canAccessTeamById(
  user: UserSanity,
  teamId: string,
): Promise<boolean> {
  // Admins can access any team
  if (user.permission === "Admin") return true;

  // Regular users can only access their assigned teams
  const userTeams = await getUserTeams(user.email);
  const allowedIds = userTeams?.teams?.map((team) => team._id) || [];

  return allowedIds.includes(teamId);
}

export async function canAccessProfile(
  user: UserSanity,
  profile: ProfileWithFullTeams,
): Promise<boolean> {
  // Admins can access any profile
  if (user.permission === "Admin") return true;

  // Regular users can only access profiles from their teams
  const userTeams = await getUserTeams(user.email);
  const allowedTeamSlugs = userTeams?.teams?.map((team) => team.slug) || [];

  // Check if profile belongs to any of user's teams
  const profileTeamSlugs = profile.team?.map((team) => team.slug) || [];

  return profileTeamSlugs.some((slug) => allowedTeamSlugs.includes(slug));
}

export async function canAccessUserData(
  user: UserSanity,
  targetEmail: string,
): Promise<boolean> {
  // Admins can access any user's data
  if (user.permission === "Admin") return true;

  // Regular users can only access their own data
  return user.email === targetEmail;
}

export async function getTeamsForUserWithPermissions(
  user: UserSanity,
): Promise<TeamWithPopulatedCompany[]> {
  // Use the existing business logic that already handles permissions
  const { getTeamsForUser } = await import("@/src/lib/data/teams");
  return getTeamsForUser(user);
}

export async function getAllTeamsWithPermissions(
  user: UserSanity,
): Promise<TeamWithPopulatedCompany[]> {
  // Only admins can get all teams
  if (user.permission !== "Admin") {
    throw new Error("Only administrators can access all teams");
  }

  const { getAllTeams } = await import("@/src/lib/data/teams");
  return getAllTeams();
}

// Re-export for convenience
export { getUserTeams } from "@/src/lib/data/teams";
