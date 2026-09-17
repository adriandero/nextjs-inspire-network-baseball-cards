import { after, afterEach, before, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import {
  arrangeTestData,
  installExternalBoundaryFakes,
  resetTestBoundaries,
  setTestSession,
} from "./harness";

let GET: typeof import("../../app/api/cms/profiles/grouped/route").GET;

before(async () => {
  installExternalBoundaryFakes();
  ({ GET } = await import("../../app/api/cms/profiles/grouped/route"));
});

after(() => mock.reset());
afterEach(() => resetTestBoundaries());

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

describe("GET /api/cms/profiles/grouped", () => {
  it("returns grouped profiles for an admin", async () => {
    arrangeTestData({
      users: [
        {
          _id: "user-admin",
          email: "admin@example.test",
          permission: "Admin",
          team: [engineering, sales],
        },
      ],
      teams: [engineering, sales],
      profiles: [engineerProfile, salesProfile],
    });
    setTestSession({ user: { email: "admin@example.test" } });

    const response = await GET();

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      teams: {
        engineering: [
          {
            _id: engineerProfile._id,
            _type: engineerProfile._type,
            name: engineerProfile.name,
            uuid: engineerProfile.uuid,
            slug: engineerProfile.slug,
            jobRole: engineerProfile.jobRole,
          },
        ],
        sales: [
          {
            _id: salesProfile._id,
            _type: salesProfile._type,
            name: salesProfile.name,
            uuid: salesProfile.uuid,
            slug: salesProfile.slug,
            jobRole: salesProfile.jobRole,
          },
        ],
      },
    });
  });

  it("filters grouped data to the authenticated user's teams", async () => {
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

    const response = await GET();

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      teams: {
        engineering: [
          {
            _id: engineerProfile._id,
            _type: engineerProfile._type,
            name: engineerProfile.name,
            uuid: engineerProfile.uuid,
            slug: engineerProfile.slug,
            jobRole: engineerProfile.jobRole,
          },
        ],
      },
    });
  });

  it("returns 401 without a session", async () => {
    arrangeTestData({ users: [], teams: [engineering], profiles: [engineerProfile] });

    const response = await GET();

    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { error: "Unauthorized" });
  });
});
