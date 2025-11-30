import { UserSanity } from "@/src/shared/entities/user";
import { ProfileWithFullTeams } from "@/src/shared/entities/profile";
import { TeamWithPopulatedCompany } from "@/src/shared/entities/team";
import { getUserSanity } from "@/src/lib/data/queries/users";
import { getUserTeams } from "@/src/lib/data/queries/teams";
import { auth0 } from "@/src/lib/auth0";

export async function getAuthorizedUser(): Promise<UserSanity | undefined> {
  const session = await auth0.getSession();
  if (!session?.user) return undefined;

  return await getUserSanity(session.user);
}

export async function canAccessTeam(
  user: UserSanity,
  teamSlug: string
): Promise<boolean> {
  if (user.permission === "Admin") return true;

  const userTeams = await getUserTeams(user.email);
  const allowedSlugs = userTeams?.teams?.map((team) => team.slug) || [];

  return allowedSlugs.includes(teamSlug);
}

export async function canAccessTeamById(
  user: UserSanity,
  teamId: string
): Promise<boolean> {
  if (user.permission === "Admin") return true;

  const userTeams = await getUserTeams(user.email);
  const allowedIds = userTeams?.teams?.map((team) => team._id) || [];

  return allowedIds.includes(teamId);
}

export async function canAccessProfile(
  user: UserSanity,
  profile: ProfileWithFullTeams
): Promise<boolean> {
  if (user.permission === "Admin") return true;

  const userTeams = await getUserTeams(user.email);
  const allowedTeamSlugs = userTeams?.teams?.map((team) => team.slug) || [];

  const profileTeamSlugs = profile.team?.map((team) => team.slug) || [];
  return (
    profileTeamSlugs.some((slug) => allowedTeamSlugs.includes(slug)) ||
    user.profile?.slug === profile?.slug
  );
}

export async function canAccessUserData(
  user: UserSanity,
  targetEmail: string
): Promise<boolean> {
  if (user.permission === "Admin") return true;

  return user.email === targetEmail;
}

export async function getTeamsForUserWithPermissions(
  user: UserSanity
): Promise<TeamWithPopulatedCompany[]> {
  const { getTeamsForUser } = await import("@/src/lib/data/queries/teams");
  return getTeamsForUser(user);
}

export async function getAllTeamsWithPermissions(
  user: UserSanity
): Promise<TeamWithPopulatedCompany[]> {
  if (user.permission !== "Admin") {
    throw new Error("Only administrators can access all teams");
  }

  const { getAllTeams } = await import("@/src/lib/data/queries/teams");
  return getAllTeams();
}
