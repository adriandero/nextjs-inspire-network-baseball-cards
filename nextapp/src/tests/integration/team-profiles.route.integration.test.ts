import { after, afterEach, before, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import {
  arrangeTestData,
  installExternalBoundaryFakes,
  resetTestBoundaries,
  setTestSession,
} from "./harness";

let GET: typeof import("../../app/api/cms/profiles/team-profiles/[slug]/route").GET;

before(async () => {
  installExternalBoundaryFakes();
  ({ GET } = await import("../../app/api/cms/profiles/team-profiles/[slug]/route"));
});

after(() => mock.reset());

const engineering = {
  _id: "team-engineering",
  name: "Engineering",
  slug: "engineering",
};

const sales = {
  _id: "team-sales",
  name: "Sales",
  slug: "sales",
};

const engineerProfile = {
  _id: "profile-alex",
  _type: "profile" as const,
  name: "Alex Engineer",
  uuid: "profile-uuid-alex",
  slug: "alex-engineer",
  jobRole: "Engineer",
  team: [engineering],
};

const salesProfile = {
  _id: "profile-sam",
  _type: "profile" as const,
  name: "Sam Seller",
  uuid: "profile-uuid-sam",
  slug: "sam-seller",
  jobRole: "Seller",
  team: [sales],
};

afterEach(() => {
  resetTestBoundaries();
});

describe("GET /api/cms/profiles/team-profiles/[slug]", () => {
  it("returns profiles for an authenticated user with team access", async () => {
    arrangeTestData({
      users: [
        {
          _id: "user-coach",
          email: "coach@example.test",
          permission: "User",
          team: [engineering],
        },
      ],
      teams: [engineering, sales],
      profiles: [engineerProfile, salesProfile],
    });
    setTestSession({ user: { email: "coach@example.test" } });

    const response = await GET(new Request("http://localhost/api/cms/profiles/team-profiles/engineering"), {
      params: Promise.resolve({ slug: "engineering" }),
    });

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      profiles: [
        {
          _id: engineerProfile._id,
          _type: engineerProfile._type,
          name: engineerProfile.name,
          uuid: engineerProfile.uuid,
          slug: engineerProfile.slug,
          jobRole: engineerProfile.jobRole,
          teams: [{ ...engineering, _type: "team", groups: [] }],
        },
      ],
    });
  });

  it("returns 401 for an unauthenticated request", async () => {
    arrangeTestData({ users: [], teams: [engineering], profiles: [engineerProfile] });

    const response = await GET(new Request("http://localhost/api/cms/profiles/team-profiles/engineering"), {
      params: Promise.resolve({ slug: "engineering" }),
    });

    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { error: "Unauthorized" });
  });

  it("returns 403 and does not expose another team's profiles", async () => {
    arrangeTestData({
      users: [
        {
          _id: "user-coach",
          email: "coach@example.test",
          permission: "User",
          team: [engineering],
        },
      ],
      teams: [engineering, sales],
      profiles: [engineerProfile, salesProfile],
    });
    setTestSession({ user: { email: "coach@example.test" } });

    const response = await GET(new Request("http://localhost/api/cms/profiles/team-profiles/sales"), {
      params: Promise.resolve({ slug: "sales" }),
    });

    assert.equal(response.status, 403);
    assert.deepEqual(await response.json(), {
      error: "Forbidden - you do not have access to this team",
    });
  });
});
