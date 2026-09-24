import { after, afterEach, before, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import type { AuthError } from "../../lib/auth/permissions";
import type { ProfileWithFullTeams } from "../../shared/entities/profile.types";
import {
  arrangeTestData,
  installExternalBoundaryFakes,
  resetTestBoundaries,
  setTestSession,
} from "./harness";

let auth: typeof import("../../lib/auth/permissions");

before(async () => {
  installExternalBoundaryFakes();
  auth = await import("../../lib/auth/permissions");
});

after(() => mock.reset());
afterEach(resetTestBoundaries);

const engineering = { _id: "team-engineering", name: "Engineering", slug: "engineering" };
const profile = {
  _id: "profile-alex",
  _type: "profile" as const,
  _rev: "rev-1",
  _createdAt: "2026-01-01",
  _updatedAt: "2026-01-01",
  name: "Alex Engineer",
  uuid: "profile-uuid-alex",
  slug: "alex-engineer",
  jobRole: "Engineer",
  team: [engineering],
};

describe("shared authentication and authorization boundary", () => {
  it("distinguishes anonymous, unprovisioned, and authenticated users", async () => {
    arrangeTestData({ users: [], teams: [], profiles: [] });

    assert.equal((await auth.authenticateUser()).status, "anonymous");

    setTestSession({ user: { email: "new-user@example.test" } });
    assert.deepEqual(await auth.authenticateUser(), {
      status: "unprovisioned",
      user: undefined,
      email: "new-user@example.test",
    });

    arrangeTestData({
      users: [{ _id: "user", email: "user@example.test", permission: "User", team: [] }],
      teams: [],
      profiles: [],
    });
    setTestSession({ user: { email: "user@example.test" } });
    assert.equal((await auth.authenticateUser()).status, "authenticated");
  });

  it("maps missing authentication and provisioning to typed errors", async () => {
    arrangeTestData({ users: [], teams: [], profiles: [] });

    await assert.rejects(auth.requireAuthenticatedUser(), (error: unknown) => {
      assert.equal(error instanceof (auth.AuthError as typeof AuthError), true);
      assert.equal((error as AuthError).code, "ANONYMOUS");
      assert.equal((error as AuthError).status, 401);
      return true;
    });

    setTestSession({ user: { email: "new-user@example.test" } });
    await assert.rejects(auth.requireAuthenticatedUser(), (error: unknown) => {
      assert.equal(error instanceof (auth.AuthError as typeof AuthError), true);
      assert.equal((error as AuthError).code, "UNPROVISIONED");
      assert.equal((error as AuthError).status, 404);
      return true;
    });
  });

  it("authorizes admin, same-team, own-profile, and unrelated-profile access", async () => {
    arrangeTestData({
      users: [{
        _id: "user",
        email: "user@example.test",
        permission: "User",
        team: [engineering],
        profile: { name: profile.name, uuid: profile.uuid, slug: profile.slug },
      }],
      teams: [engineering],
      profiles: [profile],
    });
    setTestSession({ user: { email: "user@example.test" } });
    const user = await auth.requireAuthenticatedUser();
    const context = await auth.createAuthorizationContext(user);

    assert.equal(await auth.canAccessTeam(context, "engineering"), true);
    assert.equal(await auth.canAccessProfile(context, profile as unknown as ProfileWithFullTeams), true);
    assert.equal(auth.canAccessUserData(user, "other@example.test"), false);
    assert.equal(auth.canAccessAdmin(user), false);

    const admin = { ...user, permission: "Admin" as const };
    assert.equal(auth.canAccessAdmin(admin), true);
    assert.equal(await auth.canAccessTeam(admin, "unrelated"), true);
  });
});
