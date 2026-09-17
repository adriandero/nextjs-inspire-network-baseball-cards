import { after, afterEach, before, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { arrangeTestData, installExternalBoundaryFakes, resetTestBoundaries, setTestSession } from "./harness";

let GET: typeof import("../../app/api/cms/profiles/route").GET;

before(async () => {
  installExternalBoundaryFakes();
  ({ GET } = await import("../../app/api/cms/profiles/route"));
});
after(() => mock.reset());
afterEach(resetTestBoundaries);

const engineering = { _id: "team-engineering", name: "Engineering", slug: "engineering" };
const sales = { _id: "team-sales", name: "Sales", slug: "sales" };
const profile = (id: string, team: typeof engineering) => ({
  _id: id, _type: "profile" as const, name: id, uuid: `${id}-uuid`, slug: id, jobRole: "Role", team: [team],
});

describe("GET /api/cms/profiles", () => {
  it("returns the first page and a cursor for an admin", async () => {
    arrangeTestData({ users: [{ _id: "admin", email: "admin@test", permission: "Admin", team: [] }], teams: [engineering, sales], profiles: [profile("profile-b", sales), profile("profile-a", engineering)] });
    setTestSession({ user: { email: "admin@test" } });
    const response = await GET(new Request("http://localhost/api/cms/profiles?limit=1"));
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.deepEqual(body.data.map((item: { _id: string }) => item._id), ["profile-a"]);
    assert.equal(body.hasMore, true);
    assert.equal(typeof body.nextCursor, "string");
  });

  it("uses the cursor for the next page and preserves team authorization", async () => {
    arrangeTestData({ users: [{ _id: "user", email: "user@test", permission: "User", team: [engineering] }], teams: [engineering, sales], profiles: [profile("profile-a", engineering), profile("profile-b", sales), profile("profile-c", engineering)] });
    setTestSession({ user: { email: "user@test" } });
    const first = await GET(new Request("http://localhost/api/cms/profiles?limit=1"));
    const cursor = (await first.json()).nextCursor;
    const second = await GET(new Request(`http://localhost/api/cms/profiles?limit=1&cursor=${cursor}`));
    const body = await second.json();
    assert.equal(second.status, 200);
    assert.deepEqual(body.data.map((item: { _id: string }) => item._id), ["profile-c"]);
    assert.equal(body.hasMore, false);
  });

  it("rejects an invalid limit and unauthenticated requests", async () => {
    arrangeTestData({ users: [], teams: [], profiles: [] });
    const invalid = await GET(new Request("http://localhost/api/cms/profiles?limit=0"));
    assert.equal(invalid.status, 400);
    const unauthenticated = await GET(new Request("http://localhost/api/cms/profiles"));
    assert.equal(unauthenticated.status, 401);
  });
});
