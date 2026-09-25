import { after, afterEach, before, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import {
  arrangeTestData,
  installExternalBoundaryFakes,
  resetTestBoundaries,
  setTestSession,
  readTestData,
  setTestDatastoreError,
} from "./harness";

let GET: typeof import("../../app/api/cms/profiles/route").GET;

before(async () => {
  installExternalBoundaryFakes();
  ({ GET } = await import("../../app/api/cms/profiles/route"));
});
after(() => mock.reset());
afterEach(resetTestBoundaries);

const engineering = {
  _id: "team-engineering",
  name: "Engineering",
  slug: "engineering",
};
const sales = { _id: "team-sales", name: "Sales", slug: "sales" };
const profile = (id: string, team: typeof engineering) => ({
  _id: id,
  _type: "profile" as const,
  name: id,
  uuid: `${id}-uuid`,
  slug: id,
  jobRole: "Role",
  team: [team],
});

describe("GET /api/cms/profiles", () => {
  it("returns the first page and a cursor for an admin", async () => {
    arrangeTestData({
      users: [
        { _id: "admin", email: "admin@test", permission: "Admin", team: [] },
      ],
      teams: [engineering, sales],
      profiles: [
        profile("profile-b", sales),
        profile("profile-a", engineering),
      ],
    });
    setTestSession({ user: { email: "admin@test" } });
    const response = await GET(
      new Request("http://localhost/api/cms/profiles?limit=1"),
    );
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.deepEqual(
      body.data.map((item: { _id: string }) => item._id),
      ["profile-a"],
    );
    assert.equal(body.hasMore, true);
    assert.equal(typeof body.nextCursor, "string");
  });

  it("uses the cursor for the next page and preserves team authorization", async () => {
    arrangeTestData({
      users: [
        {
          _id: "user",
          email: "user@test",
          permission: "User",
          team: [engineering],
        },
      ],
      teams: [engineering, sales],
      profiles: [
        profile("profile-a", engineering),
        profile("profile-b", sales),
        profile("profile-c", engineering),
      ],
    });
    setTestSession({ user: { email: "user@test" } });
    const first = await GET(
      new Request("http://localhost/api/cms/profiles?limit=1"),
    );
    const cursor = (await first.json()).nextCursor;
    const second = await GET(
      new Request(`http://localhost/api/cms/profiles?limit=1&cursor=${cursor}`),
    );
    const body = await second.json();
    assert.equal(second.status, 200);
    assert.deepEqual(
      body.data.map((item: { _id: string }) => item._id),
      ["profile-c"],
    );
    assert.equal(body.hasMore, false);
  });

  it("rejects an invalid limit and unauthenticated requests", async () => {
    arrangeTestData({ users: [], teams: [], profiles: [] });
    const invalid = await GET(
      new Request("http://localhost/api/cms/profiles?limit=0"),
    );
    assert.equal(invalid.status, 400);
    const unauthenticated = await GET(
      new Request("http://localhost/api/cms/profiles"),
    );
    assert.equal(unauthenticated.status, 401);
  });

  it("searches beyond the first page and combines literal, case-insensitive search with group filtering", async () => {
    const clients = { ...engineering, groups: "client" as const };
    const prospects = { ...sales, groups: "prospect" as const };
    arrangeTestData({
      users: [
        { _id: "admin", email: "admin@test", permission: "Admin", team: [] },
      ],
      teams: [clients, prospects],
      profiles: [
        { ...profile("a", clients), name: "Aaron" },
        { ...profile("b", prospects), name: "Joanne O'Neil" },
        { ...profile("z", clients), name: "Joanne O'Neil" },
        { ...profile("drafts.z", clients), name: "Joanne O'Neil" },
      ],
    });
    setTestSession({ user: { email: "admin@test" } });
    const before = readTestData();
    const first = await GET(
      new Request("http://localhost/api/cms/profiles?limit=1&sort=name-asc"),
    );
    assert.equal(first.status, 200);
    assert.deepEqual(
      (await first.json()).data.map((item: { _id: string }) => item._id),
      ["a"],
    );
    const params = new URLSearchParams({
      limit: "1",
      sort: "name-asc",
      search: "  ANNE O'  ",
      group: "client",
    });
    const response = await GET(
      new Request(`http://localhost/api/cms/profiles?${params}`),
    );
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.deepEqual(
      body.data.map((item: { _id: string }) => item._id),
      ["z"],
    );
    assert.equal(body.hasMore, false);
    assert.equal(body.nextCursor, null);
    assert.deepEqual(readTestData(), before);
  });

  for (const sort of ["name-asc", "name-desc"]) {
    it(`paginates ${sort} across duplicate names without skipping authorized matches`, async () => {
      arrangeTestData({
        users: [
          {
            _id: "user",
            email: "user@test",
            permission: "User",
            team: [engineering],
          },
        ],
        teams: [engineering, sales],
        profiles: [
          { ...profile("a", engineering), name: "Zoe Smith" },
          { ...profile("c", engineering), name: "Alice Smith" },
          { ...profile("b", engineering), name: "ALICE SMITH" },
          { ...profile("d", sales), name: "Alice Smith" },
          { ...profile("e", engineering), name: "Unrelated" },
        ],
      });
      setTestSession({ user: { email: "user@test" } });
      const ids: string[] = [];
      let cursor: string | null = null;
      for (let page = 0; page < 3; page++) {
        const params = new URLSearchParams({
          limit: "1",
          sort,
          search: "smith",
        });
        if (cursor) params.set("cursor", cursor);
        const response = await GET(
          new Request(`http://localhost/api/cms/profiles?${params}`),
        );
        assert.equal(response.status, 200);
        const body = await response.json();
        assert.equal(body.data.length, 1);
        ids.push(body.data[0]._id);
        assert.equal(body.hasMore, page < 2);
        cursor = body.nextCursor;
      }
      assert.deepEqual(
        ids,
        sort === "name-asc" ? ["b", "c", "a"] : ["a", "b", "c"],
      );
      assert.equal(cursor, null);
    });
  }

  it("returns no matches for inaccessible profiles and requires authentication for search", async () => {
    arrangeTestData({
      users: [
        {
          _id: "user",
          email: "user@test",
          permission: "User",
          team: [engineering],
        },
      ],
      teams: [engineering, sales],
      profiles: [{ ...profile("hidden", sales), name: "Hidden Person" }],
    });
    const request = new Request(
      "http://localhost/api/cms/profiles?search=hidden&sort=name-asc",
    );
    const unauthenticated = await GET(request);
    assert.equal(unauthenticated.status, 401);
    assert.deepEqual(await unauthenticated.json(), { error: "Unauthorized" });
    setTestSession({ user: { email: "user@test" } });
    const before = readTestData();
    const denied = await GET(request);
    assert.equal(denied.status, 200);
    assert.deepEqual(await denied.json(), {
      data: [],
      hasMore: false,
      nextCursor: null,
    });
    assert.deepEqual(readTestData(), before);
  });

  it("treats punctuation and wildcard characters as literal text, and blank search as all profiles", async () => {
    arrangeTestData({
      users: [
        { _id: "admin", email: "admin@test", permission: "Admin", team: [] },
      ],
      teams: [engineering],
      profiles: [
        { ...profile("a", engineering), name: "Ann* [A]" },
        { ...profile("b", engineering), name: "Anna" },
      ],
    });
    setTestSession({ user: { email: "admin@test" } });
    for (const search of ["*", "[A]", "Ann* [A]", "   "]) {
      const params = new URLSearchParams({ search, sort: "name-asc" });
      const response = await GET(
        new Request(`http://localhost/api/cms/profiles?${params}`),
      );
      assert.equal(response.status, 200);
      const body = await response.json();
      assert.deepEqual(
        body.data.map((item: { _id: string }) => item._id),
        search.trim() ? ["a"] : ["a", "b"],
      );
      assert.equal(body.nextCursor, null);
    }
  });

  it("rejects invalid search parameters and cursors from another search, group, or ordering", async () => {
    arrangeTestData({
      users: [
        { _id: "admin", email: "admin@test", permission: "Admin", team: [] },
      ],
      teams: [engineering],
      profiles: [profile("a", engineering), profile("b", engineering)],
    });
    setTestSession({ user: { email: "admin@test" } });
    const first = await GET(
      new Request("http://localhost/api/cms/profiles?limit=1&sort=name-asc"),
    );
    const { nextCursor } = await first.json();
    for (const query of [
      "sort=invalid",
      "group=invalid",
      `search=${"a".repeat(201)}`,
      "sort=name-asc&cursor=invalid",
      `sort=name-asc&search=new&cursor=${nextCursor}`,
      `sort=name-desc&cursor=${nextCursor}`,
      `sort=name-asc&group=client&cursor=${nextCursor}`,
    ]) {
      const response = await GET(
        new Request(`http://localhost/api/cms/profiles?${query}`),
      );
      assert.equal(response.status, 400, query);
      assert.equal(typeof (await response.json()).error, "string");
    }
  });

  it("returns a server error when the search datastore fails", async () => {
    arrangeTestData({ users: [], teams: [], profiles: [] });
    setTestSession({ user: { email: "admin@test" } });
    setTestDatastoreError(new Error("Datastore unavailable"));
    const response = await GET(
      new Request("http://localhost/api/cms/profiles?search=ann&sort=name-asc"),
    );
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), {
      error: "Unable to fetch profiles",
    });
  });
});
