import { auth0 } from "@/src/lib/auth0";
import { getUserSanity } from "@/src/lib/data/queries/users";
import { getUserTeams } from "@/src/lib/data/queries/teams";
import { ProfileWithFullTeams } from "@/src/shared/entities/profile.types";
import { TeamWithPopulatedCompany } from "@/src/shared/entities/team.types";
import { UserSanity } from "@/src/shared/entities/user.types";
import { AuthError, AuthenticationResult, PERMISSIONS } from "./types";

export * from "./types";

/** Resolve identity only from the server-side Auth0 session. */
export async function authenticateUser(): Promise<AuthenticationResult> {
  const session = await auth0.getSession();
  if (!session?.user) return { status: "anonymous", user: undefined };

  const user = await getUserSanity(session.user);
  if (!user) {
    return {
      status: "unprovisioned",
      user: undefined,
      email: session.user.email ?? "",
    };
  }

  return { status: "authenticated", user };
}

/** Require a provisioned Sanity user, preserving distinct auth failures. */
export async function requireAuthenticatedUser(): Promise<UserSanity> {
  const result = await authenticateUser();
  if (result.status === "anonymous") {
    throw new AuthError("ANONYMOUS", "Authentication required", 401);
  }
  if (result.status === "unprovisioned") {
    throw new AuthError("UNPROVISIONED", "User profile not found", 404);
  }
  return result.user;
}

/** Backwards-compatible nullable helper for routes not yet migrated. */
export async function getAuthorizedUser(): Promise<UserSanity | undefined> {
  const result = await authenticateUser();
  return result.status === "authenticated" ? result.user : undefined;
}

export interface AuthorizationContext {
  readonly user: UserSanity;
  readonly teamSlugs: ReadonlySet<string>;
  readonly teamIds: ReadonlySet<string>;
}

/** Build an authorization snapshot so one operation performs one membership lookup. */
export async function createAuthorizationContext(
  user: UserSanity,
): Promise<AuthorizationContext> {
  if (user.permission === PERMISSIONS.ADMIN) {
    return { user, teamSlugs: new Set(), teamIds: new Set() };
  }

  const teams = (await getUserTeams(user.email))?.teams ?? [];
  return {
    user,
    teamSlugs: new Set(teams.map((team) => team.slug)),
    teamIds: new Set(teams.map((team) => team._id)),
  };
}

type AuthorizationSubject = UserSanity | AuthorizationContext;

function isContext(subject: AuthorizationSubject): subject is AuthorizationContext {
  return "teamSlugs" in subject && "teamIds" in subject;
}

async function contextFor(subject: AuthorizationSubject): Promise<AuthorizationContext> {
  return isContext(subject) ? subject : createAuthorizationContext(subject);
}

export function canAccessAdmin(user: UserSanity): boolean {
  return user.permission === PERMISSIONS.ADMIN;
}

export function requireAdmin(user: UserSanity): void {
  if (!canAccessAdmin(user)) {
    throw new AuthError("FORBIDDEN", "Administrator access required", 403);
  }
}

export async function canAccessTeam(
  subject: AuthorizationSubject,
  teamSlug: string,
): Promise<boolean> {
  const context = await contextFor(subject);
  return canAccessAdmin(context.user) || context.teamSlugs.has(teamSlug);
}

export async function canAccessTeamById(
  subject: AuthorizationSubject,
  teamId: string,
): Promise<boolean> {
  const context = await contextFor(subject);
  return canAccessAdmin(context.user) || context.teamIds.has(teamId);
}

export async function canAccessProfile(
  subject: AuthorizationSubject,
  profile: ProfileWithFullTeams,
): Promise<boolean> {
  const context = await contextFor(subject);
  if (canAccessAdmin(context.user)) return true;

  return (
    profile.team?.some((team) => context.teamSlugs.has(team.slug)) ?? false
  ) || context.user.profile?.slug === profile.slug;
}

export function canAccessUserData(user: UserSanity, targetEmail: string): boolean {
  return canAccessAdmin(user) || user.email === targetEmail;
}

export async function getTeamsForUserWithPermissions(
  user: UserSanity,
): Promise<TeamWithPopulatedCompany[]> {
  const { getTeamsForUser } = await import("@/src/lib/data/queries/teams");
  return getTeamsForUser(user);
}

export async function getAllTeamsWithPermissions(
  user: UserSanity,
): Promise<TeamWithPopulatedCompany[]> {
  requireAdmin(user);
  const { getAllTeams } = await import("@/src/lib/data/queries/teams");
  return getAllTeams();
}
