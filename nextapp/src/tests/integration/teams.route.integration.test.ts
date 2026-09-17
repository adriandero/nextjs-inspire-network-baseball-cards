import { after, afterEach, before, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { arrangeTestData, installExternalBoundaryFakes, resetTestBoundaries } from "./harness";

let GET: typeof import("../../app/api/cms/teams/route").GET;
before(async () => { installExternalBoundaryFakes(); ({ GET } = await import("../../app/api/cms/teams/route")); });
after(() => mock.reset());
afterEach(resetTestBoundaries);

const team = (id: string) => ({ _id: id, name: id, slug: id });

describe("GET /api/cms/teams", () => {
  it("returns pages that can be traversed with the cursor", async () => {
    arrangeTestData({ users: [], teams: [team("team-b"), team("team-a")], profiles: [] });
    const first = await GET(new Request("http://localhost/api/cms/teams?limit=1"));
    const firstBody = await first.json();
    assert.equal(first.status, 200);
    assert.deepEqual(firstBody.data.map((item: { _id: string }) => item._id), ["team-a"]);
    const second = await GET(new Request(`http://localhost/api/cms/teams?limit=1&cursor=${firstBody.nextCursor}`));
    const secondBody = await second.json();
    assert.deepEqual(secondBody.data.map((item: { _id: string }) => item._id), ["team-b"]);
    assert.equal(secondBody.hasMore, false);
  });
});
